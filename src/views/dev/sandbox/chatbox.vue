<template>
    <div class="fakeqq-window">
        <div class="fakeqq-header">
            <svg-icon name="back" class="fakeqq-header__bth" color="#000000" @click="footer_type == 'none'?devStore.qqScene = 1:devStore.qqScene = 0"/>
            <span class="fakeqq-header__title">
                <svg-icon name="ear" class="fakeqq-header__bth" color="#000000"/>
                {{ title }}{{ count ? '(' + count + ')' : '' }}
            </span>
            <svg-icon name="menu" width="24px" height="24px" class="fakeqq-header__bth" color="#000000" @click="goSetting" />
        </div>
        <div class="fakeqq-container" ref="containerRef">
            <div class="fakeqq-container-drawer">
                <el-drawer 
                    v-model="isDrawerOpen" 
                    size="50%" 
                    title="群聊设置" 
                    :with-header="false" 
                    @close="goSetting(false)"
                    style="background-color: #F2F2F2;"
                >
                    <slot name="drawer"></slot>
                </el-drawer>
            </div>
            <slot name="chat"></slot>
        </div>
        <div class="fakeqq-footer" v-show="footer_type == 'Input'">
            <form class="fakeqq-footer__input">
                <textarea class="fakeqq-footer__input-text" contenteditable="true" v-model="inputValue"></textarea>
                <button class="fakeqq-footer__input-btn" type="reset" @click="$emit('sendInput',inputValue)">发送</button>
            </form>
            <div class="fakeqq-footer__btn">
                <svg-icon name="voice" @click="$emit('connectWs',{})"/>
                <svg-icon name="pic" />

                <!-- Emoji表情 -->
                <el-popover placement="top-start" title="Emoji" :width="320" trigger="click">
                  <div class="emoji-box">
                    <!-- <emoji-picker ref="emojiRef"/> -->
                    <Picker 
                        :data="emojiIndex" 
                        set="twitter" 
                        :emojiSize="18"
                        :showPreview="false"
                        @select="handleInput('emoji', $event)" 
                        :style="{ height: '300px' }"
                    />
                  </div>

                  <template #reference>
                    <svg-icon name="emoji" />
                  </template>
                </el-popover>
                <!-- <svg-icon name="camera" /> -->

                <!-- 指令列表 -->
                <el-popover placement="top-start" title="指令列表" :width="360" trigger="click" v-model:visible="isRegsVisible">
                    <div class="regs-box">
                        <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo dark-mode"
                        >
                            <el-sub-menu 
                                :index="'pkg-' + index" 
                                popper-class="dark-mode"
                                :popper-offset="4" 
                                v-for="(pkg,index) in pkgs" 
                                :key="index"
                            >
                                <template #title>
                                    <el-icon><FolderOpened /></el-icon>
                                    <span>{{ pkg.packName }}</span>
                                </template>
                          
                                <el-sub-menu :index="'js-' + id" v-for="(js,id) in pkg.packPlugins" :key="id">
                                    <template #title>
                                        <el-icon><Guide /></el-icon>
                                        <span>{{ js.pluginTitle }}</span>
                                    </template>
                                    <el-menu-item v-for="(reg, i) in js.pluginFuns" @click="handleInput('regs', `${index}.${id}.${i}`)">{{ reg }}</el-menu-item>
                                </el-sub-menu>
                        
                            </el-sub-menu>
                        </el-menu>
                    </div>

                    <template #reference>
                        <svg-icon name="redpack" @click="getPluginsLoader"/>
                    </template>
                </el-popover>
                
                <!-- QQ表情 -->
                <el-popover placement="top-start" title="QQFaces" :width="300" trigger="click">
                  <div class="face-box">
                    <el-image class="face-image" v-for="face in faceData" :key="face.QSid"
                      :src="`/qfaces/s${face.QSid}.gif`"
                      @click="$emit('qqFace',face.QSid)" />
                  </div>

                  <template #reference>
                    <svg-icon name="emoji" />
                  </template>
                </el-popover>
                <svg-icon name="more" />
            </div>
            
        </div>
        <div class="fakeqq-footer-multicheck" v-if="footer_type == 'MultiCheck'">
            <div class="fakeqq-footer-multicheck-icon">
                <svg-icon name="forward" width="30px" height="30px"></svg-icon>
            </div>
            <div class="fakeqq-footer-multicheck-icon">
                <svg-icon name="multiforward" width="24px" height="24px"></svg-icon>
            </div>
            <div class="fakeqq-footer-multicheck-icon">
                <el-icon size="26"><Delete /></el-icon>
            </div>
            <div class="fakeqq-footer-multicheck-icon">
                <el-icon size="30"><Close /></el-icon>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
