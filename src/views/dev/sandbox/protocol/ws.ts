import useDevStore from '@/store/modules/dev'; 
import useUserStore from '@/store/modules/user'; 
import Events from '../protocol/onebotv11/event/event'
import msgQueueController from './onebotv11/queue/msgQueue'
import { Res } from './onebotv11/api/api2'
// import type { groupMsgQueueItemType,privateMsgQueueItemType } from './onebotv11/event/type';


const devStore = useDevStore()
const userStore = useUserStore()

export default class Onebot {
    bot: WebSocket | null
    url: string
    msgQueue: any[]
    res: Res | null
    heartbeat_id: NodeJS.Timeout | null
    constructor() {
        this.url = `ws://${(new URL(userStore.originAddress)).hostname}:23306/onebot/v11/ws`
        this.bot = null
        this.msgQueue = []
        this.res = null
        this.heartbeat_id = null
    }

    connect(uin:number) {
        this.bot = new WebSocket(this.url)
        this.bot.addEventListener('open', (e) => {
            this.bot?.send(JSON.stringify(Events.lifecycle('connect')))
            console.log('ws连接成功！' + e.target)
            this.res = new Res(this.bot as WebSocket)
            if(devStore[devStore.curAdapter].settings.heart_beat) {
                this.heartbeat_id = setInterval(()=>this.bot?.send(JSON.stringify(Events.heartbeat({
                    app_initialized:true,
                    app_enabled:true,
                    app_good:true,
                    online:true,
                    good:true
                }))))
            }
        })

        this.bot.addEventListener('message', async(e) => {
            console.log('ws收到服务端消息:')
            const json = JSON.parse(e.data)
            console.log(json)
            if(json.action) {
                if(json.action == 'send_group_msg' || (json.action == 'send_msg' && (json.params?.message_type == 'group' || json.params?.group_id))) {
                    const pre = Events.group_message({
                        message_id: Math.round(Date.now()),
                        group_id: json.params.group_id,
                        user_id: devStore[devStore.curAdapter].cur_bot_id,
                        nickname: msgQueueController.curBot?.nickname as string,
                        message: await Events.handleMessage(json.params.message),
                        raw_message: Events.makeCQ(json.params.message),
                        sex: 'female'
                    })
                    msgQueueController.groupQueue_push(pre)
                    // let curGroupIndex = devStore.onebot11.group_list.findIndex((group)=>group.group_id == devStore.onebot11.cur_group_id)
                    // devStore.onebot11.group_list[curGroupIndex].msg_queue && (devStore.onebot11.group_list[curGroupIndex].msg_queue as unknown as groupMsgQueueItemType[]).push(pre)
                    // devStore.onebot11.msgQueue.push(pre)
                }
                if(json.action == 'send_private_msg' || (json.action == 'send_msg' && (json.params?.message_type == 'private' || !json.params?.group_id))) {
                    const pre = Events.private_message({
                        message_id: Math.round(Date.now()),
                        user_id: devStore[devStore.curAdapter].cur_bot_id,
                        nickname: msgQueueController.curBot?.nickname as string,
                        message: await Events.handleMessage(json.params.message),
                        raw_message: Events.makeCQ(json.params.message),
                        sex: 'female'
                    })
                    msgQueueController.privateQueue_push(pre)
                    // let curPrivateIndex = devStore.onebot11.friend_list.findIndex((friend)=>friend.user_id == devStore.onebot11.cur_private_id)
                    // devStore.onebot11.friend_list[curPrivateIndex].msg_queue && (devStore.onebot11.friend_list[curPrivateIndex].msg_queue as unknown as privateMsgQueueItemType[]).push(pre)
                    // devStore.onebot11.msgQueue.push(pre)
                }
                if(json.action == 'send_group_forward_msg') {
                    const pre = Events.group_message({
                        message_id: Math.round(Date.now()),
                        group_id: json.params.group_id,
                        user_id: devStore[devStore.curAdapter].cur_bot_id,
                        nickname: msgQueueController.curBot?.nickname as string,
                        message: [],
                        messages: json.params.messages,
                        raw_message: Events.makeCQ(json.params.messages),
                        sex: 'female'
                    })
                    msgQueueController.groupQueue_push(pre)
                    // let curGroupIndex = devStore.onebot11.group_list.findIndex((group)=>group.group_id == devStore.onebot11.cur_group_id)
                    // devStore.onebot11.group_list[curGroupIndex].msg_queue && (devStore.onebot11.group_list[curGroupIndex].msg_queue as unknown as groupMsgQueueItemType[]).push(pre)
                    // devStore.onebot11.msgQueue.push(pre)
                }
                if(json.action == 'send_private_forward_msg') {
                    const pre = Events.private_message({
                        message_id: Math.round(Date.now()),
                        user_id: devStore[devStore.curAdapter].cur_bot_id,
                        nickname: msgQueueController.curBot?.nickname as string,
                        message: [],
                        messages: json.params.messages,
                        raw_message: Events.makeCQ(json.params.messages),
                        sex: 'female'
                    })
                    msgQueueController.privateQueue_push(pre)
                    // let curPrivateIndex = devStore.onebot11.friend_list.findIndex((friend)=>friend.user_id == devStore.onebot11.cur_private_id)
                    // devStore.onebot11.friend_list[curPrivateIndex].msg_queue && (devStore.onebot11.friend_list[curPrivateIndex].msg_queue as unknown as privateMsgQueueItemType[]).push(pre)
                    // devStore.onebot11.msgQueue.push(pre)
                }
            }
            // api解析动作并响应
            this.res?.parse_action(json)
        })

        this.bot.addEventListener('close', (e) => {
            console.log('ws服务端关闭！' + JSON.stringify(e))
            if(this.heartbeat_id) {
                clearInterval(this.heartbeat_id)
            }
        })

        this.bot.addEventListener('error', async (e) => {
            console.log('ws出错！' + JSON.stringify(e))
            if(this.heartbeat_id) {
                clearInterval(this.heartbeat_id)
            }
            this.bot?.close()
        })
    }


}