import request from '@/utils/request'

enum API {
    GET_PLUGINS_LOADER = '/sandbox/getloader',
    UPLOAD_FILE_URL = '/sandbox/upload'
}

/**
 * 获取插件指令
 * @returns 
 */
export const reqPluginsLoader = () => {
    return request.get<any, any>(API.GET_PLUGINS_LOADER)
}

/**
 * 上传文件
 * @param formData 
 * @returns 
 */
export const reqUploadFile = (formData:FormData) => {
    return request.post<any, any>(API.UPLOAD_FILE_URL,formData,{
        headers: {  
            'Content-Type': 'multipart/form-data',  
        },  
    })
}