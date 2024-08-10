import { Res } from './onebotv11/api/api2'

export default class Onebot {
    bot: WebSocket | null
    url: string
    msgQueue: any[]
    res: Res | null
    constructor() {
        this.url = 'ws://127.0.0.1:23306/onebot/v11/ws'
        this.bot = null
        this.msgQueue = []
        this.res = null
    }

    connect(uin:number) {
        this.bot = new WebSocket(this.url)
        this.bot.addEventListener('open', (e) => {
            this.bot?.send(JSON.stringify({"time":"123456789","self_id":114514,"post_type":"meta_event","meta_event_type":"lifecycle","sub_type":"connect"}))
            console.log('ws连接成功！' + e.target)
            this.res = new Res(this.bot as WebSocket)
        })

        this.bot.addEventListener('message', (e) => {
            console.log('ws收到服务端消息:')
            console.log(e.data)
            this.msgQueue.push(JSON.parse(e.data))
            this.res?.parse_action(JSON.parse(e.data))
        })

        this.bot.addEventListener('close', (e) => {
            console.log('ws服务端关闭！' + JSON.stringify(e))

        })
      
        this.bot.addEventListener('error', async (e) => {
            console.log('ws出错！' + JSON.stringify(e))
            this.bot?.close()
    
        })
    }


}