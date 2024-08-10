import type { RouteRecordRaw } from 'vue-router'


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
  onebotDB: any
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
