import type { RouteRecordRaw } from 'vue-router'
import type { groupInfoType,groupMemberInfoType } from '@/views/dev/sandbox/protocol/onebotv11/api/type'

export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  masterQQ?: string | number
  buttons: string[]
}

export interface DevState {
  curPath: string
  isPluginEdited: boolean
  scene: number
  curEditedMode: string
  curPluginId: string
  qqScene: number
  curAdapter:string
  onebot11: {
    /** 消息队列 */
    msgQueue: Array<any>,
    /** 群聊列表 */
    group_list: Array<groupInfoType>,
    /** 好友列表 */
    friend_list: Array<any>,
    /** 频道列表 */
    guild_list: Array<any>,
    /** 当前是群聊还是私聊场景 */
    cur_message_type: 'group' | 'private',
    /** 当前所在群号 */
    cur_group_id: number,
    /** 当前所在私聊场景对方id，和cur_group_id之间必有一个为0 */
    cur_private_id: number,
    /** 当前操作者账号 */
    cur_master_id: number,
    /** 当前机器人id */
    cur_self_id: number
  }
}

interface settingType {
  imageWidth: number
  isAutoScroll: boolean
  qpsInterval: number
  fontSize: number
}

interface msgQpsType {
  qps: number
  time: string
}

export interface ScreenState {
  msgQps: msgQpsType[]
  curMsgQueueLength: number
  settings: settingType
}
