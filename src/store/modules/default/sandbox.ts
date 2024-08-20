/**
 * 沙箱数据默认值
 */

import type { groupInfoType } from '@/views/dev/sandbox/protocol/onebotv11/api/type'

/** 群列表 */
export const group_list:groupInfoType[] = [
    {
        group_id: 397798018,
        group_name: "沙箱测试群",
        max_member_count: 200,
        member_count: 3,
        /** 每个群的消息队列 */
        msg_queue: [],
        member_list: [
            {
                group_id: 397798018,
                user_id: 2854196310,
                nickname: 'Q群管家',
                card: 'Q群管家',
                sex: 'unknown',
                age: 18,
                area: '',
                join_time: 123456789,
                last_sent_time: 123456789,
                level: 'lv1',
                role: 'bot',
                unfriendly: false,
                title: '机器人',
                title_expire_time: 987654321,
                card_changeable: true,
                thumbs: 0
            },
            {
                group_id: 397798018,
                user_id: 2330660495,
                nickname: 'v',
                card: '小v',
                sex: 'female',
                age: 18,
                area: '',
                join_time: 123456789,
                last_sent_time: 123456789,
                level: 'lv100',
                role: 'owner',
                unfriendly: false,
                title: '',
                title_expire_time: 987654321,
                card_changeable: true,
                thumbs: 0
            },
            {
                group_id: 397798018,
                user_id: 1593519730,
                nickname: 'v崽',
                card: 'v崽崽',
                sex: 'unknown',
                age: 1,
                area: '',
                join_time: 123456789,
                last_sent_time: 123456789,
                level: 'lv1',
                role: 'member',
                unfriendly: false,
                title: '',
                title_expire_time: 987654321,
                card_changeable: true,
                thumbs: 0
            }
        ]
    },
    {
        group_id: 617703908,
        group_name: "Yunzai",
        max_member_count: 200,
        member_count: 3,
        /** 每个群的消息队列 */
        msg_queue: [],
        member_list: [
            {
                group_id: 617703908,
                user_id: 2854196310,
                nickname: 'Q群管家',
                card: 'Q群管家',
                sex: 'unknown',
                age: 18,
                area: '',
                join_time: 123456789,
                last_sent_time: 123456789,
                level: 'lv1',
                role: 'bot',
                unfriendly: false,
                title: '机器人',
                title_expire_time: 987654321,
                card_changeable: true,
                thumbs: 0
            },
            {
                group_id: 617703908,
                user_id: 1715713638,
                nickname: '柠檬冲水',
                card: '柠檬冲水',
                sex: 'male',
                age: 25,
                area: '',
                join_time: 123456789,
                last_sent_time: 123456789,
                level: 'lv100',
                role: 'owner',
                unfriendly: false,
                title: '',
                title_expire_time: 987654321,
                card_changeable: true,
                thumbs: 0
            }
        ]
    }
]

/** 好友列表 */
export const friend_list = [
    {
        nickname: "v崽",
        remark: "",
        user_id: 1593519730,
        msg_queue: [],
        thumbs: 0
    },
    {
        nickname: "v崽1",
        remark: "",
        user_id: 1853952159,
        msg_queue: [],
        thumbs: 0
    },
    {
        user_id: 2330660495,
        nickname: 'v',
        remark: "",
        msg_queue: [],
        thumbs: 0
    }
]
