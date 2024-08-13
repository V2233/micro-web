<template>
  <Msglist class="message-list" 
      :avatar="userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`"
      :title="userStore.username"
      state="在线"
      @click-tabbar="clickTabbar"
  >
    <template #messages>
      <!-- 消息列表 -->
      <div v-if="curTabbarBtn == 'messages'" class="message-room-list" v-for="(row,index) in botInfoList" :key="index" @click="devStore.qqScene = 1">
        <img class="message-room-avatar" :src="row.avatarUrl"/>
        <div class="message-room-info">
          <div class="message-room-info-top">
            <span style="font-size: 14px;">{{ row.nickname }}</span>
            <span style="font-size: 12px;">{{ row.botRunTime }}</span>
          </div>
          <div class="message-room-info-bottom">
            <span style="font-size: 12px;">{{ row.platform }}</span>
            <el-badge :value="100" :max="10" class="item"></el-badge>
          </div>
        </div>
      </div>
      <!-- 联系人列表 -->
      <div v-if="curTabbarBtn == 'contacts'" class="contacts-list">
        <el-button class="contacts-friends-manager-btn">
          <el-icon><Avatar /></el-icon>好友管理器
        </el-button>
        <div class="contacts-notice">
          <div class="contacts-notice-item">
            <span>好友通知</span><el-icon><ArrowRight /></el-icon>
          </div>
          <div class="contacts-notice-item">
            <span>群通知</span><el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="contacts-tab">
          <SildeTab @change="curActiveTab = $event"/>
          <!-- 好友 -->
          <el-collapse v-if="curActiveTab == 0" v-model="activeNames" @change="handleChange">
            <el-collapse-item title="机器人" name="1">
              <!-- 机器人列表 -->
              <div class="message-room-list" v-for="(row,index) in botInfoList" :key="index">
                <img class="message-room-avatar" :src="row.avatarUrl" @click="devStore.qqScene = 1"/>
                <div class="message-room-info">
                  <div class="message-room-info-top">
                    <span style="font-size: 14px;">{{ row.nickname }}</span>
                  </div>
                  <div class="message-room-info-bottom">
                    <span style="font-size: 12px;">{{ row.platform }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="我的好友" name="2">
              <div>
                
              </div>
            </el-collapse-item>
          </el-collapse>
          <!-- 群聊 -->
          <el-collapse v-if="curActiveTab == 1" v-model="activeNames" @change="handleChange">
            <el-collapse-item title="置顶群聊" name="1">
              
            </el-collapse-item>
            <el-collapse-item title="我创建的群聊" name="2">

            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </template>

    <template #main>
      <div class="msglist-main-logo" v-if="devStore.qqScene == 0">
        Yunzai-Sandbox
      </div>
      <!-- <Chatroom class="chatroom" /> -->
      <QQWindow class="chatroom" v-if="devStore.qqScene == 1" 
        :title="title" 
        :count="count" 
        :msgs_length="Ws.msgQueue.length"
        :footer_type="footer_type"
        @connect-ws="Ws.connect(114514)"
        @send-input="sendWs($event,'text')"
        @qq-face="sendWs($event,'face')"
        @go-setting="handleDrawerSetting"
      >
        <template #chat>
          <!-- <ToastMessage>2022/5/17 星期二 上午 10:58:39</ToastMessage>
          <ForwardMessage
            name="Evyde HF"
            :avatar="userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`"
            title="转发"
            :contents="['LIAN-小明: [图片]', 'LIAN-小明: 隔壁群的机器人已经可以识别本子了', 'LIAN-小明: [图片]']"
            counts="10"
          />
          <ToastMessage>2022/5/17 星期二 上午 11:28:06</ToastMessage>
          <NormalMessage name="某痕" avatar="http://q.qlogo.cn/headimg_dl?dst_uin=1365197927&spec=100">
            <QuoteMessage name="Evyde HF" time="2022/5/17 星期二 上午 10:58:39">[聊天记录]</QuoteMessage>
            这个是<br />
            我的真寻<br />
            本来是用的sagiri
          </NormalMessage>
          <FileMessage
            name="Sagiri"
            avatar="http://q.qlogo.cn/headimg_dl?dst_uin=762802224&spec=100"
            filename="secret.zip"
            filesize="6.33MB"
            fileicon="/logo.png"
            :click="downloadFile"
          /> -->

          <div v-for="(msg,id) in Ws.msgQueue" :key="id" style="display: flex;">
            <div v-if="isMultiCheckMode == true" class="chatroom-multicheck-box">
              <el-icon class="chatroom-multicheck-icon-checked" v-if="multicheckIndex[id]" color="#0099FF" size="24" @click="handleMultiCheck(id)"><CircleCheckFilled /></el-icon>
              <el-icon class="chatroom-multicheck-icon-unchecked" v-if="!multicheckIndex[id]" color="#C7C7C7" size="24" @click="handleMultiCheck(id)"><Remove /></el-icon>
            </div>
            <!-- 机器人消息 -->
            <div v-if="!msg.isSelf && msg.params?.message && msg.params?.message?.length > 0" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']" style="width: 100%;">
              <NormalMessage
                v-if="msg.params.message.some((s:MessageElem)=> s.type == 'text' || msg.params.message.length > 1)"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                @msg-operation="handleMsgOperation($event,msg,id)"
              >
                <div v-for="(seg,segId) in msg.params.message">
                  <QuoteMessage
                    v-if="seg.type == 'reply'"
                    :name="quotePreview(seg.data.id).sender.nickname" :time="quotePreview(seg.data.id).time">
                    <span v-if="quotePreview(seg.data.id).message[0].type == 'text'">{{ quotePreview(seg.data.id).message[0].data.text }}</span>
                    
                  </QuoteMessage>
                  <span v-if="seg.type == 'at'" style="color: blue;">
                    @{{ seg.data.qq }}
                  </span>
                  <span v-if="seg.type == 'text'">{{ seg.data.text }}</span>
                  <el-image
                    v-if="seg.type == 'image' && msg.params.message.length > 1"
                    :src="seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                    :src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                    :initial-index="0"
                    style="width: 200px;"
                  />
                  <img 
                    v-if="seg.type == 'face' && msg.params.message.length > 1"
                    :src="`/qfaces/s${seg.data.id}.gif`"
                    style="width: 24px;"
                  />
                </div>
              </NormalMessage>
              <ImageMessage
                v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'image')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="msg.params.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[msg.params.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <ImageMessage
                v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'face')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="`/qfaces/s${msg.params.message[0].data.id}.gif`"
                max-width="80px"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <VoiceMessage
                v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'record')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="msg.params.message[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
                :duration="15"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <VideoMessage
                v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'video')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="msg.params.message[0].data.file.replace(/^base64:\/\//,'data:video/mp4;base64,')"
                max-width="300px"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              
            </div>
            <!-- 合并转发 -->
            <div style="width: 100%;" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']">
              <ForwardMessage
                v-if="!msg.isSelf && msg.params?.messages && msg.params?.messages?.length > 0"
                class="chatroom-forward"
                :name="userStore.username"
                :avatar="selfAvatar"
                title="转发"
                :contents="makeForwardPreview(msg.params?.messages)"
                counts="10"
                @click="(devStore.qqScene = 2,curForwardMessages = msg)"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <ToastMessage v-if="msg.isDeleted">{{ userStore.username }} 撤回了一条消息</ToastMessage>
            </div>
            <!-- 自己的消息 -->
            <div v-if="msg.isSelf == true && msg.message && msg.message?.length > 0" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']" style="width: 100%;">
              <NormalMessage
                v-if="msg.message.some((s:MessageElem)=> s.type == 'text' || msg.params.message.length > 1)"
                :avatar="selfAvatar"
                :name="userStore.username"
                role="owner"
                role_title="LV1"
                onright
                @msg-operation="handleMsgOperation($event,msg,id)"
              >
                <div v-for="(seg,segId) in msg.message">
                  <span v-if="seg.type == 'text'">{{ seg.data.text }}</span>
                  <el-image 
                    v-if="seg.type == 'image' && msg.params.message.length > 1"
                    :src="seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                    :src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                    :initial-index="0"
                    style="width: 200px;"
                  />
                  <img 
                    v-if="seg.type == 'face' && msg.params.message.length > 1"
                    :src="`/qfaces/s${seg.data.id}.gif`"
                    style="width: 24px;"
                  />
                </div>
              </NormalMessage>
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'image')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="owner"
                role_title="LV1"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
                onright
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'face')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="owner"
                role_title="LV1"
                :src="`/qfaces/s${msg.message[0]?.data?.id}.gif`"
                max-width="80px"
                onright
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              
            </div>
          </div>
        </template>
        <template #drawer>
          <GroupSetting />
        </template>
      </QQWindow>
      <!-- 合并转发 -->
      <QQWindow class="chatroom" v-if="devStore.qqScene == 2" 
        :title="title" 
        :count="count" 
        footer_type="none"
      >
        <template #chat>
          <div v-for="(node, nodeId) in curForwardMessages.params?.messages" :key="nodeId" style="display: flex;">
            <div v-if="node.type == 'node'" style="width: 100%;">
              <NormalMessage
                v-if="node.data.content.some((s:MessageElem)=> s.type == 'text' || node.data.content.length > 1)"
                :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${node.data.uin}`"
                :name="node.data?.name"
                role="member"
                role_title="LV1"
              >
                <div v-for="(seg,segId) in node.data?.content">
                  <span v-if="seg.type == 'at'" style="color: blue;">
                    @{{ seg.data.qq }}
                  </span>
                  <span v-if="seg.type == 'text'">{{ seg.data.text }}</span>
                  <el-image 
                    v-if="seg.type == 'image' && node.data?.content.length > 1"
                    :src="seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                    :src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                    :initial-index="0"
                    style="width: 200px;"
                  />
                  <img 
                    v-if="seg.type == 'face' && node.data?.content.length > 1"
                    :src="`/qfaces/s${seg.data.id}.gif`"
                    style="width: 24px;"
                  />
                </div>
              </NormalMessage>
              <ImageMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'image')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="node.data.content[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[node.data.content[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
              />
              <ImageMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'face')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="`/qfaces/s${node.data.content[0].data.id}.gif`"
                max-width="80px"
              />
              <VoiceMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'record')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="node.data.content[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
                :duration="15"
              />
              <VideoMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'video')"
                :avatar="selfAvatar"
                :name="userStore.username" 
                role="member"
                role_title="LV1"
                :src="node.data.content[0].data.file.replace(/^base64:\/\//,'data:video/mp4;base64,')"
                max-width="300px"
              />
            </div>
          </div>
        </template>
      </QQWindow>
    </template>
  </Msglist>
  
</template>

<script setup lang="ts">
// QQ-Chatroom
import QQWindow from './chatbox.vue'
import ToastMessage from './messages/toast.vue'
import NormalMessage from './messages/normal.vue'
import ImageMessage from './messages/image.vue'
import QuoteMessage from './messages/quote.vue'
import ForwardMessage from './messages/forward.vue'
import VoiceMessage from './messages/voice.vue'
import VideoMessage from './messages/video.vue'
import FileMessage from './messages/file.vue'

// QQ-messagesList
import Msglist from './msglist.vue';
import GroupSetting from './groupSetting.vue'

// 小组件
import SildeTab from './components/tab.vue'
import { ElMessage } from 'element-plus'

import { getFormatDate } from '@/utils/time'
// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import type { MessageElem,NodeElem } from './protocol/onebotv11/message/message.elem'
import Events from './protocol/onebotv11/event/event'
import Onebot from './protocol/ws'

const Ws = ref(new Onebot())

const $route = useRoute()

const userStore = useUserStore()

const devStore = useDevStore()

/** bot信息列表 */
const botInfoList = ref<BotInfoListType>([])

/** 聊天室标题 */
const title = ref($route.meta.title?.toString() || 'Unknown')

/** 联系人分段栏 */
const curContactsTab = ref('')

/** 群号 */
const count = ref('114514')

/** 当前导航按钮 */
const curTabbarBtn = ref('messages')

/** 当前分段栏 */
const curActiveTab = ref(0)

/** 联系人折叠面板 */
const activeNames = ref(['1'])

/** 合并转发窗口 */
const curForwardMessages = ref<any>([])

/** 多选索引 */
const multicheckIndex = ref<any>({})

/** 是否为多选模式 */
const isMultiCheckMode = ref(false)

/** 聊天室底层控件类型 */
const footer_type = ref<'Input' | 'MultiCheck' | 'none'>('Input')

/**
 * 折叠面板折叠事件
 */
const handleChange = (val: string[]) => {
  console.log(val)
}

/** 个人头像 */
const selfAvatar = userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`

