import { defineStore } from 'pinia'
import type { DevState } from './types/type'
import { group_list, friend_list } from './default/sandbox'

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
        /** 群聊列表 */
        group_list: group_list,
        /** 好友列表 */
        friend_list: friend_list,
        /** 频道列表 */
        guild_list: [],
        /** 当前是群聊还是私聊场景 */
        cur_message_type: 'group',
        /** 当前所在群聊场景群号 */
        cur_group_id: 397798018,
        /** 当前所在私聊场景对方id，和cur_group_id之间必有一个为0 */
        cur_private_id: 0,
        /** 当前机器人id */
        cur_bot_id: 1593519730,
        /** 当前自己的资料 */
        cur_self_info: {
          user_id: 2330660495,
          nickname: 'v',
          sex: 'female',
          age: 18,
          area: '',
          thumbs: 0
        }
      }
    }
  },
  actions: {},
  getters: {},
})

export default useDevStore
