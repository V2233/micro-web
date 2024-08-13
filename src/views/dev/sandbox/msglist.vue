<template>
    <div class="fakeqq-msglist">
        <div class="msglist__tabbar">
            <!-- 导航栏头像 -->
            <div class="msglist__tabbar__avatar" :style="{backgroundImage: `url(${avatar})`}">
                <div class="msglist__tabbar__avatar__state" :style="{backgroundColor: `#2CEA8C`}"></div>
            </div>
            <!-- 导航栏顶端 -->
            <div class="msglist__tabbar__top">
                <div class="msglist__tabbar__top__icon" @click="$emit('clickTabbar','messages')">
                    <svg-icon name="message" width="40px" height="40px" color="black"/>
                </div>
                <div class="msglist__tabbar__top__icon" @click="$emit('clickTabbar','contacts')">
                    <svg-icon name="contacts" width="26px" height="26px" color="black"/>
                </div>
                <div class="msglist__tabbar__top__icon" @click="$emit('clickTabbar','contacts')">
                    <svg-icon name="channel" width="20px" height="26px" color="black"/>
                </div>
            </div>
            <!-- 导航栏底部 -->
            <div class="msglist__tabbar__bottom">
                <div class="msglist__tabbar__bottom__icon" @click="$emit('clickTabbar','contacts')">
                    <el-icon size="26"><Expand /></el-icon>
                </div>
            </div>
        </div>
        <!-- 列表栏 -->
        <div class="msglist__messages">
            <div class="msglist__messages__search">
                <div class="msglist__messages__search__frame">
                    <div class="msglist__messages__search__frame__left">
                        <el-icon size="large" color="#9F9F9F"><Search /></el-icon>
                        <input class="msglist__messages__search__frame__input" :value="searchText" placeholder="搜索"></input>
                    </div>
                    <div class="msglist__messages__search__frame__right">
                        <el-icon size="large" color="#9F9F9F"><Plus /></el-icon>
                    </div>
                </div>
            </div>
            <slot name="messages"></slot>
        </div>

        <!-- 主视图 -->
        <div class="msglist-main">
            <slot name="main"></slot>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const curTool = ref(0)
const emojiRef = ref()

const props = defineProps({
    avatar: { type: String, required: true },
    title: { type: String, required: true },
    searchText: { type: String, default: ''},
    // state: { type: String, default: '离线' },
})

const $emit = defineEmits(['clickTabbar'])

const setWindowFullScreen = () => {
    // document.documentElement.requestFullscreen()
    // screen.orientation.lock('portrait')
}

const exitWindowFullScreen = () => {
    // document.exitFullscreen()
}

</script>

<style lang="scss">
// @import './fakeqq.scss';
.fakeqq-msglist {
    position: relative;
    // margin: -20px;
    height: calc(100vh - $base-tabbar-height);
    display: flex;
    .msglist__tabbar {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - $base-tabbar-height);
        width: 75px;
        left: 0;
        background-color: #E5E5E5;
        .msglist__tabbar__avatar {
            position: relative;
            margin-top: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
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
            // height: 30vh;
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
        width: 400px;
        height: calc(100vh - $base-tabbar-height);
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
                
            }
        }
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
    .msglist-main {
        background-color: #E5E5E5;
        position: relative;
        width: 100%;
        height: calc(100vh - $base-tabbar-height);
        display: flex;
        justify-content: center;
        align-items: center;
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

// @media (orientation: portrait) {
//   .layout_main {
//     padding: 6px !important;
//   }
// }
</style>