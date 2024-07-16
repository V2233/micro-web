import request from '@/utils/request'
import type {
    userConfigResponseType
} from './type'

enum API {
    GET_CONFIG_URL = '/bot/getcfg',
    SET_CONFIG_URL = '/bot/setcfg',

    GET_PLUGIN_CONFIG_URL = '/plugins/getcfg',
    SET_PLUGIN_CONFIG_URL = '/plugins/setcfg',

    GET_USER_CONFIG_URL = '/user/getcfg',
    SET_USER_CONFIG_URL = '/user/setcfg',
}

/**
 * 获取bot配置
 * @param name 配置模块
 * @returns 
 */
export const reqBotConfig = (name: string) => {
    return request.get<any, any>(API.GET_CONFIG_URL + '?name=' + name)
}

/**
 * 设置bot配置
 * @param name 
 * @param data 
 * @returns 
 */
export const reqSetBotConfig = (name: string, data: any) => {
    return request.post<any, any>(API.SET_CONFIG_URL + '?name=' + name, data)
}

/**
 * 获取plugin配置
 * @param appName
 * @param name 
 * @returns 
 */
export const reqPluginConfig = (appName: string, name: string) => {
    return request.get<any, any>(API.GET_CONFIG_URL + '?name=' + name + '&app=' + appName)
}

/**
 * 设置plugin配置
 * @param appName
 * @param name 
 * @param data 
 * @returns 
 */
export const reqSetPluginConfig = (appName: string, name: string, data: any) => {
    return request.post<any, any>(API.SET_CONFIG_URL + '?name=' + name + '&app=' + appName, data)
}

/**
 * 获取user配置
 * @returns 
 */
export const reqUserConfig = () => {
    return request.get<any, userConfigResponseType>(API.GET_USER_CONFIG_URL)
}

/**
 * 设置user配置
 * @param data 
 * @returns 
 */
export const reqSetUserConfig = (data: any) => {
    return request.post<any, any>(API.SET_USER_CONFIG_URL, data)
}

