import { defineStore } from 'pinia'
import type { DevState } from './types/type'

let useDevStore = defineStore('Dev', {
  state: (): DevState => {
    return {
      // 文件系统根路径，0代表bot工作路径
      curPath: '0',
      // 当前是否处在插件编辑模式
      isPluginEdited: false,
      // 插件模块场景切换
      curPluginId: '',
      // 当前插件编辑场景(0-列表添加页，1-指令编辑页，2-图片编辑器)
      scene: 0,
      // 当前插件编辑模式(add or update)
      curEditedMode: 'add',

      // 沙箱场景
      qqScene: 0,
      // onebot 数据库
      onebotDB: {
        // 消息队列
        msgQueue: [],
        // 群聊列表
        group_list: [],
      }
    }
  },
  actions: {},
  getters: {},
})

export default useDevStore
