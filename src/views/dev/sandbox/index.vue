<template>
  <Msglist class="message-list" 
      :avatar="userStore.avatar ? userStore.avatar : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`"
      :title="userStore.username"
      state="在线"
  >
    <template #messages>
      <div class="bot-list" v-for="(row,index) in botInfoList" :key="index">
        <img class="bot-avatar" :src="row.avatarUrl" @click="devStore.qqScene = 1"/>
      </div>
    </template>
    <template #main>
      <!-- <Chatroom class="chatroom" /> -->
      <QQWindow class="chatroom" v-if="devStore.qqScene == 1" :title="title" :count="count" >
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
import FileMessage from './messages/file.vue'

// QQ-messagesList
import Msglist from './msglist.vue';

// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
const $route = useRoute()

const userStore = useUserStore()

const devStore = useDevStore()

const botInfoList = ref<BotInfoListType>([])

const title = ref($route.meta.title?.toString() || 'Unknown')

const count = ref('1')


const messages = ref([])

onMounted(() => {
  getBotInfo()
})

const getBotInfo = async () => {
  let res: BotInfoResponseType = await reqBotInfo()
  // console.log(res)
  if (res.code == 200) {
    botInfoList.value = res.data
  }
}

const click = () => {
  window.open('https://www.bilibili.com/video/BV1GJ411x7h7', '_blank')
}

</script>

<style scoped lang="scss">
.chatroom {
    padding: 0;
}

.bot-list {
    height: 50px;
    width: 100%;
    .bot-avatar {
        margin-left: 30px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }
}
</style>
