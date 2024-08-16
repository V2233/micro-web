import { defineStore } from 'pinia'
import type { DevState } from './types/type'
import { group_list,friend_list } from './default/sandbox'

let useDevStore = defineStore('Dev', {
  state: (): DevState => {
    return {
      /** 文件系统根路径，0代表bot工作路径 */
      curPath: '0',

      /** 当前是否处在插件编辑模式 */
      isPluginEdited: false,
      /** 插件模块场景切换 */
      curPluginId: '',
      /** 当前插件编辑场景(0-列表添加页，1-指令编辑页，2-图片编辑器) */
      scene: 0,
      /** 当前插件编辑模式(add or update) */
      curEditedMode: 'add',

      /** 沙箱场景 */
      qqScene: 0,
      /** 当前适配器 */
      curAdapter: 'onebot11',
      /** onebot 数据库 */
      onebot11: {
        /** 消息队列 */
        msgQueue: [],
        /** 群聊列表 */
        group_list: group_list,
        /** 好友列表 */
        friend_list: friend_list,
        /** 频道列表 */
        guild_list: [],
        /** 当前所在群号 */
        cur_group_id: 397798018,
        /** 当前操作者账号 */
        cur_master_id: 2330660495,
        /** 当前机器人id */
        cur_self_id: 1593519730
      }
    }
  },
  actions: {},
  getters: {},
})

export default useDevStore
