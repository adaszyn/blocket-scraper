const Bot = require('messenger-bot')
const {getSubscribedUsers, getOffersByIds} = require('./db-service')

let bot = new Bot({
    token: process.env.TOKEN,
    verify: process.env.VERIFY_TOKEN,
    app_secret: process.env.APP_SECRET
})

async function notifyUsersAboutOffers(offersIds) {
    const userIds = await getSubscribedUsers()
    const offers = await getOffersByIds(offersIds)
    console.log('offerIds', offersIds)
    console.log('Sending offers', offers)
    console.log('To users:', userIds)
    for (let {mid} of userIds) {
        for (let offer of offers) {
            console.log(`...sending offer ${offer.id} to ${mid}`);
            await sendMessage(mid, offer)
            if (offer.image_url) {
                await sendAttachment(mid, offer)
            }
        }
    }
}

function sendMessage(mid, offer) {
    return new Promise((resolve, reject) => {
        bot.sendMessage(String(mid), {
            text: `New offer!\nTitle: ${offer.title}\nRooms: ${offer.rooms}\nSize: ${offer.size}\nLink: ${offer.link},\nRent: ${offer.rent}`
        }, (err, info) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            console.log(info)
            resolve(info)
        })
    })
}


function sendAttachment(mid, offer) {
    return new Promise((resolve, reject) => {
        bot.sendMessage(String(mid), {
            attachment: {
                type: 'image',
                payload: offer.image_url
            }
        }, (err, info) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            console.log(info)
            resolve(info)
        })
    })
}

module.exports = {
    notifyUsersAboutOffers
}