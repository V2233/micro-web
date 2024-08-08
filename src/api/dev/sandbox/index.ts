import request from '@/utils/request'

enum API {
    GET_PLUGINS_LOADER = '/sandbox/getloader'
}

export const reqPluginsLoader = () => {
    return request.get<any, any>(API.GET_PLUGINS_LOADER)
  }