import { reqLogin, reqUserInfo, reqLogout, reqSaveServerAddress } from '@/api/user'
import { defineStore } from 'pinia'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'

import type {
  loginForm,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'

// 引入常量路由
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'
import router from '@/router'

// 深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import { get } from 'lodash'

// 过滤展示的异步路由

function filterAsyncRoute(asyncRoute: any[], hiddenRoutes: string[]): any[] {
  return asyncRoute.filter((item: any) => {
    const itemName = (item.name || ''); // 将当前路由名称转换为小写  
    if (!hiddenRoutes.includes(itemName)) { // 如果当前路由名称不在隐藏列表中  
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, hiddenRoutes); // 递归处理子路由  
      }
      return true;
    }
    return false; // 如果需要隐藏的路由，则不返回此路由  
  });
}

let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //生成菜单需要的数组
      username: '',
      avatar: '',
      masterQQ: 0,
      //存储当前用户是否包含某一个按钮
      buttons: [],
      /** 请求源，用于服务端提供链接 */
      originAddress: ''
    }
  },
  actions: {
    async userLogin(data: loginForm) {
      let result: loginResponseData = await reqLogin(data)
      // console.log(result)
      // 成功，获取token
      if (result.code == 200) {
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        return Promise.resolve('ok')
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      // console.log(this.token)
      // console.log(result)
      // 成功，获取token
      if (result.code == 200) {
        this.username = result.data.username
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        this.masterQQ = result.data.masterQQ
        // 计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute), result.data.routes || [])
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 动态追加注册路由
        let routers = [...userAsyncRoute, anyRoute]
        routers.forEach((route: any) => {
          router.addRoute(route)
        })

        return Promise.resolve('ok')
      } else {
        return Promise.reject(new Error(JSON.stringify(result.data)))
      }
    },
    async logOut() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        ; (this.token = ''), (this.username = '')
        this.avatar = ''
        this.masterQQ = 0
        REMOVE_TOKEN()
        return Promise.resolve('ok')
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async getOriginAddress() {
      this.originAddress = window.location.origin
      const urlObj = new URL(this.originAddress)
      const { hostname, port, protocol, origin} = urlObj
      let res:any = await reqSaveServerAddress({hostname, port, protocol, origin})
      if(res.code == 200){
        return Promise.resolve('ok')
      } else {
        return Promise.reject(new Error(res.message))
      }
    }
  },
  getters: {},
})

export default useUserStore