onMounted(() => {
  getBotInfo()
})

/**
 * 获取机器人信息
 */
const getBotInfo = async () => {
  let res: BotInfoResponseType = await reqBotInfo()
  if (res.code == 200) {
    botInfoList.value = res.data
  }
}

/** 发送文本消息 */
const sendWs = (data:string,type:string) => {
    const message:MessageElem[] = []
    switch(type) {
      case 'text':
        message.push({type: "text",data: {text: data}})
        break
      case 'face':
        message.push({type: "face",data: {id: data}})
        break;
      case 'at':
        message.push({type: "at",data: {qq: data}})
        break;
      case 'image':
        message.push({type: "image",data: {url: data,file: data}})
        break
      default: 
        ElMessage.error('无法发送此消息')
    }

    const pre = Events.group_message(Math.round(Date.now() / 1000),441307983,2330660495,'v',message,Events.makeCQ(message),'normal','owner')
    Ws.value.msgQueue.push(Object.assign(pre,{isSelf: true}))

    console.log('发送消息；')
    console.log(pre)
    Ws.value.bot?.send(JSON.stringify(pre))
}

/** 模拟下载文件 */
const downloadFile = () => {
  window.open('https://www.bilibili.com/video/BV1GJ411x7h7', '_blank')
}

/** 导航栏按钮事件 */
const clickTabbar = (btn:'messages' | 'contacts') => {
  curTabbarBtn.value = btn
}

