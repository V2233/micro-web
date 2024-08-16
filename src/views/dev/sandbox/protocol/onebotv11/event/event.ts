// 事件是用户需要从 OneBot 被动接收的数据，有以下几个大类：

// 消息事件，包括私聊消息、群消息等
// 通知事件，包括群成员变动、好友变动等
// 请求事件，包括加群请求、加好友请求等
// 元事件，包括 OneBot 生命周期、心跳等

// 在所有能够推送事件的通信方式中（HTTP POST、正向和反向 WebSocket），事件都以 JSON 格式表示。

import type { MessageElem, NodeElem } from '../message/message.elem'

import type { groupMsgType,privateMsgType } from './type'

import useDevStore from '@/store/modules/dev'; 
const devStore = useDevStore()


export default new class Events {

    self_id = 114514

    /**
     * 基本字段
     * @param post_type 事件类型
     * @returns 
     */
    baseProp(post_type:'message' | 'notice' | 'request' | 'meta_event') {
        return {
            /** (int64)	事件发生的时间戳 */
            time: Math.round(Date.now() / 1000), 
            /** (int64)	收到事件的机器人 QQ 号 */
            self_id: devStore.onebot11.cur_self_id,
            /** 事件类型 */
            post_type: post_type, 
        }
    }

    /**
     * 生命周期
     * @param sub_type 事件子类型，分别表示 WebSocket 连接成功、OneBot 启用、停用
     * @returns 
     */
    lifecycle(sub_type: 'connect' | 'enable' | 'disable') {
        return {
            ...this.baseProp('meta_event'),
            /** 元事件类型 */
            meta_event_type: 'lifecycle', 
            /** 事件子类型，分别表示 WebSocket 连接成功、OneBot 启用、停用 */
            sub_type: sub_type 
        }
    }

    /**
     * 心跳
     * @param status 状态信息
     * @param interval 到下次心跳的间隔，单位毫秒
     * @returns 
     */
    heartbeat(status: { [key:string]:any }, interval:number = 5000) {
        return {
            ...this.baseProp('meta_event'),
            /** 元事件类型 */
            meta_event_type: 'heartbeat', 
            /** 状态信息 */
            status,
            /** 到下次心跳的间隔，单位毫秒 */
            interval,
        }
    }

    /** ---------------------消息--------------------- */

    /**
     * 制作CQ
     * @param message
     * @returns 
     */
    makeCQ(message:MessageElem[]) {
        let raw_message = ''
        message.forEach((seg:any) => {
            let data = Object.keys(seg.data).map(key=>{
                if (typeof seg.data[key] == 'string') {
                    return `${key}=${seg.data[key].replace(/base64:\/\/.*?(,|]|")/g, "base64://...$1")}`
                }
                return `${key}=${seg.data[key]}`
            })
            raw_message += `[CQ:${seg.type},${data.join(',')}]`
        });
        return raw_message
    }

    /**
     * 构造私聊消息
     * @param data 数据对象
     * @param data.message_id 消息 ID
     * @param data.user_id 发送者 QQ 号
     * @param data.nickname 昵称
     * @param data.message 消息内容
     * @param data.messages 合并消息内容
     * @param data.raw_message 原始消息内容
     * @param data.sub_type 消息子类型，如果是好友则是 friend，如果是群临时会话则是 group
     * @param data.avatar 头像
     * @param data.sex 性别
     * @param data.age 年龄
     * @param data.font 字体
     * @returns 
     */
    private_message(data:privateMsgType) {
        return {
            ...this.baseProp('message'),
            /** 消息类型 */
            message_type: 'private', 
            /** 消息子类型，如果是好友则是 friend，如果是群临时会话则是 group */
            sub_type: data.sub_type || 'friend',
            /** 到下次心跳的间隔，单位毫秒 */
            interval: 5000,
            /** 消息 ID */
            message_id: data.message_id,
            /** 发送者 QQ 号 */
            user_id: data.user_id,
            /** 消息内容 */
            message: data.message,
            /** 合并消息 */
            messages: data.messages || undefined,
            /** 原始消息内容 */
            raw_message: data.raw_message,
            /** 字体 */
            font: data.font || '',
            /** 发送人信息 */
            sender: {
                user_id: data.user_id,
                nickname: data.nickname,
                sex: data.sex || 'unknown',
                age: data.age || 1,
                avatar: data.avatar || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.user_id}`
            }
        }
    }



    /**
     * 构造群消息
     * @param data 数据对象
     * @param data.message_id 消息 ID 
     * @param data.group_id 群号
     * @param data.user_id 发送者 QQ 号
     * @param data.nickname 昵称
     * @param data.message 消息内容
     * @param data.raw_message 原始消息内容
     * @param data.sub_type 消息子类型，正常消息是 normal，匿名消息是 anonymous，系统提示（如「管理员已禁止群内匿名聊天」）是 notice
     * @param data.role 角色，owner 或 admin 或 member
     * @param data.card 群名片／备注
     * @param data.avatar 头像
     * @param data.level 成员等级
     * @param data.sex 性别
     * @param data.age 年龄
     * @param data.area 地区
     * @param data.title 专属头衔
     * @param data.font 字体
     * @param data.id 匿名用户 ID
     * @param data.name 匿名用户名称
     * @param data.flag 匿名用户 flag，在调用禁言 API 时需要传入
     * @returns 
     */
    group_message(data:groupMsgType) {
        return {
            ...this.baseProp('message'),
            /** 消息类型 */
            message_type: 'group', 
            /** 消息子类型，正常消息是 normal，匿名消息是 anonymous，系统提示（如「管理员已禁止群内匿名聊天」）是 notice */
            sub_type: data.sub_type || 'normal',
            /** 到下次心跳的间隔，单位毫秒 */
            interval: 5000,
            /** 消息 ID */
            message_id: data.message_id,
            /** 群号 */
            group_id: data.group_id,
            /** 发送者 QQ 号 */
            user_id: data.user_id,
            /** 匿名信息，如果不是匿名消息则为 null */
            anonymous: {
                id: data.id || 114514,
                name: data.name || '憨憨',
                flag: data.flag || ''
            },
            /** 消息内容 */
            message: data.message,
            /** 合并消息 */
            messages: data.messages || undefined,
            /** 原始消息内容 */
            raw_message: data.raw_message,
            /** 字体 */
            font: data.font || '',
            /** 发送人信息 */
            sender: {
                user_id: data.user_id,
                nickname: data.nickname,
                sex: data.sex || 'unknown',
                age: data.age || 1,
                card: data.card || data.nickname,
                area: data.area || '',
                level: data.level || '1',
                role: data.role || 'member',
                title: data.title || '',
                avatar: data.avatar || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${data.user_id}`
            }
        }
    }

    /** -----------------------通知------------------------- */

    /**
     * 群文件上传
     * @param group_id 群号
     * @param user_id 发送者 QQ 号
     * @param id 文件 ID
     * @param name 文件名
     * @param size 文件大小（字节数）
     * @param busid busid（目前不清楚有什么作用）
     * @returns 
     */
    group_upload(
        group_id: number,
        user_id: number,
        id: string,
        name: string,
        size: number,
        busid: number = 114514
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_upload',
            group_id,
            user_id,
            file: {
                id,
                name,
                size,
                busid
            }
        }
    }

    /**
     * 群管理员变动
     * @param group_id 群号
     * @param user_id 发送者 QQ 号
     * @param sub_type 事件子类型，分别表示设置和取消管理员
     * @returns 
     */
    group_admin(
        group_id: number,
        user_id: number,
        sub_type: 'set' | 'unset'
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_admin',
            group_id,
            user_id,
            sub_type
        }
    }

    /**
     * 
     * @param group_id 群号
     * @param user_id 离开者 QQ 号
     * @param operator_id 操作者 QQ 号（如果是主动退群，则和 user_id 相同）
     * @param sub_type 事件子类型，分别表示主动退群、成员被踢、登录号被踢
     * @returns 
     */
    group_decrease(
        group_id: number,
        user_id: number,
        operator_id: number = user_id,
        sub_type: 'leave' | 'kick' | 'kick_me'
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_decrease',
            group_id,
            user_id,
            operator_id,
            sub_type
        }
    }

    /**
     * 群成员增加
     * @param group_id 群号
     * @param user_id 加入者 QQ 号
     * @param operator_id 操作者 QQ 号
     * @param sub_type 事件子类型，分别表示管理员已同意入群、管理员邀请入群
     * @returns 
     */
    group_increase(
        group_id: number,
        user_id: number,
        operator_id: number = user_id,
        sub_type: 'approve' | 'invite'
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_increase',
            group_id,
            user_id,
            operator_id,
            sub_type
        }
    }

    /**
     * 群禁言
     * @param group_id 群号
     * @param user_id 被禁言 QQ 号
     * @param duration 禁言时长，单位秒
     * @param operator_id 操作者 QQ 号
     * @param sub_type 事件子类型，分别表示禁言、解除禁言
     * @returns 
     */
    group_ban(
        group_id: number,
        user_id: number,
        duration: number,
        operator_id: number = user_id,
        sub_type: 'ban' | 'lift_ban'
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_ban',
            group_id,
            user_id,
            operator_id,
            duration,
            sub_type
        }
    }

    /**
     * 好友添加
     * @param user_id 新添加好友 QQ 号
     * @returns 
     */
    friend_add(user_id: number) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'friend_add',
            user_id
        }
    }

    /**
     * 群消息撤回
     * @param message_id 被撤回的消息 ID
     * @param group_id 群号
     * @param user_id 消息发送者 QQ 号
     * @param operator_id 操作者 QQ 号
     * @returns 
     */
    group_recall(
        message_id: number,
        group_id: number,
        user_id: number,
        operator_id: number = user_id,
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'group_recall',
            group_id,
            user_id,
            operator_id,
            message_id,
        }
    }

    /**
     * 好友消息撤回
     * @param message_id 被撤回的消息 ID
     * @param user_id 好友 QQ 号
     * @returns 
     */
    friend_recall(
        message_id: number,
        user_id: number,
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'friend_recall',
            user_id,
            message_id,
        }
    }

    /**
     * 群内戳一戳
     * @param group_id 群号
     * @param user_id 发送者 QQ 号
     * @param target_id 被戳者 QQ 号
     * @returns 
     */
    notify_poke(
        group_id: number,
        user_id: number,
        target_id: number = user_id,
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'notify',
            sub_type: 'poke',
            group_id,
            user_id,
            target_id,
        }
    }

    /**
     * 群红包运气王
     * @param group_id 群号
     * @param user_id 发送者 QQ 号
     * @param target_id 运气王 QQ 号
     * @returns 
     */
    notify_lucky_king(
        group_id: number,
        user_id: number,
        target_id: number = user_id,
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'notify',
            sub_type: 'lucky_king',
            group_id,
            user_id,
            target_id,
        }
    }

    /**
     * 
     * @param group_id 群号
     * @param user_id 成员 QQ 号
     * @param honor_type 荣誉类型，分别表示龙王、群聊之火、快乐源泉
     * @returns 
     */
    notify_honor(
        group_id: number,
        user_id: number,
        honor_type: 'talkative' | 'performer' | 'emotion',
    ) {
        return {
            ...this.baseProp('notice'),
            notice_type: 'notify',
            sub_type: 'honor',
            honor_type,
            group_id,
            user_id,
        }
    }

    /** -----------请求事件---------- */

    /**
     * 加好友请求
     * @param user_id 发送请求的 QQ 号
     * @param comment 验证信息
     * @param flag 	请求 flag，在调用处理请求的 API 时需要传入
     * @returns 
     */
    friend_request(
        user_id: number,
        comment: string,
        flag: string = ''
    ) {
        return {
            ...this.baseProp('request'),
            request_type: 'friend',
            comment,
            user_id,
            flag
        }
    }

    /**
     * 加群请求／邀请
     * @param group_id 群号
     * @param user_id 发送请求的 QQ 号
     * @param sub_type 请求子类型，分别表示加群请求、邀请登录号入群
     * @param comment 验证信息
     * @param flag 请求 flag，在调用处理请求的 API 时需要传入
     * @returns 
     */
    group_request(
        group_id: number,
        user_id: number,
        sub_type: 'add' | 'invite',
        comment: string,
        flag: string = ''
    ) {
        return {
            ...this.baseProp('request'),
            request_type: 'group',
            sub_type,
            comment,
            group_id,
            user_id,
            flag
        }
    }
    
}