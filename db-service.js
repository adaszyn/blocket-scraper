const moment = require('moment')
const knex = require('./db')
const CHUNK_SIZE = 50


function insertOffer(offer) {
    const q = knex('offers')
        .insert({
            title: offer.title,
            rooms: offer.rooms,
            size: offer.size,
            rent: offer.rent,
            link: offer.link,
            publish_date: offer.date,
            image_url: offer.imageSrc
        })
    console.log(q.toString());
    return q
}

function mapObjectToRow(offer) {
    return {
        title: offer.title,
        rooms: offer.rooms,
        size: offer.size,
        rent: offer.rent,
        link: offer.link,
        publish_date: offer.date,
        image_url: offer.imageSrc
    }
}

function getLinks() {
    return knex('offers')
        .select('link')
        .then(rows => rows.map(row => row.link))
}

function conditionallyInsertOffers(offers) {
    return getLinks()
        .then((links) => {
            const linksDict = links.reduce((dict, link) => {
                dict[link] = true
                return dict
            }, {})
            const filteredOffers = offers.filter((offer) => !(linksDict[offer.link]))
            return knex.batchInsert('offers', filteredOffers.map(mapObjectToRow), CHUNK_SIZE)
                .returning('id')
        })
}

function getUserByMID(mid) {
    return knex('users')
        .select('*')
        .where('mid', '=', mid)
}

async function registerUser(user) {
    const existingUser = await getUserByMID(user.mid)
    console.log('existing user', existingUser)
    if (existingUser.length) {
        return knex('users')
            .update({
                is_subscribed: true,
                registered_at: moment().format()
            })
            .where('mid', '=', user.mid)
    } else {
        return knex('users')
            .insert({
                name: user.first_name,
                surname: user.last_name,
                gender: user.gender,
                mid: user.mid,
                profile_pic: user.profile_pic,
                registered_at: moment().format(),
                is_subscribed: true
            })
    }
}

async function unregisterUser(user) {
    const existingUser = await getUserByMID(user.mid)
    if (existingUser) {
        return knex('users')
            .update({
                is_subscribed: false
            })
            .where('mid', '=', user.mid)
    }
}
module.exports = {
    insertOffer,
    conditionallyInsertOffers,
    unregisterUser,
    registerUser
}