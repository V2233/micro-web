import type { groupInfoType,groupMemberInfoType } from '../protocol/onebotv11/api/type'

export interface drawerDataType {
    last_scene: number,
    scene: number,
    title: string,
    type: string,
    body: {
        member_type: 'bot' | 'admin' | 'owner' | 'member',
        member_data: groupMemberInfoType,
        bot_welcome: string
    }
}