/** 制作转发预览内容 */
const makeForwardPreview = (messages:NodeElem[]) => {
  let res:string[] = []
  messages.forEach((node) => {
    let sender = node.data.name??node.data.nickname
    let desc = ''
    if(node.data.content) {
      let seg = node.data.content[0] as MessageElem
      switch(seg.type) {
        case 'text':
          desc = seg.data.text.length>20?(seg.data.text.slice(0,30) + '...'):seg.data.text
          break
        case 'image':
          desc = '[图片]'
          break
        case 'face':
          desc = '[表情]'
          break
        case 'record':
          desc = '[语音]'
          break
        case 'video':
          desc = '[视频]'
          break
        case 'dice':
          desc = '[骰子]'
          break
        case 'rps': 
          desc = '[猜拳]'
          break
        case 'markdown':
          desc = '[markdown]'
          break
        case 'button':
          desc = '[按钮]'
          break
        case 'keyboard':
          desc = '[按钮]'
          break
        default:
          desc = '[暂不支持该消息类型]'
      }
    }
    res.push(`${sender}:${desc}`)
  });
  return res
}

/** 查找引用消息 */
const quotePreview = (id:string) => {
  const quoteMsg = Ws.value.msgQueue.find((msg)=>msg.message_id == id)
  return quoteMsg || {}
}

