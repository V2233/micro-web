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
            <el-badge :value="100" :max="99" class="item"></el-badge>
          </div>
        </div>
      </div>
      <div v-if="curTabbarBtn == 'messages'" class="message-room-list" v-for="(row,index) in devStore.onebot11.group_list" :key="index" @click="devStore.qqScene = 1">
        <img class="message-room-avatar" :src="`https://p.qlogo.cn/gh/${row.group_id}/${row.group_id}/640`"/>
        <div class="message-room-info">
          <div class="message-room-info-top">
            <span style="font-size: 14px;">{{ row.group_name }}</span>
            <span style="font-size: 12px;">
              {{ getFormatDate(new Date(devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1]?.time * 1000),3) }}
            </span>
          </div>
          <div class="message-room-info-bottom">
            <div style="font-size: 12px; width: calc(100% - 30px); display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
              {{ devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1]?.sender?.card }}: 
              {{ devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1]?.raw_message }}
            </div>
            <el-badge  
              class="item"
              v-if="devStore.onebot11.msgQueue.length > 0"
              :value="devStore.onebot11.msgQueue.length" 
              :max="99" >
            </el-badge>
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
        :title="(curGroup as groupInfoType)?.group_name" 
        :count="(curGroup as groupInfoType)?.member_list?.length" 
        :msgs_length="devStore.onebot11.msgQueue.length"
        :footer_type="footer_type"
        :footerview_visible = "footerview_visible"
        @connect-ws="Ws.connect(devStore.onebot11.cur_self_id)"
        @send-input="sendWs($event)"
        @go-setting="handleDrawerSetting"
        @multi-check="handleMultiMsgs"
        @footer-btn="(curFooterBtn = $event,($event == 'none'?footerview_visible = false:footerview_visible = true))"
      >
        <!-- at触发时弹出列表 -->
        <template #atlist>
          <div class="fakeqq-footer__members__list">
            <div class="fakeqq-footer__members__list__item" 
              v-for="(member, memberId) in (curGroup as groupInfoType)?.member_list" :key="memberId">
              <img class="members-item-avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${member.user_id}`">
              <div class="members-item-nickname">
                  {{ member.nickname }}
              </div>
            </div>
          </div>
        </template>
        <!-- 输入框底部弹出工具栏 -->
        <template #tools>
          <!-- 文件上传 -->
          <div v-if="curFooterBtn == 'file'">
            <el-upload class="fakeqq-footer__uploader" 
              action="/api/sandbox/upload"
              multiple 
              drag
              ref="uploadRef" 
              v-model:file-list="fileList"
              :show-file-list="true" 
              :on-preview="handleFilePreview"
              :on-success="handleUploadSuccess" 
              :before-upload="handleUpload" 
              :auto-upload="false"
            >
              <!-- <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template> -->
              <el-icon class="el-icon--upload"><Plus /></el-icon>
            </el-upload>
            <el-button type="primary" size="default" @click="confirmUpload">
                  确认提交
            </el-button>
          </div>
          <div v-if="curFooterBtn == 'face'">
            <div class="face-box">
              <el-image class="face-image" v-for="face in faceData" :key="face.QSid"
                :src="`/qfaces/s${face.QSid}.gif`"
                @click="sendWs({type: 'face', data: {id: face.QSid}})" />
              </div>
            </div>
          <div v-if="curFooterBtn == 'audio'">
            <div class="audio-box" style="height: 160px;">
              
            </div>
          </div>
        </template>
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

          <div v-for="(msg,id) in devStore.onebot11.msgQueue" :key="id" style="display: flex; width: 100%;">
            <div v-if="isMultiCheckMode == true && !msg.toast_time" class="chatroom-multicheck-box">
              <el-icon class="chatroom-multicheck-icon-checked" v-if="multicheckIndex[id]" color="#0099FF" size="24" @click="handleMultiCheck(id)"><CircleCheckFilled /></el-icon>
              <el-icon class="chatroom-multicheck-icon-unchecked" v-if="!multicheckIndex[id]" color="#C7C7C7" size="24" @click="handleMultiCheck(id)"><Remove /></el-icon>
            </div>
            <!-- 机器人消息 -->
            <div v-if="(msg?.message && msg?.message?.length > 0) || msg.messages?.length > 0" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']" style="width: 100%; ">
              <NormalMessage
                v-if="msg.message.some((s:MessageElem)=> s.type == 'text' || msg.message.length > 1)"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="member"
                role_title="LV1"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
              >
                <div v-for="(seg,segId) in msg.message">
                  <QuoteMessage
                    v-if="seg.type == 'reply'"
                    :name="quoteMsgs[seg.data.id]?.sender.card??quoteMsgs[seg.data.id].sender.nickname" 
                    :time="getFormatDate(new Date(quoteMsgs[seg.data.id].time * 1000),2)"
                  >
                    <div v-for="(quote, quoteId) in quoteMsgs[seg.data.id].message" :key="quoteId">
                      
                      <div v-if="quote.type == 'text'">{{ quote.data.text }}</div>
                      <el-image
                        v-else-if="quote.type == 'image'"
                        :src="(quote.data.file as string).replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                        :preview-src-list="[(quote.data.file as string).replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                        :initial-index="0"
                        style="width: 150px;"
                      />
                      <div v-else>{{ makeScheme(quote) }}</div>
                    </div>
                  </QuoteMessage>
                  <span v-if="seg.type == 'at'" style="color: blue;">
                    @{{ seg.data.qq }}
                  </span>
                  <span v-if="seg.type == 'text'">{{ seg.data.text }}</span>
                  <el-image
                    v-if="seg.type == 'image' && msg.message?.length > 1"
                    :src="seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                    :preview-src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                    :initial-index="0"
                    style="width: 200px;"
                  />
                  <img 
                    v-if="seg.type == 'face' && msg.message?.length > 1"
                    :src="`/qfaces/s${seg.data.id}.gif`"
                    style="width: 24px;"
                  />
                </div>
              </NormalMessage>
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'image')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="member"
                role_title="LV1"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'face')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="member"
                role_title="LV1"
                :src="`/qfaces/s${msg.message[0].data.id}.gif`"
                max-width="80px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <VoiceMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'record')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="member"
                role_title="LV1"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
                :duration="15"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <VideoMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'video')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="member"
                role_title="LV1"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:video/mp4;base64,')"
                max-width="300px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              <ForwardMessage
                v-if="msg.messages && msg.messages?.length > 0 && msg.messages?.some((s:MessageElem) => s.type == 'node')"
                class="chatroom-forward"
                :name="msg.sender?.card??msg.sender?.nickname"
                :avatar="msg.sender?.avatar"
                title="转发"
                :contents="makeForwardPreview(msg.messages)"
                counts="10"
                :onright="msg.isSelf"
                @click="(devStore.qqScene = 2,curForwardMessages = msg)"
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
            </div>
            <!-- 合并转发 -->
            <div v-if="msg.isDeleted || msg.toast_time" style="width: 100%;" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']">
              <ToastMessage v-if="msg.isDeleted">{{ userStore.username }} 撤回了一条消息</ToastMessage>
              <ToastMessage v-if="msg.toast_time">{{ msg.toast_time }}</ToastMessage>
            </div>
            <!-- 自己的消息 -->
            <!-- <div v-if="msg.isSelf == true && msg.message && msg.message?.length > 0" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']" style="width: 100%;">
              <NormalMessage
                v-if="msg.message.some((s:MessageElem)=> s.type == 'text' || msg.message.length > 1)"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname"
                role="owner"
                role_title="LV1"
                onright
                @msg-operation="handleMsgOperation($event,msg,id)"
              >
                <div v-for="(seg,segId) in msg.message">
                  <span v-if="seg.type == 'text'">{{ seg.data.text }}</span>
                  <el-image 
                    v-if="seg.type == 'image' && msg.message.length > 1"
                    :src="seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                    :preview-src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                    :initial-index="0"
                    style="width: 200px;"
                  />
                  <img 
                    v-if="seg.type == 'face' && msg.message.length > 1"
                    :src="`/qfaces/s${seg.data.id}.gif`"
                    style="width: 24px;"
                  />
                </div>
              </NormalMessage>
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'image')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
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
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card??msg.sender?.nickname" 
                role="owner"
                role_title="LV1"
                :src="`/qfaces/s${msg.message[0]?.data?.id}.gif`"
                max-width="80px"
                onright
                @msg-operation="handleMsgOperation($event,msg,id)"
              />
              
            </div> -->
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
          <div v-for="(node, nodeId) in curForwardMessages.messages" :key="nodeId" style="display: flex;">
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
                    :preview-src-list="[seg.data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
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
                :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${node.data.uin}`"
                :name="node.data?.name" 
                role="member"
                role_title="LV1"
                :src="node.data.content[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[node.data.content[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
              />
              <ImageMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'face')"
                :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${node.data.uin}`"
                :name="node.data?.name" 
                role="member"
                role_title="LV1"
                :src="`/qfaces/s${node.data.content[0].data.id}.gif`"
                max-width="80px"
              />
              <VoiceMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'record')"
                :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${node.data.uin}`"
                :name="node.data?.name" 
                role="member"
                role_title="LV1"
                :src="node.data.content[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
                :duration="15"
              />
              <VideoMessage
                v-if="node.data.content.length == 1 && node.data.content.some((s:MessageElem) => s.type == 'video')"
                :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${node.data.uin}`"
                :name="node.data?.name" 
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
import type { UploadProps } from 'element-plus'

