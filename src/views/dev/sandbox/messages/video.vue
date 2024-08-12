<template>
    <div class="fakeqq-message" :class="[onright ? 'right-chat' : 'left-chat']">
        <div v-if="avatar" :style="{ 'background-image': `url(${avatar})` }" class="fakeqq-message__avatar"></div>
        <div v-else class="fakeqq-message__avatar">
            <span class="fakeqq-message__text-avatar">{{ name[0] }}</span>
        </div>
        <div class="fakeqq-message__content">
            <div class="fakeqq-message__name">{{ name }}</div>
            <msg-menu @msg-operation="$emit('msg-operation',$event)">
                <div class="fakeqq-video">
                    <video controls ref="videoElement" :style="{ 'max-width': maxWidth,'object-fit': 'cover','border-radius': '10px' }" style="width: 100%; height: 100%; ">
                        <source :src="src" type="video/mp4" />
                        <source :src="src" type="video/ogg" />
                    </video>
                </div>
            </msg-menu>
            
            <!-- <div class="fakeqq-message__bubble" style="cursor: pointer">
                <div class="fakeqq-message__bubble-arrow"></div>
                
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
    import MsgMenu from './msg-operate.vue'

    const $emit = defineEmits(['msg-operation'])

    const props = defineProps({
        name: { type: String, required: true },
        avatar: String,
        src: { type: String, required: true },
        maxWidth: { type: String, default: '400px' },
        onright: Boolean,
    })
</script>