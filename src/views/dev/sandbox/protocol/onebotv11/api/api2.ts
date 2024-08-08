interface actionType {
    echo: string,
    action: string,
    params: any
}

type retcodeType = 0 | 10001 | 10002 | 10003 | 10004 | 10005 | 10006 | 10007 | 10101 | 10102 | 20001 | 20002

class Res {
    ws: WebSocket

    constructor(url:string) {
        this.ws = new WebSocket(url)
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
            clean_cache: this.clean_cache
        }

        if(data.action in actionMap) {
            actionMap[data.action]()
        }

    }

    send_private_msg(params:any) {
        return 
    }

    send_group_msg(params:any) {
        return 
    }
    
    send_msg(params:any) {
        return 
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

    send_like(params:any) {
        return 
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
        return 
    }

    get_stranger_info(params:any) {
        return 
    }

    get_friend_list(params:any) {
        return 
    }

    get_group_info(params:any) {
        return 
    }

    get_group_list(params:any) {
        return 
    }

    get_group_member_info(params:any) {
        return 
    }

    get_group_member_list(params:any) {
        return 
    }

    get_group_honor_info(params:any) {
        return 
    }

    get_cookies(params:any) {
        return 
    }

    get_csrf_token(params:any) {
        return 
    }

    get_credentials(params:any) {
        return 
    }

    get_record(params:any) {
        return 
    }

    get_image(params:any) {
        return 
    }

    can_send_image(params:any) {
        return 
    }

    can_send_record(params:any) {
        return 
    }

    get_status(params:any) {
        return 
    }

    get_version_info(params:any) {
        return 
    }

    set_restart(params:any) {
        return 
    }

    clean_cache(params:any) {
        return 
    }
}