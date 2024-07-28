// layout 组件相关
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      // 控制折叠菜单
      // fold: false,
      // 0:完全关闭；1:只留图标；2:全展开
      foldMode: 2,
      refresh: false,
    }
  },
})

export default useLayoutSettingStore
