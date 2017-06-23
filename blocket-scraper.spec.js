const {expect} = require('chai')
const path = require('path')
const fs = require('fs')
const {parseDate, numericValueWithSuffixToNumber, parsePageToOffers} = require('./blocket-scraper')


describe('blocket-scraper', () => {
    describe('parsePageToOffers function', () => {
        const samplePage = fs.readFileSync(path.join(__dirname, 'blocket-sample-page.html'))
        const parsedOffers = parsePageToOffers(samplePage.toString())
        const testEntry = {
            title: 'Rum att hyra nära t-bana',
            rooms: '1 rum',
            size: '14 m²',
            rent: '4 200 kr/mån',
            link: 'https://www.blocket.se/stockholm/Rum_att_hyra_nara_t_bana_73953986.htm?ca=11&w=1',
            date: '2017-06-22 10:25:02',
            imageSrc: null
        }

        it('should contain 50 entries', () => {
            expect(parsedOffers.length).to.equal(50)
        })
        it('should return objects with proper structure', () => {
            for (let offer of parsedOffers) {
                expect('title' in offer).to.equal(true)
                expect('rooms' in offer).to.equal(true)
                expect('size' in offer).to.equal(true)
                expect('rent' in offer).to.equal(true)
                expect('link' in offer).to.equal(true)
                expect('date' in offer).to.equal(true)
                expect('imageSrc' in offer).to.equal(true)
            }
        })
    })

    describe('numericValueWithSuffixToNumber function', () => {
        it('should return a numeric representation of some value', () => {
            expect(numericValueWithSuffixToNumber('4 200 kr/mån')).to.be.equal(4200)
            expect(numericValueWithSuffixToNumber('14 m²')).to.be.equal(14)
            expect(numericValueWithSuffixToNumber('1 rum')).to.be.equal(1)

        })
    })
    describe('parseDate function', () => {
        it('should return timestamp of given date', () => {
            expect(parseDate('2017-06-22 10:25:02')).to.equal('2017-06-22T10:25:02+02:00')
        })
    })
})