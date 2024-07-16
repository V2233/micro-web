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
      scene: 0,
      curEditedMode: 'add',
    }
  },
  actions: {},
  getters: {},
})

export default useDevStore
