interface actionType {
    echo: string,
    action: string,
    params: any
}

type retcodeType = 0 | 10001 | 10002 | 10003 | 10004 | 10005 | 10006 | 10007 | 10101 | 10102 | 20001 | 20002

import type { groupInfoType,groupMemberInfoType } from './type'
import  useDevStore from '@/store/modules/dev'; 
const devStore = useDevStore()

export class Res {
    self_id: number
    constructor(public ws: WebSocket) {
        this.ws = ws
        this.self_id = 1593519730
    }

    sendApi(
        echo:string,
        data:any,
        message = '',
        retcode: retcodeType,
        status: 'ok' | 'failed' = 'ok'
    ) {
        this.ws.send(JSON.stringify({
            status,
            retcode,
            data,
            message,
            echo
        }))
    }

    ok = (echo:string,data:any,message:string,retcode:retcodeType = 0) => {
        this.sendApi(echo,data,message,retcode)
    }

    failed = (echo:string,data:any,message:string,retcode:retcodeType = 10001) => {
        this.sendApi(echo,data,message,retcode)
    }

    parse_action(data:actionType) {
        if(!data.action) return

        const actionMap:{[key:string]:any} = {
            send_private_msg: this.send_private_msg,
            send_group_msg: this.send_group_msg,
            send_msg: this.send_msg,
            delete_msg: this.delete_msg,
            get_msg: this.get_msg,
            get_forward_msg: this.get_forward_msg,
            send_like: this.send_like,
            set_group_kick: this.set_group_kick,
            set_group_ban: this.set_group_ban,
            set_group_anonymous_ban: this.set_group_anonymous_ban,
            set_group_whole_ban: this.set_group_whole_ban,
            set_group_admin: this.set_group_admin,
            set_group_anonymous: this.set_group_anonymous,
            set_group_card: this.set_group_card,
            set_group_name: this.set_group_name,
            set_group_leave: this.set_group_leave,
            set_group_special_title: this.set_group_special_title,
            set_friend_add_request: this.set_friend_add_request,
            set_group_add_request: this.set_group_add_request,
            get_login_info: this.get_login_info,
            get_stranger_info: this.get_stranger_info,
            get_friend_list: this.get_friend_list,
            get_group_info: this.get_group_info,
            get_group_list: this.get_group_list,
            get_group_member_info: this.get_group_member_info,
            get_group_member_list: this.get_group_member_list,
            get_group_honor_info: this.get_group_honor_info,
            get_cookies: this.get_cookies,
            get_csrf_token: this.get_csrf_token,
            get_credentials: this.get_credentials,
            get_record: this.get_record,
            get_image: this.get_image,
            can_send_image: this.can_send_image,
            can_send_record: this.can_send_record,
            get_status: this.get_status,
            get_version_info: this.get_version_info,
            set_restart: this.set_restart,
            clean_cache: this.clean_cache,
            _set_model_show: this._set_model_show
        }

        if(data.action in actionMap) {
            const reply = actionMap[data.action](data.params)
            this.ok(data.echo, reply, '', 0)
        } else {
            console.log('不存在此方法！')
            this.failed(data.echo, {}, '不存在此方法！')
        }

    }

    get curMsgQueue() {
        if(devStore.onebot11.cur_message_type == 'group') {
            let curGroup = devStore.onebot11.group_list.find((group)=>group.group_id == devStore.onebot11.cur_group_id)
            if(curGroup) return curGroup.msg_queue
        } else {
            let curPrivate = devStore.onebot11.friend_list.find((friend)=>friend.user_id == devStore.onebot11.cur_private_id)
            if(curPrivate) return curPrivate.msg_queue
        }
    }

    get curGroup() {
        return devStore.onebot11.group_list.find((group)=>group.group_id == devStore.onebot11.cur_group_id) as groupInfoType
    }

    get curGroupIndex() {
        return devStore.onebot11.group_list.findIndex((group)=>group.group_id == devStore.onebot11.cur_group_id)
    }

    send_private_msg(params:any) {
        return 
    }

    send_group_msg(params:any) {
        
        return 
    }
    
    send_msg(params:any) {

    }
        
    delete_msg(params:any) {
        return 
    }

    get_msg(params:any) {
        return 
    }

    get_forward_msg(params:any) {
        return 
    }

