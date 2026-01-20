// layout 组件相关
import { defineStore } from 'pinia'
import { SettingState } from './types/type'

let theme = localStorage.getItem('THEME') as 'light' | 'dark'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: (): SettingState => {
    return {
      foldMode: 2,
      refresh: false,
      theme:
        theme ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'),
      globalTerminal: {
        running: false,
        visible: false,
      },
    }
  },
})

export default useLayoutSettingStore
