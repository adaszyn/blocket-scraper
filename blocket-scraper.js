require('dotenv').config()

const cheerio = require('cheerio')
const request = require('request-promise-native')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const {conditionallyInsertOffers} = require("./db-service")


const BLOCKET_URL = 'https://www.blocket.se/bostad/uthyres/stockholm?sort=&ss=&se=&ros=&roe=&bs=&be=&mre=&q=&q=&q=&is=1&save_search=1&l=0&md=th&f=p&f=c&f=b'
const IMAGE_REGEX = /\b(?:background\-image\s*?: url\(\s*([^;>]*?)\)(?=[;">}]))/g;
const DIGIT_REGEX = /\d/g


function requestBlocketPage() {
    return request(BLOCKET_URL)
}

function numericValueWithSuffixToNumber(rentString) {
    let m
    let result = ''
    while (m = DIGIT_REGEX.exec(rentString)) {
        result += m[0]
    }
    return Number(result)
}

function parseDate(dateString) {
    return moment(dateString + '+02').format()
}

function parsePageToOffers(pageBody) {
    const $ = cheerio.load(pageBody, {normalizeWhitespace: true})
    const offerSections = $('.item_row').map(function (index, item) {
        return cheerio.html(item)
    })

    const offerObjects = offerSections.map(function (index, element) {
        const $section = cheerio.load(element)
        const rent = numericValueWithSuffixToNumber($section('.media-body .monthly_rent').text().trim())
        const title = $section('.media-body > .media-heading').text().trim()
        const rooms = numericValueWithSuffixToNumber($section('.media-body .rooms').text().trim())
        const size = numericValueWithSuffixToNumber($section('.media-body .size').text().trim())
        const link = $section('.media-body > .vi-link-overlay').attr('href')
        const date = parseDate($section('.media-body > .jlist_date_image').attr('datetime').trim())
        const imageUrl = $section('.sprite_list_placeholder > a').attr('style')

        const result = typeof imageUrl === 'string' ? IMAGE_REGEX.exec(imageUrl) : null
        const imageSrc = Array.isArray(result) ? result[1] : null
        return {
            title,
            rooms,
            size,
            rent,
            link,
            date,
            imageSrc
        }
    })


    return offerObjects.toArray()
}

function scrapeBlocket() {
    return requestBlocketPage()
        .then(page => parsePageToOffers(page))
        .then(conditionallyInsertOffers)
        .catch((err) => {
            console.error(err);
        })
}

module.exports = {
    parsePageToOffers,
    numericValueWithSuffixToNumber,
    parseDate,
    scrapeBlocket
}

scrapeBlocket();
