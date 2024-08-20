<template>
    <div class="fakeqq-msglist">
        <div class="msglist__tabbar">
            <!-- 导航栏头像 -->
            <div class="msglist__tabbar__avatar">
                <img class="msglist__tabbar__avatar__img" :src="`${avatar}`"/>
                <div class="msglist__tabbar__avatar__state" :style="{backgroundColor: `#2CEA8C`}"></div>
            </div>
            <!-- 导航栏顶端 -->
            <div class="msglist__tabbar__top">
                <div class="msglist__tabbar__top__icon" 
                    :class="[curTabbarIcon == 'messages'?'msglist__tabbar__top__icon__selected':'']" 
                    @click="clickTabbarIcon('messages')"
                >
                    <svg-icon name="message" width="80px" height="80px" color="black"/>
                    <el-badge 
                        v-if="messagesLength > 0"
                        :value="messagesLength" 
                        :max="99" 
                        :style="{
                            position: 'absolute',
                            top: '10px',
                            right: '-10px',
                            transform: 'scale(0.8)'
                        }"
                    ></el-badge>
                </div>
                <div class="msglist__tabbar__top__icon" 
                    :class="[curTabbarIcon == 'contacts'?'msglist__tabbar__top__icon__selected':'']"
                    @click="clickTabbarIcon('contacts')">
                    <svg-icon name="contacts" width="26px" height="26px" color="black"/>
                </div>
                <!-- <div class="msglist__tabbar__top__icon" @click="$emit('clickTabbar','contacts')">
                    <svg-icon name="channel" width="20px" height="26px" color="black"/>
                </div> -->
            </div>
            <!-- 导航栏底部 -->
            <div class="msglist__tabbar__bottom">
                <div class="msglist__tabbar__bottom__icon" 
                    :class="[curTabbarIcon == 'settings'?'msglist__tabbar__top__icon__selected':'']"
                    @click="clickTabbarIcon('settings')">
                    <el-icon size="26"><Expand /></el-icon>
                </div>
            </div>
        </div>
        <!-- 列表栏 -->
        <div class="msglist__messages" ref="messagesRef">
            <div class="msglist__messages__search">
                <div class="msglist__messages__search__frame">
                    <div class="msglist__messages__search__frame__left">
                        <el-icon size="large" color="#9F9F9F" @click="$emit('searchText',searchText)"><Search /></el-icon>
                        <input class="msglist__messages__search__frame__input" 
                            v-model="searchText" 
                            placeholder="搜索" 
                            @keyup.enter="$emit('searchText',searchText)"
                            @input="$emit('searchText',searchText)"
                            @focus="$emit('searchFocused',true)"
                            @blur="$emit('searchFocused',false)"
                        ></input>
                    </div>
                    <el-popover
                        placement="top-end"
                        :width="140"
                        trigger="click"
                        v-model:visible = "isAddMenuVisible"
                    >   
                        <template #reference>
                            <div class="msglist__messages__search__frame__right">
                                <el-icon size="large" color="#9F9F9F"><Plus /></el-icon>
                            </div>
                        </template>
                        <div class="msglist__messages__menu__add">
                            <div class="msglist__messages__menu__add__item">
                                <svg-icon name="create-group" width="16px" height="16px"></svg-icon>
                                <span class="msglist__messages__menu__item__desc">创建群聊</span>
                            </div>
                            <div class="msglist__messages__menu__add__item">
                                <svg-icon name="add-friend" width="16px" height="16px"></svg-icon>
                                <span class="msglist__messages__menu__item__desc">加好友/群</span>
                            </div>
                            <div class="msglist__messages__menu__add__item">
                                <svg-icon name="add-friend" width="16px" height="16px"></svg-icon>
                                <span class="msglist__messages__menu__item__desc">创建好友</span>
                            </div>
                        </div>
                        
                    </el-popover>
                </div>
            </div>
            <slot name="messages"></slot>
        </div>

        <!-- 分割线 -->
        <div class="msglist__messages__main__resizer">
            <div class="msglist__messages__main__resizer__extend" 
                ref="dividerRef"
                @mousedown="startDragDivider"
            ></div>
        </div>

        <!-- 主视图 -->
        <div class="msglist-main" ref="mainRef">
            <slot name="main"></slot>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref,onMounted,onBeforeUnmount } from 'vue'

const $emit = defineEmits(['clickTabbar','searchText','searchFocused'])

const props = defineProps({
    avatar: { type: String, required: true },
    title: { type: String, required: true },
    // searchText: { type: String, default: ''},
    messagesLength: { type: Number, default: 0}
    // state: { type: String, default: '离线' },
})

/** 添加操作栏 */
const isAddMenuVisible = ref(false)

/** 搜索栏值 */
const searchText = ref('')

/** 当前导航栏状态 */
const curTabbarIcon = ref('messages')
/** 点击消息栏菜单按钮事件 */
const clickTabbarIcon = (type:string) => {
    $emit('clickTabbar', type)
    curTabbarIcon.value = type
}

/** 处理分隔线移动 */
const isDividerDragging = ref(false)

const messagesRef = ref()

const dividerRef = ref()

const mainRef = ref()

const maxX = ref(1280)

