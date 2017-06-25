const Bot = require('messenger-bot')
const {getSubscribedUsers, getOffersByIds} = require('./db-service')

let bot = new Bot({
    token: 'EAADCUdppQl0BAHxC9ncSdq6oE1e3I71l1VqzAMAEKYLjOzgZC7B7KVSuukYuFDZATgLjieVGjKBF0l0JBjFBQCJsOjyJxY5B6pIMTakKA1TC7ZBTW7T8uezRZAMG4yf8dIzNrCbxMt52TTe4HvGUEnKbUflULSAGh7AoqcUnKtCRGPgt6Eb7',
    verify: 'messenger-token-verify123',
    app_secret: '363ef0099aab56cada8b78ac7774a4de'
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