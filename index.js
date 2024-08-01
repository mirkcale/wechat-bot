import { WechatyBuilder } from 'wechaty'
import { MemoryCard } from 'memory-card'
import { FileBox } from 'file-box'

import './src/utils/polyfill.js'

const memoryCard = new MemoryCard('profile')
async function main() {
    await memoryCard.load()
    const bot = WechatyBuilder.build({
        name: 'wechatyName-name',
        memory: memoryCard,
    })
    const { resolve, _, promise: Logined } = Promise.withResolvers()
    const { resolve: contactListPromiseResolve, _reject, promise: contactListPromise } = Promise.withResolvers()
    const 辣妹 = FileBox.fromUrl('https://q7.itc.cn/q_70/images03/20240528/ad5662918fa14fbba23cce59b2aa010f.jpeg', {
        name: '辣妹.jpg'
    })
    const name = 'xyz'
    bot
        .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
        .on('login', user => {
            console.log(`User ${user} logged in`)
            resolve(user)
        })
        .on('ready', async () => {
            const contactList = await bot.Contact.findAll();
            contactListPromiseResolve(contactList)
        })
        .on('message', async message => {
            const contact = message.talker(); // 消息发送人
            const listener = message.listener(); // 消息接收人
            if(listener?.name() === name ) {
                console.log(`发给${name}的消息`)
                // 由该程序发送的消息不会触发此事件
            }
            if(contact?.name() === name) {
                await message.say('你好,要看辣妹吗？')
                await message.say(辣妹)
            }
            console.log(`Message: ${message}`)
        })
    await bot.start();
    await Logined;
    await contactListPromise;
}

main()
    .catch(console.error)

process.on('SIGINT', async () => {
    console.log('保存数据')
    await memoryCard.save();
    process.exit(0)
})