// all emoji sets.
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
//@ts-ignore
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import { watch, ref, nextTick } from 'vue'
import faceData from '@/assets/qfaces/data.json'
import useDevStore from '@/store/modules/dev';
import { reqPluginsLoader } from '@/api/dev/sandbox/index'

const devStore = useDevStore()
const pkgs = ref<any[]>([])

/** 表情索引实例 */
const emojiIndex = ref(new EmojiIndex(data))

/** input输入内容 */
const inputValue = ref('')

/** 指令可视化 */
const isRegsVisible = ref(false)

/** 聊天容器实例 */
const containerRef = ref()

/** 抽屉打开状态 */
const isDrawerOpen = ref(false)

const props = defineProps({
    title: { type: String, required: true },
    count: { type: [String, Number], default: '' },
    /** 页脚类型(none-无，Input-输入框，MultiCheck-多选) */
    footer_type: {type: String, default: 'Input'},
    /** 用于刷新滚动条 */
    msgs_length: {type: Number, default: 0}
})

/** 监听窗口高度变化 */
watch(()=> props.msgs_length,()=>{
    nextTick(() => { 
        containerRef.value.scrollTop = containerRef.value.scrollHeight;  
    })
})

const $emit = defineEmits(['sendInput','connectWs','qqFace','goSetting'])



/**
 * 进入设置
 */
const goSetting = (closed?:boolean) => {
    if(closed === false) {
        isDrawerOpen.value = false
        $emit('goSetting',false)
        return
    }
    if(isDrawerOpen.value) {
        isDrawerOpen.value = false
        $emit('goSetting',false)
    } else {
        isDrawerOpen.value = true
        $emit('goSetting',true)
    }
    
}

/**
 * 获取插件信息
 */
const getPluginsLoader = async() => {
    let res:any = await reqPluginsLoader()
    console.log(res)
    if(res.code == 200) {
        pkgs.value = res.data
    }
}

/**
 * 处理各种输入
 * @param type 
 * @param i 
 */
const handleInput = (type:string, i:any) => {
    
    switch(type) {
        case "regs":
            isRegsVisible.value = false
            const [pkgId,jsId,regId] = (i as string).split('.').map(id => Number(id))
            const str = pkgs.value[pkgId]?.packPlugins[jsId]?.pluginFuns[regId]
            const regex = /[\u4e00-\u9fa5a-zA-Z0-9]+/g;  
            const reg = str.match(regex) ? str.match(regex).join('') : str;  
            inputValue.value += reg
        case "emoji":
            isRegsVisible.value = false
            inputValue.value += i.native
    }
}

</script>

<style lang="scss">
@import './fakeqq.scss';
.face-box {
  width: 100%;
  height: 300px;
  overflow-y: scroll;
  cursor: pointer;

  .face-image {
    width: 25px;
    height: 25px;
  }
}

.regs-box {
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  cursor: pointer;
}

.emoji-box {
  width: 100%;
  height: 300px;
  cursor: pointer;
}

.fakeqq-container-drawer {
    position: absolute;
    width: 100%;
    height: 100%;
    .el-overlay {
        position: absolute;
        overflow: hidden;
        .el-drawer__body {
            padding: 0;
        }
    }
}

.fakeqq-footer-multicheck {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #f5f4f2;
    height: 100px; 
    // border: 2px solid red;
    .fakeqq-footer-multicheck-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%; 
        background-color: #FFFFFF;
    }
}
</style>