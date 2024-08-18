<template>
    <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
        <!-- 头像 -->
        <AvatarMenu :onright="onright" @avatar-operation="$emit('avatar-operation',$event)">
            <div v-if="avatar" :style="{ 'background-image': `url(${avatar})` }" class="fakeqq-message__avatar"></div>
            <div v-else class="fakeqq-message__avatar">
                <span class="fakeqq-message__text-avatar">{{ name[0] }}</span>
            </div>
        </AvatarMenu>
        <!-- 内容 -->
        <div class="fakeqq-message__content">
            <div class="fakeqq-message__name">
                <span v-if="onright" :class="memberTitleClass">{{ role_title }}</span>
                {{ name }}
                <span v-if="!onright" :class="memberTitleClass">{{ role_title }}</span>
            </div>
            <!-- 气泡 -->
            <msg-menu @msg-operation="$emit('msg-operation',$event)">
                <div class="fakeqq-message__bubble">
                    <div class="fakeqq-message__bubble-arrow"></div>
                    <slot></slot>
                </div>
            </msg-menu>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import MsgMenu from './msg-operate.vue'
import AvatarMenu from './avatar-operate.vue'

const $emit = defineEmits(['msg-operation','avatar-operation'])

const props = defineProps({
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    role_title: { type: String, default: 'LV1' },
    avatar: String,
    onright: Boolean,
})

const memberTitleClass = computed(()=>{
    switch(props.role) {
        case 'owner':
            return 'fakeqq-message__title__owner'
        case 'admin':
            return 'fakeqq-message__title__admin'
        case 'member':
            return 'fakeqq-message__title__member'
        default: 
            return ''
    }
})


</script>
