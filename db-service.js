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

module.exports = {
    insertOffer,
    conditionallyInsertOffers
}