/** 拖拽事件 */
const handleDragDivider = function(e:any) {
    // console.log(e)
    if(isDividerDragging.value) {
        const x = e.clientX
        const dividerWidth = dividerRef.value.offsetWidth;
        if(messagesRef.value.offsetWidth == 500) maxX.value = x
        // console.log(maxX.value)
        if(x > maxX.value) return
        mainRef.value.style.width = `${window.innerWidth - x - dividerWidth / 2}px`;
    }
    
}

/**
 * 开始拖拽
 * @returns
 */
const startDragDivider = function() {
    isDividerDragging.value = true
    // console.log(isDividerDragging.value)
    // console.log(window.innerWidth)
    document.onmousemove = handleDragDivider
}

/**
 * 停止拖拽
 * @returns
 */
const stopDragDivider = function() {
    isDividerDragging.value = false
    // console.log(isDividerDragging.value)
    window.onmousemove = null
}


onMounted(()=>{
    window.addEventListener('mouseup', stopDragDivider);  
})

onBeforeUnmount(()=>{
    window.removeEventListener('mouseup', stopDragDivider);
})
</script>

<style lang="scss" scoped>
// @import './fakeqq.scss';
.fakeqq-msglist {
    left: 0;
    top: 0;
    width: 100%;
    position: absolute;
    height: calc(100vh - $base-tabbar-height);
    display: flex;
    .msglist__tabbar {
        position: relative;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 54px;
        background-color: #E5E5E5;
        .msglist__tabbar__avatar {
            position: relative;
            margin-top: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            .msglist__tabbar__avatar__img {
                width: 100%; 
                height: 100%;
                border-radius: 50%;
            }
            .msglist__tabbar__avatar__state {
                position: absolute;
                border: 2px solid #E5E5E5;
                width: 14px;
                height: 14px;
                right: 0;
                bottom: 0;
                border-radius: 50%;
            }
        } 
        .msglist__tabbar__top {
            position: relative;
            width: 40px;
            .msglist__tabbar__top__icon {
                margin-top: 10px;
                height: 40px;
                border-radius: 8px; 
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .msglist__tabbar__top__icon:hover {
                background-color: #DCDCDC;
            }
            .msglist__tabbar__top__icon__selected {
                background-color: #DCDCDC;
            }
        }

        .msglist__tabbar__bottom {
            position: relative;
            width: 40px;
            margin-top: auto;
            .msglist__tabbar__bottom__icon {
                margin-top: 10px;
                height: 40px;
                border-radius: 8px; 
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .msglist__tabbar__bottom__icon:hover {
                background-color: #DCDCDC;
            }
        }
        
        
    }
    .msglist__messages {
        // border: 2px solid red;
        min-width: 260px;
        max-width: 500px;
        flex: 1;
        height: 100%;
        .msglist__messages__search {
            position: relative;
            border: 0.1px solid rgba(220, 220, 220, 0.326);
            width: 100%;
            height: 60px;

            .msglist__messages__search__frame {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                margin-left: 10px;
                width: calc(100% - 20px);
                height: 30px;
                
                .msglist__messages__search__frame__left {
                    position: relative;
                    width: calc(100% - 40px);
                    height: 30px;
                    padding: 6px;
                    border-radius: 5px;
                    background-color: #E5E5E5;
                    .msglist__messages__search__frame__input {
                        position: relative;
                        font-size: 14px;
                        line-height: 14px;
                        border: 0;
                        background-color: transparent;
                        width: calc(100% - 18px);
                        height: 18px;
                        bottom: 3px;
                    }
                }

                .msglist__messages__search__frame__right {
                    width: 30px;
                    height: 30px;
                    background-color: #E5E5E5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                }
                .msglist__messages__search__frame__right:hover {
                    cursor: pointer;
                }

            }
        }
    }

    .msglist__messages__main__resizer {
        position: relative;
        background-color: #E5E5E5;
        height: 100%;
        width: 0.1px;
        margin: 0;
        padding: 0;
        .msglist__messages__main__resizer__extend {
            width: 10px;
            position: absolute;
            height: 100%;
            left: -5px;
            background-color: transparent;
            cursor: e-resize;
        }
    }

    .msglist-main {
        background-color: #E5E5E5;
        position: relative;
        width: 100%;
        height: 100%;
        // flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .msglist-header {
        display: flex;
        padding: 12px 0;
        text-align: center;
        justify-content: flex-start;
        align-items: center;
        background-image: #f0f0f0;
        border-bottom: 1px solid #ffffff;
    }
    .msglist-footer__tabbar {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        height: 40px;
        width: 100%;
        background-color: #8b8b8b;
    }
}

.msglist__messages__menu__add {
    // border: 2px solid red;
    .msglist__messages__menu__add__item {
        height: 30px;
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding-left: 5px;
        .msglist__messages__menu__item__desc {
            margin-left: 5px;
        }
    }
    .msglist__messages__menu__add__item:hover {
        cursor: pointer;
        background-color: #F2F2F2;
    }
}

.el-popover.el-popper {
    padding: 5px !important;
}
// @media (orientation: portrait) {
//   .layout_main {
//     padding: 6px !important;
//   }
// }
</style>