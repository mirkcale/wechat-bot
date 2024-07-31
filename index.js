import { WechatyBuilder } from 'wechaty'
import { MemoryCard } from 'memory-card'

import './src/utils/polyfill.js'

const memoryCard = new MemoryCard('profile')
async function main() {
    await memoryCard.load()
    const bot = WechatyBuilder.build({
        name: 'wechatyName-name',
        memory: memoryCard,
    })
    const { resolve, _, promise: Logined } = Promise.withResolvers()
    bot
        .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
        .on('login', user => {
            console.log(`User ${user} logged in`)
            resolve(user)
        })
        .on('ready', async () => {
            const cs = await bot.Contact.findAll().then(list => list.filter(c => c.friend()))
            const xx = await bot.Contact.findAll('沈鑫鑫')
            console.log(xx)
            console.log(cs)
        })
        .on('message', message => console.log(`Message: ${message}`))
    await bot.start()
    await Logined

}

main()
    .catch(console.error)

process.on('SIGINT', async () => {
    console.log('保存数据')
    await memoryCard.save();
    process.exit(0)
})