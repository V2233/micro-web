<template>
  <Msglist class="message-list" 
      :avatar="userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`"
      :title="userStore.username"
      state="在线"
      @click-tabbar="clickTabbar"
  >
    <template #messages>
      <!-- 消息列表 -->
      <div v-if="curTabbarBtn == 'messages'" class="message-room-list" v-for="(row,index) in botInfoList" :key="index">
        <img class="message-room-avatar" :src="row.avatarUrl" @click="devStore.qqScene = 1"/>
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
            <span>好友通知</span><el-icon><ArrowRightBold /></el-icon>
          </div>
          <div class="contacts-notice-item">
            <span>群通知</span><el-icon><ArrowRightBold /></el-icon>
          </div>
        </div>
        <div class="contacts-tab">
          <el-tabs v-model="curContactsTab" class="demo-tabs">
            <el-tab-pane label="好友" name="first">User</el-tab-pane>
            <el-tab-pane label="群聊" name="second">Config</el-tab-pane>
          </el-tabs>
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
        @connect-ws="Ws.connect(114514)"
        @send-input="sendWs"
      >
        <ToastMessage>2022/5/17 星期二 上午 10:58:39</ToastMessage>
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
        <ImageMessage
          name="某痕"
          avatar="http://q.qlogo.cn/headimg_dl?dst_uin=1365197927&spec=100"
          src="/sandbox/biaoqing1.jpg"
          max-width="150px"
        />
        <ToastMessage>某痕 撤回了一条消息</ToastMessage>
        <NormalMessage name="某痕" avatar="http://q.qlogo.cn/headimg_dl?dst_uin=907247545&spec=100">
          <QuoteMessage name="某痕" time="2022/5/17 星期二 上午 11:28:14">
            <img src="/sandbox/biaoqing1.jpg" />
            
          </QuoteMessage>
          对不起了sagiri，我真的很需要本子机器人
          <img
            src="/sandbox/biaoqing2.png"
            style="height: 1.3em; width: 1.3em; vertical-align: text-bottom"
          />
          <img
            src="/sandbox/biaoqing2.png"
            style="height: 1.3em; width: 1.3em; vertical-align: text-bottom"
          />
          <img
            src="/sandbox/biaoqing2.png"
            style="height: 1.3em; width: 1.3em; vertical-align: text-bottom"
          />
        </NormalMessage>
        <NormalMessage 
            :avatar="userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`"
            :name="userStore.username" 
            onright>
          来一打本子
          <img
            src="/sandbox/biaoqing2.png"
            style="height: 1.3em; width: 1.3em; vertical-align: text-bottom"
          />
        </NormalMessage>
        <VoiceMessage
          name="Sagiri"
          avatar="http://q.qlogo.cn/headimg_dl?dst_uin=762802224&spec=100"
          src="/sandbox/11_欧尼酱快起床.mp3"
        />
        <FileMessage
          name="Sagiri"
          avatar="http://q.qlogo.cn/headimg_dl?dst_uin=762802224&spec=100"
          filename="secret.zip"
          filesize="6.33MB"
          fileicon="/logo.png"
          :click="click"
        />
        <div v-for="(msg,id) in Ws.msgQueue" :key="id">
          <!-- 机器人消息 -->
          <div v-if="!msg.isSelf && msg.params?.message && msg.params?.message?.length > 0">
            <NormalMessage
              v-if="msg.params.message.some((s:MessageElem)=> s.type == 'text' || msg.params.message.length > 1)"
              :avatar="selfAvatar"
              :name="userStore.username" 
              role="member"
              role_title="LV1"
            >
              <div v-for="(seg,segId) in msg.params.message">
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
              max-width="150px"
            />
            <ImageMessage
              v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'face')"
              :avatar="selfAvatar"
              :name="userStore.username" 
              role="member"
              role_title="LV1"
              :src="`/qfaces/s${msg.params.message[0].data.id}.gif`"
              max-width="80px"
            />
            <VoiceMessage
              v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'record')"
              :avatar="selfAvatar"
              :name="userStore.username" 
              role="member"
              role_title="LV1"
              :src="msg.params.message[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
              :duration="15"
            />
            <VideoMessage
              v-if="msg.params.message.length == 1 && msg.params.message.some((s:MessageElem) => s.type == 'video')"
              :avatar="selfAvatar"
              :name="userStore.username" 
              role="member"
              role_title="LV1"
              :src="msg.params.message[0].data.file.replace(/^base64:\/\//,'data:video/mp4;base64,')"
              max-width="400px"
            />
          </div>
          <!-- 自己的消息 -->
          <div v-if="msg.isSelf == true && msg.message">
            <NormalMessage
              v-if="msg.message.some((s:MessageElem)=> s.type == 'text' || msg.params.message.length > 1)"
              :avatar="selfAvatar"
              :name="userStore.username"
              role="owner"
              role_title="LV1"
              onright
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
              max-width="150px"
              onright
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
            />
          </div>
        </div>
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

// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import type { MessageElem } from './protocol/onebotv11/message/message.elem'
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

const curTabbarBtn = ref('messages')

const selfAvatar = userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`

onMounted(() => {
  getBotInfo()
})

const getBotInfo = async () => {
  let res: BotInfoResponseType = await reqBotInfo()
  if (res.code == 200) {
    botInfoList.value = res.data
  }
}

const sendWs = (data:string) => {
    const message:MessageElem[] = [{
      type: "text",
      data: {
          text: data
      }
    }]

    const pre = Events.group_message(Date.now(),441307983,2330660495,'v',message,Events.makeCQ(message),'normal','owner')
    Ws.value.msgQueue.push(Object.assign(pre,{isSelf: true}))

    console.log('发送消息；')
    console.log(pre)
    Ws.value.bot?.send(JSON.stringify(pre))
}

const click = () => {
  window.open('https://www.bilibili.com/video/BV1GJ411x7h7', '_blank')
}

const clickTabbar = (btn:'messages' | 'contacts') => {
  curTabbarBtn.value = btn
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

  .contacts-list {
    .contacts-friends-manager-btn {
      width: calc(100% - 20px);
      margin: 10px 10px;
    }
    .contacts-notice {
      width: calc(100% - 20px);
      height: 60px;
      // border: 2px solid red;
      margin: 0 10px;
      .contacts-notice-item {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .contacts-notice-item:hover {
        background-color: #F5F5F5;
      }
      
    }
    .contacts-tab {
      width: calc(100% - 20px);
      height: 40px;
      margin: 0 10px;
    }
  }
  
  .message-room-list:hover {
    background-color: #F5F5F5;
  }
  .msglist-main-logo {
      color: #b6b6b6;
      font-size: 50px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
}
</style>