/** 自动滚动到底部 */
const scrollToBottom = () => {
  
}

/** 处理消息气泡操作 */
const handleMsgOperation = async(e:{type:string},msg:any,id:number) => {
  console.log(e)
  switch(e.type) {
    case 'delete':
      Ws.value.msgQueue.splice(id,1)
      break;
    case 'withdraw':
      msg.isDeleted = true
      if(msg.message) msg.message = []
      if(msg.params?.message) msg.params.message = []
      break;
    case 'copy':
      navigator.clipboard && await navigator?.clipboard?.writeText(msg.raw_message);  
      break;
    case 'multicheck':
      isMultiCheckMode.value = true
      break;
  }
}

/** 多选逻辑 */
const handleMultiCheck = (index:number) => {
  if(multicheckIndex.value[index] === null || multicheckIndex.value[index] === undefined) {
    multicheckIndex.value[index] = true
  } else {
    delete multicheckIndex.value[index]
  }
  if(Object.keys(multicheckIndex.value).length > 0) {
    footer_type.value = 'MultiCheck'
  } else {
    footer_type.value = 'Input'
  }
}

/** 多选后的消息操作逻辑 */
const handleMultiMsgs = () => {
  console.log(multicheckIndex.value)
}

/** 打开设置抽屉的事件处理 */
const handleDrawerSetting = (isOpen:boolean) => {
  if(isOpen) {
    footer_type.value = 'none'
  } else {
    footer_type.value = 'Input'
  }
}
</script>

<style scoped lang="scss">

.message-list {
  
  .message-room-list {
    // border: 2px solid red;
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    .message-room-avatar {
      margin-left: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .message-room-info {
      margin-left: 10px;
      width: calc(100% - 76px);
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .message-room-info-top,.message-room-info-bottom {
        width: 100%;
        height: 18px;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .message-room-list:hover {
    background-color: #F5F5F5;
  }

  .contacts-list {
    .contacts-friends-manager-btn {
      width: calc(100% - 20px);
      margin: 10px 10px;
    }
    .contacts-notice {
      width: calc(100% - 20px);
      height: 80px;
      // border: 2px solid red;
      margin: 0 10px;
      .contacts-notice-item {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
      }
      .contacts-notice-item:hover {
        background-color: #F5F5F5;
      }
      
    }
    .contacts-tab {
      width: calc(100% - 20px);
      height: 30px;
      margin: 5px 10px;
      // border: 2px solid red;
    }
  }
  
  .msglist-main-logo {
      color: #b6b6b6;
      font-size: 50px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .chatroom-multicheck-box {
    width: 80px; 
    height: auto; 
    // border: 2px solid red;
    display: flex; 
    flex-direction: column;
    align-items: center;
    .chatroom-multicheck-icon-checked,.chatroom-multicheck-icon-unchecked {
      margin-top: 15px;
    }
  }

  .chatroom-msg-checked {
    background-color: #DFDFDF;
  }

}
</style>