import faceData from '@/assets/qfaces/data.json'
import { getFormatDate } from '@/utils/time'
// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import type { MessageElem,NodeElem } from './protocol/onebotv11/message/message.elem'
import type { queueItemType } from './protocol/onebotv11/event/type'
import type { groupInfoType,groupMemberInfoType } from './protocol/onebotv11/api/type'

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

/** 个人头像 */
const selfAvatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${devStore.onebot11.cur_master_id}`

/** 底部工具栏是否可见 */
const footerview_visible = ref(false)

/** 当前正在弹出的底部工具栏类型 */
const curFooterBtn = ref<'face' | 'file' | 'audio' | 'none'>('none')

/** 文件上传框实例 */
const uploadRef = ref()

/** 文件上传的list */
let fileList = ref<
  {
    name: ''
    url: ''
  }[]
>([])

/** 文件上传额外信息 */
const extraUploadData = reactive({
  curType: 'image',
})

/**
 * 获取文件上传地址
 * @returns
 */
 const handleFilePreview = (file: any) => {
  console.log(file)
  // uploadFileUrl.value = file.url

}

/**
 * 文件过滤器
 * @returns
 */
 const handleUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // if (extraUploadData.curType == 'image' && !rawFile.type.includes('image/')) {
  //   ElMessage.error('确保上传的是图片!')
  //   return false
  // } else if (
  //   extraUploadData.curType == 'record' &&
  //   !rawFile.type.includes('audio/')
  // ) {
  //   ElMessage.error('确保上传的音频!')
  //   return false
  // } else if (
  //   extraUploadData.curType == 'video' &&
  //   !rawFile.type.includes('video/')
  // ) {
  //   ElMessage.error('确保上传的是视频!')
  //   return false
  // } else if (rawFile.size / 1024 / 1024 > 100) {
  //   ElMessage.error('File size can not exceed 100MB!')
  //   return false
  // }
  return true
}

/**
 * 上传成功
 * @returns
 */
 const handleUploadSuccess: UploadProps['onSuccess'] = (
  res: any,
  uploadFile: any,
) => {
  console.log(res)
  console.log(uploadFile.raw.type)
  let type
  switch(uploadFile.raw.type.split('/')[0]) {
    case 'image':
      type = 'image'
      break;
    case 'record':
      type = 'record'
      break;
    case 'audio':
      type = 'record'
      break;
    case 'video':
      type = 'video'
      break;
    default: 
      type = ''
  }
  type && sendWs({
    type: type,
    data: {
      url: uploadFile.response.data,
      file: uploadFile.response.data
    }
  } as MessageElem)
  // 清空文件上传列表
  fileList.value = []
  footerview_visible.value = false
}

/**
 * 确认上传
 * @returns
 */
 const confirmUpload = () => {
  uploadRef.value!.submit()
}

/**
 * 折叠面板折叠事件
 */
const handleChange = (val: string[]) => {
  console.log(val)
}

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
const sendWs = (seg:MessageElem) => {
    const message:MessageElem[] = []
    // switch(seg.type) {
    //   case 'text':
    //     message.push({type: "text",data: {text: seg.data.text}})
    //     break
    //   case 'face':
    //     message.push({type: "face",data: {id: seg.data.id}})
    //     break;
    //   case 'at':
    //     message.push({type: "at",data: {qq: seg.data.qq}})
    //     break;
    //   case 'image':
    //     message.push({type: "image",data: {url: seg.data.url,file: seg.data.file}})
    //     break
    //   default: 
    //     ElMessage.error('无法发送此消息')
    //     return
    // }

    if(!/text|face|image|record|video|at|reply/.test(seg.type)) {
      ElMessage.error('无法发送此消息')
      return
    }

    message.push(seg)

    let myMsg = Events.group_message({
        message_id: Math.round(Date.now() / 1000),
        group_id: (curGroup.value as groupInfoType)?.group_id,
        user_id: devStore.onebot11.cur_master_id,
        nickname: (curGroupSelfInfo.value as groupMemberInfoType)?.nickname,
        message: message,
        raw_message: Events.makeCQ(message),
        role: (curGroupSelfInfo.value as groupMemberInfoType)?.role,
        card: (curGroupSelfInfo.value as groupMemberInfoType)?.card
    })

    if(devStore.onebot11.msgQueue.length > 0) {
      const timeDif = Date.now() - devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1].time * 1000
      if(timeDif > 10000) devStore.onebot11.msgQueue.push({...myMsg, message: [],isSelf: true, toast_time: getFormatDate(new Date(),3)})
    }

    devStore.onebot11.msgQueue.push(Object.assign(myMsg,{isSelf: true}))

    console.log('发送消息；')
    console.log(myMsg)
    Ws.value.bot?.send(JSON.stringify(myMsg))

    /** 关闭工具栏 */
    if(footerview_visible.value) {
      footerview_visible.value = false
      curFooterBtn.value = 'none'
    }
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
      desc = makeScheme(seg)
    }
    res.push(`${sender}:${desc}`)
  });
  return res
}

/**
 * 制作消息段scheme
 * @param seg 
 */
const makeScheme = (seg:MessageElem) => {
  switch(seg.type) {
    case 'text':
      return seg.data.text.length>20?(seg.data.text.slice(0,30) + '...'):seg.data.text
    case 'image':
      return '[图片]'
    case 'face':
      return '[表情]'
    case 'record':
      return '[语音]'
    case 'video':
      return '[视频]'
    case 'dice':
      return '[骰子]'
    case 'rps': 
      return '[猜拳]'
    case 'markdown':
      return '[markdown]'
    case 'button':
      return '[按钮]'
    case 'keyboard':
      return '[按钮]'
    default:
      return '[暂不支持该消息类型]'
  }
}

/** 查找引用消息 */
const quotePreview = (id:string) => {
  const quoteMsg = devStore.onebot11.msgQueue.find((msg)=>msg.message_id == id)
  console.log(quoteMsg.message)
  return quoteMsg || {}
}

/**
 * 处理底部输入栏按钮点击事件
 */
const handleClickFooterBtn = (type:string) => {
  console.log(type)
}


/** 处理消息气泡操作 */
const handleMsgOperation = async(e:{type:string},msg:any,id:number) => {
  // console.log(e)
  switch(e.type) {
    case 'delete':
      devStore.onebot11.msgQueue.splice(id,1)
      break;
    case 'withdraw':
      msg.isDeleted = true
      if(msg.message) msg.message = []
      break;
    case 'copy':
      navigator.clipboard && await navigator?.clipboard?.writeText(msg.raw_message);  
      ElMessage.success('复制成功！')
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
  // 至少选一个才切换多选操作栏
  if(Object.keys(multicheckIndex.value).length > 0) {
    footer_type.value = 'MultiCheck'
  } else {
    footer_type.value = 'Input'
  }
}

/**
 * 封装一下关闭多选操作栏
 * @returns
 */
const closeMultiMsgs = () => {
  multicheckIndex.value = {}
  footer_type.value = 'Input'
  isMultiCheckMode.value = false
}

/** 多选后的消息操作逻辑 */
const handleMultiMsgs = (type:string) => {
  console.log(multicheckIndex.value)
  switch(type) {
    case 'forward':
      
      break;
    case 'multiforward':

      break;
    case 'delete':
      // 确保从高索引删除到低索引
      const indexs = Object.keys(multicheckIndex.value).map(Number).sort((a,b) => b - a)
      for(let i of indexs) {
        devStore.onebot11.msgQueue.splice(i,1)
      }
      closeMultiMsgs()
      break;
    case 'close':
      closeMultiMsgs()
      break;
  }

}

/** 打开设置抽屉的事件处理 */
const handleDrawerSetting = (isOpen:boolean) => {
  if(isOpen) {
    footer_type.value = 'none'
  } else {
    footer_type.value = 'Input'
  }
}

/** 获取当前群聊数据 */
const curGroup = computed(()=>{
    return devStore.onebot11.group_list.find((group:groupInfoType) => group.group_id == devStore.onebot11.cur_group_id) || {}
})

/** 获取当前操作者所在群聊的资料 */
const curGroupSelfInfo = computed(()=>{
    return ((curGroup.value as groupInfoType)?.member_list as groupMemberInfoType[])?.find((member:groupMemberInfoType) => member.user_id == devStore.onebot11.cur_master_id) || {}
})

/** 获取引用消息对象 */
const quoteMsgs = computed(()=>{
  let quoteObj:{[key:string]:queueItemType} = {}
  devStore.onebot11.msgQueue.forEach((msg)=>{
    if(msg.message && msg.message?.length > 0) {
      msg.message.forEach((seg:MessageElem)=>{
        if(seg.type == 'reply') {
          quoteObj[seg.data.id] = devStore.onebot11.msgQueue.find((msg)=> msg.message_id == seg.data.id)
        }
      })
    }
  })
  return quoteObj
})
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

.fakeqq-footer__members__list {
  .fakeqq-footer__members__list__item {
      height: 30px;
      display: flex;
      align-items: center;
      padding: 3px;
      border-radius: 3px;
      .members-item-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
      }
      .members-item-nickname {
        margin-left: 5px;
      }
  }
  .fakeqq-footer__members__list__item:hover {
    background-color: #F5F5F5;
    cursor: pointer;
  }
}

.el-upload-dragger {
  padding: 10px !important;
}

.el-upload-dragger .el-icon--upload {
    margin-bottom: 0;
}

// qq表情
.face-box {
  width: 100%;
  height: 240px;
  padding: 5px 5px;
  overflow-y: scroll;
  cursor: pointer;

  .face-image {
    width: 25px;
    height: 25px;
  }
}

</style>
