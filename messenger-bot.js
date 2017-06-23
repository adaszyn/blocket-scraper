const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
    token: 'EAADCUdppQl0BAHxC9ncSdq6oE1e3I71l1VqzAMAEKYLjOzgZC7B7KVSuukYuFDZATgLjieVGjKBF0l0JBjFBQCJsOjyJxY5B6pIMTakKA1TC7ZBTW7T8uezRZAMG4yf8dIzNrCbxMt52TTe4HvGUEnKbUflULSAGh7AoqcUnKtCRGPgt6Eb7',
    verify: 'VERIFY_TOKEN',
    app_secret: '363ef0099aab56cada8b78ac7774a4de'
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    let text = payload.message.text

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        reply({ text }, (err) => {
            if (err) throw err

            console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        })
    })
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')