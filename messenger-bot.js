const http = require('http')
const Bot = require('messenger-bot')
const {registerUser, unregisterUser} = require("./db-service")

let bot = new Bot({
    token: process.env.TOKEN,
    verify: process.env.VERIFY_TOKEN,
    app_secret: process.env.APP_SECRET
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    let text = payload.message.text

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err
        const user = buildUserObject(payload.sender.id, profile)
        if (text === 'register') {
            return registerUser(user).then(() => {
                replyToMessagerBot(reply, 'registering your subscription', profile)
            })
        } else if (text === 'unregister') {
            return unregisterUser(user).then(() => {
                replyToMessagerBot(reply, 'unregistering your subscription', profile)
            })
        } else {
            replyToMessagerBot(reply, 'Unknown command, use: "register" or "unregister"')
        }
    })
})

function buildUserObject(id, profile) {
    return Object.assign({}, profile, {mid: id})
}

function replyToMessagerBot(reply, text, profile) {
    reply({ text }, (err) => {
        if (err) throw err
        console.log(`Message sent to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
}

http.createServer(bot.middleware()).listen(4000)
console.log('Echo bot server running at port 3000.')