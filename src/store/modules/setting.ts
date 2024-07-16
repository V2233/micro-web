// layout 组件相关
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      // 控制折叠菜单
      fold: false,
      refresh: false,
    }
  },
})

export default useLayoutSettingStore