    /** 点赞 */
    send_like(params:any) {
        const { user_id, times } = params
        if(devStore.onebot11.cur_message_type == 'group') {
            let groupIndex = devStore.onebot11.group_list.findIndex((group)=>group.group_id == devStore.onebot11.cur_group_id)
            let memberInfoIndex = devStore.onebot11.group_list[groupIndex].member_list.findIndex(member => member.user_id == user_id)
            if(memberInfoIndex != -1 && this.curGroupIndex != -1) {
                if(!devStore.onebot11.group_list[groupIndex].member_list[memberInfoIndex].thumbs) {
                    devStore.onebot11.group_list[groupIndex].member_list[memberInfoIndex].thumbs = 0
                }
                devStore.onebot11.group_list[groupIndex].member_list[memberInfoIndex].thumbs += Number(times)
            }
        } else {
            let memberInfoIndex = devStore.onebot11.friend_list.findIndex(member => member.user_id == user_id)
            if(memberInfoIndex != -1) {
                if(!devStore.onebot11.friend_list[memberInfoIndex].thumbs) {
                    devStore.onebot11.friend_list[memberInfoIndex].thumbs = 0
                }
                devStore.onebot11.friend_list[memberInfoIndex].thumbs += Number(times)
            }
        }
        
        return 'ok'
    }

    set_group_kick(params:any) {
        return 
    }

    set_group_ban(params:any) {
        return 
    }

    set_group_anonymous_ban(params:any) {
        return 
    }

    set_group_whole_ban(params:any) {
        return 
    }

    set_group_admin(params:any) {
        return 
    }

    set_group_anonymous(params:any) {
        return 
    }

    set_group_card(params:any) {
        return 
    }

    set_group_name(params:any) {
        return 
    }

    set_group_leave(params:any) {
        return 
    }

    set_group_special_title(params:any) {
        return 
    }

    set_friend_add_request(params:any) {
        return 
    }

    set_group_add_request(params:any) {
        return 
    }

    get_login_info(params:any) {
        return {
            user_id: devStore.onebot11.cur_bot_id,
            nickname: 'v崽'
        }
    }

    get_stranger_info(params:any) {
        return {}
    }

    get_friend_list(params:any) {
        let friends = devStore.onebot11.friend_list.map(friend => {
            return {
                nickname: friend.nickname,
                remark: friend.remark,
                user_id: friend.user_id,
            }
        })
        return friends
    }

    get_group_info(params:any) {
        let group = devStore.onebot11.group_list.find(g => g.group_id == params.group_id)
        return group || {}
    }

    get_group_list(params:any) {
        let groups = devStore.onebot11.group_list.map(group => {
            
            return {
                group_id: group.group_id,
                group_name: group.group_name,
                max_member_count: group.max_member_count,
                member_count: group.member_list?.length,
            }
        })
        return groups || []
    }

    get_group_member_info(params:any) {
        let group = devStore.onebot11.group_list.find(g => g.group_id == params.group_id)
        if(group) {
            let member = group?.member_list?.find((m:groupMemberInfoType) => m.user_id == params.user_id)
            if(member) return member
        }
        return {}
    }

    get_group_member_list(params:any) {
        let group = devStore.onebot11.group_list.find(g => g.group_id == params.group_id)
        return group?.member_list
    }

    get_group_honor_info(params:any) {
        return {}
    }

    get_cookies(params:any) {
        return {
            cookies: ''
        }
    }

    get_csrf_token(params:any) {
        return {
            token: 114514
        }
    }

    get_credentials(params:any) {
        return {
            cookies: '',
            token: 114514
        }
    }

    get_record(params:any) {
        const { file } = params
        return 'http://127.0.0.1:23306/api/File/' + file
    }

    get_image(params:any) {
        const { file } = params
        return 'http://127.0.0.1:23306/api/File/' + file
    }

    can_send_image(params:any) {
        return {
            yes: true
        }
    }

    can_send_record(params:any) {
        return {
            yes: true
        }
    }

    get_status(params:any) {
        return {
            app_initialized:true,
            app_enabled:true,
            app_good:true,
            online:true,
            good:true
        }
    }

    get_version_info(params:any) {
        return {
            app_name: 'sandbox.onebot',
            app_version: '0.0.1',
            protocol_version: 'v11'
        }
    }

    set_restart(params:any) {
        return 'Cannot restart!'
    }

    clean_cache(params:any) {
        return 'ok'
    }

    _set_model_show(params:any) {
        console.log(params.model)
        console.log(params.model_show)
        return 'ok'
    }
}
