<template>
  <Msglist class="message-list" 
      :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${devStore[devStore.curAdapter].cur_self_info.user_id??userStore.masterQQ}`"
      :title="userStore.username"
      :messages-length="msgsSumCount"
      state="在线"
      @click-tabbar="clickTabbar"
      @search-text="handleSearchContacts"
      @search-focused="isSearchBarFocused = $event"
  >
    <template #messages>
      <!-- 消息列表 -->
      <div v-if="curTabbarBtn == 'messages'">
        <!-- 群消息列表 -->
        <div v-show="(isSearchBarFocused && row.searched) || !isSearchBarFocused"
          class="message-room-list" 
          :class="[(devStore[devStore.curAdapter].cur_message_type == 'group' && devStore[devStore.curAdapter].cur_group_id == row.group_id)?'message-room-list-selected':'']"
          v-for="(row,index) in devStore[devStore.curAdapter].group_list" 
          :key="index" 
          @click="handleClickMsgsList(row)"
        >
          <img class="message-room-avatar" :src="`https://p.qlogo.cn/gh/${row.group_id}/${row.group_id}/640`"/>
          <div class="message-room-info">
            <div class="message-room-info-top">
              <span class="message-room-info-top-content">{{ row.group_name }}</span>
              <span style="font-size: 12px;">
                {{ getFormatDate(new Date(row.msg_queue[row.msg_queue.length - 1]?.time * 1000),3) }}
              </span>
            </div>
            <div class="message-room-info-bottom">
              <div class="message-room-info-bottom-content">
                {{ row.msg_queue[row.msg_queue.length - 1]?.sender?.card }}
                <span v-if="row.msg_queue.length > 0"></span>
                {{ row.msg_queue[row.msg_queue.length - 1]?.raw_message }}
              </div>
              <el-badge  
                class="item"
                v-if="row.msg_queue.length > 0"
                :value="row.msg_queue.length" 
                :max="99" >
              </el-badge>
            </div>
          </div>
        </div>

        <!-- 私聊消息列表 -->
        <div v-show="(isSearchBarFocused && row.searched) || !isSearchBarFocused"
          v-for="(row,index) in devStore[devStore.curAdapter].friend_list" 
          :key="index"
          class="message-room-list" 
          :class="[(devStore[devStore.curAdapter].cur_message_type == 'private' && devStore[devStore.curAdapter].cur_private_id == row.user_id)?'message-room-list-selected':'']"
          @click="handleClickMsgsList(row)"
        >
          <img class="message-room-avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${row.user_id}`"/>
          <div class="message-room-info">
            <div class="message-room-info-top">
              <span class="message-room-info-top-content">{{ row.nickname }}</span>
              <span style="font-size: 12px;">
                {{ getFormatDate(new Date(row.msg_queue[row.msg_queue.length - 1]?.time * 1000),3) }}
              </span>
            </div>
            <div class="message-room-info-bottom">
              <div class="message-room-info-bottom-content">
                {{ row.msg_queue[row.msg_queue.length - 1]?.sender?.nickname }}
                <span v-if="row.msg_queue.length > 0"></span>
                {{ row.msg_queue[row.msg_queue.length - 1]?.raw_message }}
              </div>
              <el-badge  
                class="item"
                v-if="row.msg_queue.length > 0"
                :value="row.msg_queue.length" 
                :max="99" >
              </el-badge>
            </div>
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
                    <!-- <span style="font-size: 12px;">{{ row.botRunTime }}</span> -->
                  </div>
                  <div class="message-room-info-bottom">
                    <span style="font-size: 12px;">{{ row.platform }}</span>
                    <!-- <el-badge :value="100" :max="99" class="item"></el-badge> -->
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="我的好友" name="2">
              <div class="message-room-list" v-for="(row,index) in devStore[devStore.curAdapter].friend_list" :key="index" @click="devStore.qqScene = 1">
                <img class="message-room-avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${row.user_id}`"/>
                <div class="message-room-info">
                  <div class="message-room-info-top">
                    <span style="font-size: 14px;">{{ row.nickname }}</span>
                  </div>
                  <div class="message-room-info-bottom">
                    <span style="font-size: 12px; color: #7F7F7F">[手机在线]</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <!-- 群聊 -->
          <el-collapse v-if="curActiveTab == 1" v-model="activeNames" @change="handleChange">
            <el-collapse-item title="置顶群聊" name="1">
              
            </el-collapse-item>
            <el-collapse-item title="我创建的群聊" name="2">
              <div
                class="message-room-list" 
                v-for="(row,index) in devStore[devStore.curAdapter].group_list.filter((group)=>group.member_list.some(member=>((member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id) && member.role == 'owner')))" 
                :key="index" 
                @click="handleClickMsgsList(row)"
              >
                <img class="message-room-avatar" :src="`https://p.qlogo.cn/gh/${row.group_id}/${row.group_id}/640`"/>
                <div class="message-room-info">
                  <div class="message-room-info-top">
                    <span class="message-room-info-top-content">{{ row.group_name }}</span>
                    <span style="font-size: 12px;">
                      {{ getFormatDate(new Date(row.msg_queue[row.msg_queue.length - 1]?.time * 1000),3) }}
                    </span>
                  </div>
                  <div class="message-room-info-bottom">
                    <div class="message-room-info-bottom-content">
                      {{ row.msg_queue[row.msg_queue.length - 1]?.sender?.card }}
                      <span v-if="row.msg_queue.length > 0"></span>
                      {{ row.msg_queue[row.msg_queue.length - 1]?.raw_message }}
                    </div>
                    <el-badge  
                      class="item"
                      v-if="row.msg_queue.length > 0"
                      :value="row.msg_queue.length" 
                      :max="99" >
                    </el-badge>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!-- 设置 -->
      <div v-if="curTabbarBtn == 'settings'" class="contacts-list" style="height: 100%; background-color: #F2F2F2; border: 0.1px solid #F2F2F2;">
        <QQcard>
          <div class="card-list-item-flex">
            <span style="font-size: 13px;">缓存本地消息</span>
            <span class="card-desc">
              <el-switch v-model="qqSettings.isMsgsSaved" class="ml-2" size="small"/>
            </span>
            <!-- <el-icon><ArrowRight /></el-icon> -->
          </div>
          <div class="card-list-divider"></div>
          <div class="card-list-item-flex">
            <span style="font-size: 13px;">连接地址</span>
            <span class="card-desc">
              <el-input v-model="qqSettings.ip" size="small"/>
            </span>
            <!-- <el-icon><ArrowRight /></el-icon> -->
          </div>
        </QQcard>
      </div>

    </template>

    <template #main>
      <div class="msglist-main-logo" v-if="devStore.qqScene == 0">
        Sandbox
      </div>
      <!-- <Chatroom class="chatroom" /> -->
      <QQWindow class="chatroom" v-if="devStore.qqScene == 1" 
        ref="chatWindowRef"
        :title="(devStore[devStore.curAdapter].cur_message_type == 'group')?((curGroup as groupInfoType)?.group_name):(curPrivate.nickname)" 
        :count="(devStore[devStore.curAdapter].cur_message_type == 'group')?(curGroup as groupInfoType)?.member_list?.length:''" 
        :msgs_length="curMsgQueue.length"
        :header_visible="chatHeaderVisible"
        :footer_type="footer_type"
        :footerview_visible = "footerview_visible"
        :input_disabled="input_disabled"
        @connect-ws="Ws.connect(devStore[devStore.curAdapter].cur_bot_id)"
        @send-input="sendMessage($event)"
        @go-setting="handleDrawerSetting"
        @multi-check="handleMultiMsgs"
        @footer-btn="(curFooterBtn = $event,console.log($event),($event == 'none'?footerview_visible = false:footerview_visible = true))"
      >
        
        <template #chat>
          <!-- <ToastMessage>2022/5/17 星期二 上午 10:58:39</ToastMessage>
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

          <div v-for="(msg,id) in curMsgQueue as any" :key="id" style="display: flex; width: 100%;">
            <div v-if="isMultiCheckMode == true && !msg.toast" class="chatroom-multicheck-box">
              <el-icon class="chatroom-multicheck-icon-checked" v-if="multicheckIndex[id]" color="#0099FF" size="24" @click="handleMultiCheck(id)"><CircleCheckFilled /></el-icon>
              <el-icon class="chatroom-multicheck-icon-unchecked" v-if="!multicheckIndex[id]" color="#C7C7C7" size="24" @click="handleMultiCheck(id)"><Remove /></el-icon>
            </div>
            <!-- 机器人消息 -->
            <div v-if="((msg?.message && msg?.message?.length > 0) || msg.messages?.length > 0) && !msg.toast" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']" style="width: 100%; ">
              <NormalMessage
                v-if="msg.message.some((s:MessageElem)=> s.type == 'text' || msg.message.length > 1)"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname" 
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
                @avatar-click="handleAvatarClick(msg)"
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
                    @{{ msg.group_id?curGroup.member_list.find(member=>member.user_id == seg.data.qq)?.card:curPrivate.nickname }}
                  </span>
                  <pre v-if="seg.type == 'text'" 
                    style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;"
                  >{{ seg.data.text }}</pre>
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
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname" 
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')"
                :src-list="[msg.message[0].data.file.replace(/^base64:\/\//,'data:image/jpeg;base64,')]"
                :initial-index="0"
                max-width="300px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
              />
              <ImageMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'face')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname" 
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :src="`/qfaces/s${msg.message[0].data.id}.gif`"
                max-width="80px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
              />
              <VoiceMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'record')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname" 
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:audio/mp3;base64,')"
                :duration="15"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
              />
              <VideoMessage
                v-if="msg.message.length == 1 && msg.message.some((s:MessageElem) => s.type == 'video')"
                :avatar="msg.sender?.avatar"
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname" 
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :src="msg.message[0].data.file.replace(/^base64:\/\//,'data:video/mp4;base64,')"
                max-width="300px"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
              />
              <ForwardMessage
                v-if="msg.messages && msg.messages?.length > 0 && msg.messages?.some((s:MessageElem) => s.type == 'node')"
                class="chatroom-forward"
                :name="msg.sender?.card?(msg.sender?.card):msg.sender?.nickname"
                :avatar="msg.sender?.avatar"
                :role="(msg.sender?.role)?(msg.sender?.role):''"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                title="转发"
                :contents="makeForwardPreview(msg.messages)"
                :counts="makeForwardPreview(msg.messages).length"
                :onright="msg.isSelf"
                @click="(devStore.qqScene = 2,curForwardMessages = msg)"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
              />
            </div>
            <!-- toast消息 -->
            <div v-if="msg.toast" style="width: 100%;" :class="[multicheckIndex[id] ? 'chatroom-msg-checked' : '']">
              <ToastMessage v-if="msg.toast.isDeleted">{{ msg.sender?.card?(msg.sender?.card):msg.sender?.nickname }} 撤回了一条消息</ToastMessage>
              <ToastMessage v-if="msg.toast.notice_time">{{ msg.toast.notice_time }}</ToastMessage>
              <ToastMessage v-if="msg.toast.poke">{{ msg.toast.poke }}</ToastMessage>
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
          <!-- 抽屉顶部header -->
          <div class="fakeqq-header" style="background-color: #FFFFFF;">
            <el-icon class="fakeqq-header__bth" size="24" @click="handleDrawerBack"><ArrowLeft /></el-icon>
              <span class="fakeqq-header__title">
                  {{ curDrawerData.title }}
              </span>
              <!-- <svg-icon name="menu" width="24px" height="24px" class="fakeqq-header__bth" color="#000000" /> -->
               <!-- 场景0-群聊设置 -->
              <el-icon class="fakeqq-header__bth" size="24" v-if="curDrawerData.scene == 0 || curDrawerData.scene == 2">
                <Share />
              </el-icon>
              <!-- 场景1-资料列表item设置 -->
              <span class="fakeqq-header__bth" 
                v-if="curDrawerData.scene == 1" 
                @click="handleSaveSettingItem"
                style="cursor: pointer;"
              >
                完成
              </span>
          </div>
          <!-- 点击右上角菜单进入设置卡 -->
          <GroupSetting v-if="curDrawerData.scene == 0" 
            :chat_type="devStore[devStore.curAdapter].cur_message_type"
            :role="(curGroup.member_list.find((member)=>member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id))?.role || ''"
            @set-name="handleSettingItem"
          />
          <div v-if="curDrawerData.scene == 1">
            <QQcard>
              <el-input v-model="curSettingInputValue" />
            </QQcard>
          </div>
          <div v-if="curDrawerData.scene == 2">
            <!-- 机器人资料 -->
            <div v-if="curDrawerData.body.member_type == 'bot'">
              <div class="drawer-body__member__card">
                <div class="drawer-body__member__card__bot">
                  <img class="drawer-body__member__card__bot__avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${curDrawerData.body.member_data.user_id}`"/>
                  <div class="drawer-body__member__card__bot__name">
                    {{ curDrawerData.body.member_data.card }}
                    <span class="drawer-body__member__card__bot__logo">
                      <svg-icon name="robot" width="12px" height="12px" color="white"/> 机器人
                    </span>
                  </div>
                  <div class="drawer-body__member__card__bot__desc">
                    支持群主设置入群欢迎消息、定时消息等
                  </div>
                </div>
              </div>
              <div class="card-title">我的服务</div>
              <QQcard>
                <div class="card-list-item" @click="handleSettingItem({type: 'bot_welcome', data: curDrawerData.body.bot_welcome})">
                  <div class="card-list-item-title">
                    <span>入群欢迎</span>
                    <span class="card-desc">{{ curDrawerData.body.bot_welcome?'已设置':'未设置' }}</span>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                  <div class="card-list-item-bottom-desc">
                    群主或管理员设置入群欢迎语后，当有新成员入群时，会自动@该成员，并发送欢迎语哦。
                  </div>
                </div>
              </QQcard>
            </div>
            <!-- 好友资料 -->
            <div v-if="curDrawerData.body.member_type == 'friend'">
              <div class="drawer-body__member__card">
                <div class="drawer-body__member__card__private">
                  <img class="drawer-body__member__card__private__avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${curDrawerData.body.friend_data.user_id}`"/>
                  <div class="drawer-body__member__card__private__info">
                    <div class="drawer-body__member__card__private__name">
                      {{ curDrawerData.body.friend_data.nickname }}
                      <div class="drawer-body__member__card__private__id">QQ号：{{ curDrawerData.body.friend_data.user_id }}</div>
                    </div>
                  </div>
                  <div class="drawer-body__member__card__private__thumbup">
                    <svg-icon name="thumbup" width="24px" height="24px" 
                      style="cursor: pointer;"
                      @click="handleThumbup"
                    />
                    <span class="drawer-body__member__card__private__thumbup__count">
                      {{ curDrawerData.body.friend_data.thumbs }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 群资料 -->
            <div v-if="curDrawerData.body.member_type == 'group'" style="background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); padding-top: 100px;">
              <div class="drawer-body__member__card" style="border-radius: 16px 16px 0 0;">
                <div class="drawer-body__member__card__private">
                  <img class="drawer-body__member__card__private__avatar" :src="`https://p.qlogo.cn/gh/${curGroup.group_id}/${curGroup.group_id}/640`"/>
                  <div class="drawer-body__member__card__private__info">
                    <div class="drawer-body__member__card__private__name">
                      {{ curGroup.group_name }}
                      <div class="drawer-body__member__card__private__id" style="margin-top: 10px;">{{ curGroupCardData.sumCount }}人 · 群号：{{ curGroup.group_id }}</div>
                    </div>
                  </div>
                  <div class="drawer-body__member__card__private__thumbup">
                    <svg-icon name="qrcode" width="24px" height="24px" 
                      style="cursor: pointer;"
                      @click=""
                    />
                  </div>
                </div>
                <div class="drawer-body__member__card__group" style="display: block;">
                  <div style="font-size: 12px; color: #7F7F7F; display: flex; align-items: center;">
                    <svg-icon name="clock" width="12px" height="12px" style="margin-right: 3px;"></svg-icon>
                    建群时间: {{ curGroupCardData.createdTime }}
                  </div>
                  <div class="drawer-body__member__car__group__statistics" style="margin-top: 30px;">
                    <GroupStatistics
                      :title="`活跃 ${curGroupCardData.activeCount} 人`"
                      icon="Sunrise"
                      :percentage="Math.round(curGroupCardData.activeCount / curGroupCardData.sumCount * 100)"
                      color="#EF6244"
                    />
                    <GroupStatistics
                      :title="`女 ${curGroupCardData.femaleCount} 人`"
                      icon="Female"
                      :percentage="Math.round(curGroupCardData.femaleCount / curGroupCardData.sumCount * 100)"
                      color="#E05D9E"
                    />
                    <GroupStatistics
                      :title="`00后 ${curGroupCardData.youngCount} 人`"
                      icon="User"
                      :percentage="Math.round(curGroupCardData.youngCount / curGroupCardData.sumCount * 100)"
                      color="#14D87C"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- 群成员资料 -->
            <div v-if="curDrawerData.body.member_type == 'member'">
              <div class="drawer-body__member__card">
                <div class="drawer-body__member__card__private">
                  <img class="drawer-body__member__card__private__avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${curDrawerData.body.member_data.user_id}`"/>
                  <div class="drawer-body__member__card__private__info">
                    <div class="drawer-body__member__card__private__name">
                      {{ curDrawerData.body.member_data.nickname }}
                      <div class="drawer-body__member__card__private__id">群昵称：{{ curDrawerData.body.member_data.card }}</div>
                      <div class="drawer-body__member__card__private__id">QQ号：{{ curDrawerData.body.member_data.user_id }}</div>
                    </div>
                  </div>
                  <div class="drawer-body__member__card__private__thumbup">
                    <svg-icon name="thumbup" width="24px" height="24px" 
                      style="cursor: pointer;"
                      @click="handleThumbup"
                    />
                    <span class="drawer-body__member__card__private__thumbup__count">
                      {{ curDrawerData.body.member_data.thumbs }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-title">个人资料</div>
              <QQcard>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'private_sex', data: curDrawerData.body.member_data.sex})">
                  <span>性别</span>
                  <span class="card-desc">male | female | unknow</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'private_age', data: curDrawerData.body.member_data.age})">
                  <span>年龄</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.age }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'private_area', data: curDrawerData.body.member_data.area})">
                  <span>所在地</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.area }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'group_level', data: curDrawerData.body.member_data.level})">
                  <span>群聊等级</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.level }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'group_title', data: curDrawerData.body.member_data.title})">
                  <span>群专属头衔</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.title }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'group_role', data: curDrawerData.body.member_data.role})">
                  <span>群聊角色</span>
                  <span class="card-desc">owner | admin | member | bot</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'group_join_time', data: curDrawerData.body.member_data.join_time})">
                  <span>加群时间</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.join_time }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="card-list-divider"></div>
                <div class="card-list-item-flex" @click="handleSettingItem({type: 'group_last_sent_time', data: curDrawerData.body.member_data.last_sent_time})">
                  <span>最近发言时间</span>
                  <span class="card-desc">{{ curDrawerData.body.member_data.last_sent_time }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </QQcard>
            </div>
          </div>
        </template>
        <!-- at触发时弹出列表 -->
        <template #atlist v-if="devStore[devStore.curAdapter].cur_message_type == 'group'">
          <div class="fakeqq-footer__members__list">
            <div class="fakeqq-footer__members__list__item" 
              v-for="(member, memberId) in (curGroup as groupInfoType)?.member_list" 
              :key="memberId"
              @click="chatWindowRef.inputValue = chatWindowRef.inputValue.replace('@','') + `[CQ:at,qq=${member.user_id}]`"
            >
              <img class="members-item-avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${member.user_id}`">
              <div class="members-item-nickname">
                  {{ member.card??member.nickname }}
              </div>
            </div>
          </div>
        </template>
        <!-- 输入框底部弹出工具栏 -->
        <template #tools>
          <!-- 录音 -->
          <div v-if="curFooterBtn == 'audio'">
            <RecorderButton @audio-url="handleAudioRecorded" />
          </div>
          <!-- qq表情 -->
          <div v-if="curFooterBtn == 'face'">
            <div class="face-box">
              <el-image class="face-image" v-for="face in faceData" :key="face.QSid"
                :src="`/qfaces-static/s${face.QSid}.png`"
                @click="sendMessage({type: 'face', data: {id: face.QSid}})" />
            </div>
          </div>
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
        </template>
      </QQWindow>
      <!-- 合并转发 -->
      <QQWindow class="chatroom" v-if="devStore.qqScene == 2" 
        :title="curForwardMessages.sender?.nickname" 
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
                  <pre v-if="seg.type == 'text'" 
                    style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;"
                  >{{ seg.data.text }}</pre>
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
import QQWindow from './components/chatbox.vue'
import ToastMessage from './components/messages/toast.vue'
import NormalMessage from './components/messages/normal.vue'
import ImageMessage from './components/messages/image.vue'
import QuoteMessage from './components/messages/quote.vue'
import ForwardMessage from './components/messages/forward.vue'
import VoiceMessage from './components/messages/voice.vue'
import VideoMessage from './components/messages/video.vue'
import FileMessage from './components/messages/file.vue'

// QQ-messagesList
import Msglist from './components/msglist.vue';
import GroupSetting from './components/chatdrawer/groupSetting.vue';
import GroupStatistics from './components/chatdrawer/groupStatistics.vue';

// 小组件
import RecorderButton from './components/recorder.vue';
import SildeTab from './components/tab.vue'
import QQcard from './components/qqcard.vue'

import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

import faceData from '@/assets/qfaces/data.json'
import { getFormatDate,calculateYearsDif } from '@/utils/time'

// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, reactive, onMounted, computed, watch } from 'vue'

import type { MessageElem,NodeElem } from './protocol/onebotv11/message/message.elem'
import type { groupMsgQueueItemType,msgQueueItemType,privateMsgQueueItemType, queueItemType } from './protocol/onebotv11/event/type'
import type { groupInfoType,groupMemberInfoType,friendInfoType } from './protocol/onebotv11/api/type'
import type { drawerDataType } from './types/drawer'

import msgQueueController from './protocol/onebotv11/queue/msgQueue'
import Events from './protocol/onebotv11/event/event'
import Onebot from './protocol/ws'
import { nextTick } from 'vue'

const Ws = ref(new Onebot())

const userStore = useUserStore()

const devStore = useDevStore()

/** 获取聊天框实例 */
const chatWindowRef = ref()

/** bot信息列表 */
const botInfoList = ref<BotInfoListType>([])

/** 联系人分段栏 */
const curContactsTab = ref('')

/** 当前导航按钮 */
const curTabbarBtn = ref('messages')

/** 当前消息列表 */
const curMessageRoom = ref('')

/** 当前分段栏 */
const curActiveTab = ref(0)

/** 搜索栏是否聚焦 */
const isSearchBarFocused = ref(false)

/** 搜索到的 */
const searchedList = ref([])


/** 当前抽屉内容 */
const curDrawerData = reactive<drawerDataType>({
  /** 记录上一次场景用于回退 */
  last_scene: 0,
  /** 当前抽屉展示场景，0-默认群聊设置或个人资料, 1- */
  scene: 0,
  /** 当前抽屉header标题 */
  title: '群聊设置',
  /** 类型，用于子组件事件 */
  type: '',
  /** 抽屉主体内容 */
  body: {
    member_type: 'bot',
    member_data: {
      group_id: 397798018,
      user_id: 2854196310,
      nickname: 'Q群管家',
      card: 'Q群管家',
      sex: 'unknown',
      age: 18,
      area: '',
      join_time: 123456789,
      last_sent_time: 123456789,
      level: 'lv1',
      role: 'bot',
      unfriendly: false,
      title: '机器人',
      title_expire_time: 987654321,
      card_changeable: true,
      thumbs: 0
    },
    friend_data: {
      nickname: '小冰',
      remark: '',
      user_id: 2854196306,
      msg_queue: [],
      thumbs: 0
    },
    bot_welcome: '欢迎新人~'
  }
})

/** 当前正在设置的值 */
const curSettingInputValue = ref<string | number>('')

/** 联系人折叠面板 */
const activeNames = ref(['1'])

/** 合并转发窗口 */
const curForwardMessages = ref<any>([])

/** 多选索引 */
const multicheckIndex = ref<any>({})

/** 是否为多选模式 */
const isMultiCheckMode = ref(false)

/** 聊天室的header是否可见 */
const chatHeaderVisible = ref(true)

/** 聊天室drawer的header是否可见 */
const chatDrawerHeaderVisible = ref(false)

/** 聊天室底层控件类型 */
const footer_type = ref<'Input' | 'MultiCheck' | 'none'>('Input')

/** 个人头像 */
const selfAvatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${devStore[devStore.curAdapter].cur_self_info.user_id}`

/** 角色映射表 */
const roleMap:{
  owner: '群主',
  admin: '管理员',
  member: '',
  [key:string]:any
} = {
  owner: '群主',
  admin: '管理员',
  member: ''
}

/** 底部工具栏是否可见 */
const footerview_visible = ref(false)

/** 当前正在弹出的底部工具栏类型 */
const curFooterBtn = ref<'face' | 'file' | 'audio' | 'none'>('none')

/** 沙盒设置 */
const qqSettings = reactive({
  isMsgsSaved: false,
  ip: '127.0.0.1'
})

/** 自动记录抽屉场景变化 */
watch(()=>curDrawerData.scene,(oldValue,newValue)=>{
  curDrawerData.last_scene = newValue
})

/**
 * 折叠面板折叠事件
 */
const handleChange = (val: string[]) => {
  console.log(val)
}

/** 处理联系人搜索 */
const handleSearchContacts = (text:string) => {
  console.log(text)
  devStore[devStore.curAdapter].group_list.forEach((group,i) => {
    // if(group.group_name.includes(text) || String(group.group_id).includes(text)) {
    //   devStore[devStore.curAdapter].group_list[i].searched = true
    // } else {
    //   devStore[devStore.curAdapter].group_list[i].searched = false
    // }
    if(text == '') {
      return group.searched = false
    }
    group.searched = (group.group_name.includes(text) || String(group.group_id).includes(text))
  })
  devStore[devStore.curAdapter].friend_list.forEach((friend,i) => {
    // if(friend.nickname.includes(text) || String(friend.user_id).includes(text)) {
    //   devStore[devStore.curAdapter].friend_list[i].searched = true
    // } else {
    //   devStore[devStore.curAdapter].friend_list[i].searched = false
    // }
    if(text == '') {
      return friend.searched = false
    }
    friend.searched = (friend.nickname.includes(text) || String(friend.user_id).includes(text)); 
  })
}

/** 处理点击事件 */
const handleClickMsgsList = (row:groupInfoType | friendInfoType) => {
  devStore.qqScene = 1
  if('group_id' in row) {
    devStore[devStore.curAdapter].cur_group_id = row.group_id
    devStore[devStore.curAdapter].cur_message_type = 'group'
    nextTick(()=>{
      if(selfNotInGroup()) {  
        chatWindowRef.value.inputValue = '不在该群聊，请加群后发送！'
      } else {
        chatWindowRef.value.inputValue = ''
      }
    })
  } else {
    devStore[devStore.curAdapter].cur_private_id = row.user_id
    devStore[devStore.curAdapter].cur_message_type = 'private'
    nextTick(()=>{
      chatWindowRef.value.inputValue = ''
    })
  }
}

/**
 * 获取机器人信息
 */
const getBotInfo = async () => {
  let res: BotInfoResponseType = await reqBotInfo()
  if (res.code == 200) {
    botInfoList.value = res.data
  }
}

/** 发送消息事件 */
const sendMessage = (seg:MessageElem | MessageElem[]) => {
    
    const message:MessageElem[] = []

    if(Array.isArray(seg)) {
      seg.forEach(item=>{
        if(!/text|face|image|record|video|at|reply/.test(item.type)) {
          ElMessage.error('无法发送此消息')
          return
        }
        if((item.type as any) == 'audio') item.type = 'record'
        message.push(item)
      })
    } else {
      if(!/text|face|image|record|video|at|reply/.test(seg.type)) {
        ElMessage.error('无法发送此消息')
        return
      }
      if((seg.type as any) == 'audio') seg.type = 'record'
      message.push(seg)
    }
    

    if(msgQueueController.curQueueType == 'group') {
      let groupMsg = Events.group_message({
        message_id: Math.round(Date.now() / 1000),
        group_id: (curGroup.value as groupInfoType)?.group_id,
        user_id: devStore[devStore.curAdapter].cur_self_info.user_id,
        nickname: (curGroupSelfInfo.value as groupMemberInfoType)?.nickname,
        message: message,
        raw_message: Events.makeCQ(message),
        role: (curGroupSelfInfo.value as groupMemberInfoType)?.role,
        card: (curGroupSelfInfo.value as groupMemberInfoType)?.card,
        level: (curGroupSelfInfo.value as groupMemberInfoType)?.level,
        title: (curGroupSelfInfo.value as groupMemberInfoType)?.title,
      })

      const tempQueue = msgQueueController.curGroup?.msg_queue

      if(tempQueue?.length && tempQueue?.length > 0) {
        const timeDif = Date.now() - tempQueue[tempQueue.length - 1].time * 1000
        if(timeDif > 10000) msgQueueController.groupQueue_push({...groupMsg, message: [],isSelf: true, toast: {notice_time: getFormatDate(new Date(),3)}})
      }

      msgQueueController.groupQueue_push(Object.assign(groupMsg,{isSelf: true}))
      Ws.value.bot?.send(JSON.stringify(groupMsg))
      console.log(groupMsg)
    }

    if(msgQueueController.curQueueType == 'private') {
      let privateMsg = Events.private_message({
        message_id: Math.round(Date.now() / 1000),
        user_id: devStore[devStore.curAdapter].cur_self_info.user_id,
        nickname: (curGroupSelfInfo.value as groupMemberInfoType)?.nickname,
        message: message,
        raw_message: Events.makeCQ(message),
      })

      const tempQueue = msgQueueController.curPrivate?.msg_queue

      if(tempQueue?.length && tempQueue?.length > 0) {
        const timeDif = Date.now() - tempQueue[tempQueue.length - 1].time * 1000
        if(timeDif > 10000) msgQueueController.groupQueue_push({...privateMsg, message: [],isSelf: true, toast: {notice_time: getFormatDate(new Date(),3)}})
      }

      msgQueueController.privateQueue_push(Object.assign(privateMsg,{isSelf: true}))
      Ws.value.bot?.send(JSON.stringify(privateMsg))
      console.log(privateMsg)
    }

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
const clickTabbar = (btn:'messages' | 'contacts' | 'settings') => {
  curTabbarBtn.value = btn
}

/** 联系人列表 */
const clickMessagesList = (btn:'messages' | 'contacts' | 'settings') => {
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

/** 查找引用消息@deprecated */
const quotePreview = (id:string) => {
  const quoteMsg = curMsgQueue.value.find((msg)=>String(msg.message_id) == id)
  console.log(quoteMsg?.message)
  return quoteMsg || {}
}

/**
 * 处理底部输入栏按钮点击事件
 */
const handleClickFooterBtn = (type:string) => {
  console.log(type)
}

/** 处理语音发送 */
const handleAudioRecorded = (data:{url:string}) => {  
  sendMessage({type: 'record', data: {url: data.url, file: data.url}})
}; 


/** 处理消息气泡操作 */
const handleMsgOperation = async(e:{type:string},msg:queueItemType,id:number) => {
  console.log(e)
  switch(e.type) {
    case 'delete':
      if(msgQueueController.curQueueType == 'group') {
        msgQueueController.groupQueue_splice(id,1)
      } else {
        msgQueueController.privateQueue_splice(id,1)
      }
      break;
    case 'withdraw':
      (msg as any).toast = {isDeleted: true}
      if(msg.message) msg.message = []
      break;
    case 'copy':
      navigator.clipboard && await navigator?.clipboard?.writeText(msg.raw_message);  
      ElMessage.success('复制成功！')
      break;
    case 'quote':
      chatWindowRef.value.inputValue = `[CQ:reply,id=${msg.message_id}]` + chatWindowRef.value.inputValue
      break
    case 'multicheck':
      isMultiCheckMode.value = true
      break;
  }
}

/** 发送通知事件@todo */
const sendNotice = (type: string, $event: any) => {
  let myMsg = Events.group_message({
    message_id: Math.round(Date.now() / 1000),
    group_id: (curGroup.value as groupInfoType)?.group_id,
    user_id: devStore[devStore.curAdapter].cur_self_info.user_id,
    nickname: (curGroupSelfInfo.value as groupMemberInfoType)?.nickname,
    message: [],
    raw_message: Events.makeCQ([]),
    role: (curGroupSelfInfo.value as groupMemberInfoType)?.role,
    card: (curGroupSelfInfo.value as groupMemberInfoType)?.card,
    level: (curGroupSelfInfo.value as groupMemberInfoType)?.level,
    title: (curGroupSelfInfo.value as groupMemberInfoType)?.title,
  })

  let notice: any
  const group = curGroup.value as groupInfoType

  switch(type) {
    case 'notify_poke':
      notice = Events.notify_poke(group.group_id, devStore[devStore.curAdapter].cur_self_info.user_id, $event.user_id);
      // $event.toast = {poke: `你戳了戳${$event.sender.card}的屁股并说好Q弹~`}
      let pokeMsg = {...myMsg,isSelf: true, toast: {poke: `你戳了戳${$event.sender.card}的皮皮并说好Q弹~`}}
      if(msgQueueController.curQueueType == 'group') {
        msgQueueController.groupQueue_push(pokeMsg)
      } else {
        msgQueueController.privateQueue_push(pokeMsg)
      }
      break;
    default: 
      return
  }
  Ws.value.bot?.send(JSON.stringify(notice))
}

/** 处理头像点击事件 */
const handleAvatarClick = (msg:queueItemType) => {
  console.log(msg)
  chatWindowRef.value.isDrawerOpen = true
  if(devStore[devStore.curAdapter].cur_message_type == 'group') {
    let member = curGroup.value.member_list.find((member)=>member.user_id == msg.sender.user_id)
    if(member) {
      handleSettingItem({type: 'member_id',data: member})
    }
  } else {
    if(msg.sender.user_id == devStore[devStore.curAdapter].cur_self_info.user_id) {
      handleSettingItem({type: 'friend_info',data: devStore[devStore.curAdapter].cur_self_info})
    } else {
      handleSettingItem({type: 'friend_info',data: curPrivate.value})
    }
    
  }
 
}

/** 处理头像右键或长按操作 */
const handleAvatarOperation = (e:any, msg:groupMsgQueueItemType, id:number) => {
  switch(e.type) {
    case 'poke':
      sendNotice('notify_poke',msg);
      break;
    case 'at':
      chatWindowRef.value.inputValue += `[CQ:at,qq=${msg.sender.user_id}]`
      break
    default:
      return
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
        if(msgQueueController.curQueueType == 'group') {
          msgQueueController.groupQueue_splice(i,1)
        } else {
          msgQueueController.privateQueue_splice(i,1)
        }
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
    chatHeaderVisible.value = false
  } else {
    footer_type.value = 'Input'
    chatHeaderVisible.value = true
  }
}

/** 处理点赞事件 */
const handleThumbup = () => {
  const isGroup = (devStore[devStore.curAdapter].cur_message_type == 'group')
  
  if(isGroup) {
    const memberId = curGroup.value.member_list.findIndex(member=>member.user_id == curDrawerData.body.member_data.user_id)
    if(memberId != -1) {
      (devStore[devStore.curAdapter].group_list[curGroupIndex.value].member_list[memberId].thumbs as number)++
    }
  } 

  const friendId = devStore[devStore.curAdapter].friend_list.findIndex(friend=>friend.user_id == (isGroup?curDrawerData.body.member_data.user_id:curDrawerData.body.friend_data.user_id))
  console.log(curDrawerData.body.friend_data)
  if(friendId != -1) {
    (devStore[devStore.curAdapter].friend_list[friendId].thumbs as number)++
  }
}

/** 进入不同设置场景 */
const handleSettingItem = (e:{type:string, data: unknown}) => {
  console.log(e)
  
  switch(e.type) {
    /** 群资料事件 */
    case 'group_name':
      curDrawerData.title = '群聊名称'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'self_card':
      curDrawerData.title = '编辑群昵称'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'search_chat_records':
      curDrawerData.title = '查找聊天记录'
      break;
    case 'member_id':
      curDrawerData.title = '资料卡'
      let roleData = e.data as any
      if(roleData.role == 'bot') {
        curDrawerData.body.member_type = 'bot'
      } else {
        curDrawerData.body.member_type = 'member'
      }
      curDrawerData.body.member_data = e.data as groupMemberInfoType
      curDrawerData.scene = 2
      break;
    case 'dismiss_group':
      devStore[devStore.curAdapter].group_list.splice(curGroupIndex.value,1)
      ElMessage.success('已解散该群聊！')
      devStore[devStore.curAdapter].cur_group_id = devStore[devStore.curAdapter].group_list[0].group_id
      break;
    case 'exit_group':
      let memberIndex = devStore[devStore.curAdapter].group_list[curGroupIndex.value].member_list.findIndex((member) => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id)
      if(memberIndex !== -1) {
        devStore[devStore.curAdapter].group_list[curGroupIndex.value].member_list.splice(memberIndex,1)
        ElMessage.success('已退出该群聊！')
      } else {
        ElMessage.error('已不在该群聊！')
      }
      break
    case 'bot_welcome':
      curDrawerData.title = '设置入群欢迎'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    /** 群资料事件 */
    case 'group_info':
      curDrawerData.title = (e.data as groupInfoType).group_name
      curDrawerData.body.member_type = 'group'
      curDrawerData.scene = 2
      break
    /** 好友资料事件 */
    case 'friend_info':
      curDrawerData.title = (e.data as friendInfoType).nickname
      curDrawerData.body.friend_data = e.data as friendInfoType
      curDrawerData.body.member_type = 'friend'
      curDrawerData.scene = 2
      break;
    /** 成员资料事件 */
    case 'private_sex':
      curDrawerData.title = '设置性别'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'private_age':
      curDrawerData.title = '设置年龄'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'private_area':
      curDrawerData.title = '设置所在地'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'group_level':
      curDrawerData.title = '设置群聊等级'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'group_title':
      curDrawerData.title = '设置专属头衔'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    case 'group_role':
      curDrawerData.title = '设置群聊角色'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;

    default:
      curSettingInputValue.value = ''
      return
  }
  
  curDrawerData.type = e.type
}

/** 保存设置数据 */
const handleSaveSettingItem = () => {
  const curGroupIndex = devStore[devStore.curAdapter].group_list.findIndex((group:groupInfoType) => group.group_id == devStore[devStore.curAdapter].cur_group_id)
  if(curGroupIndex == -1) {
    ElMessage.warning('未能找到当前群聊数据，请刷新网页重试！')
    return
  }
  const curSelfIndex = devStore[devStore.curAdapter].group_list[curGroupIndex].member_list?.findIndex((member:groupMemberInfoType) => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id)
  switch(curDrawerData.type) {
    case 'group_name':
      devStore[devStore.curAdapter].group_list[curGroupIndex].group_name = curSettingInputValue.value as string
      curDrawerData.title = '群聊设置'
      curDrawerData.scene = 0
      break;
    case 'self_card':
      
      if(curSelfIndex == -1) {
        ElMessage.warning('未能找到自己所在当前群聊数据，请刷新网页重试！')
        return
      }
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].card = curSettingInputValue.value as string
      }
      curDrawerData.title = '群聊设置'
      curDrawerData.scene = 0
      break;
    case 'bot_welcome':
      curDrawerData.body.bot_welcome = curSettingInputValue.value as string
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;

    case 'private_sex':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].sex = curSettingInputValue.value as ('male' | 'female' | 'unknown')
      }
      devStore[devStore.curAdapter].cur_self_info.sex = curSettingInputValue.value as ('male' | 'female' | 'unknown')
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'private_age':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].age = curSettingInputValue.value as number
      }
      devStore[devStore.curAdapter].cur_self_info.age = curSettingInputValue.value as number
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'private_area':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].area = curSettingInputValue.value as string
      }
      devStore[devStore.curAdapter].cur_self_info.area = curSettingInputValue.value as string
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_level':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].level = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_title':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].title = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_role':
      if(devStore[devStore.curAdapter].group_list[curGroupIndex].member_list) {
        devStore[devStore.curAdapter].group_list[curGroupIndex].member_list[curSelfIndex as number].role = curSettingInputValue.value as any
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;

    default:
      return  
  }
  ElMessage.success('修改成功！')
  
}

/** 处理抽屉返回事件 */
const handleDrawerBack = () => {
  if(curDrawerData.scene == 0) {
    chatWindowRef.value.isDrawerOpen = false
  } else if(curDrawerData.scene == 1) {
    if(curDrawerData.last_scene == 0) {
      curDrawerData.scene = 0
      curDrawerData.title = '群聊设置'
    } else if(curDrawerData.last_scene == 2) {
      curDrawerData.scene = 2
      curDrawerData.title = '资料卡'
    }
  } else if(curDrawerData.scene == 2) {
    curDrawerData.scene = 0
  }
}

/** 合并群和私聊消息列表@deprecated */
// const messagesList = computed(()=>{
//   let list = []
//   let groupList = devStore[devStore.curAdapter].group_list.map(group => {
//     const { group_id,group_name,member_count,max_member_count } = group
//     return { group_id,group_name,member_count,max_member_count }
//   })
//   let friendList = devStore[devStore.curAdapter].friend_list.map(friend => {
//     const { user_id,nickname,remark } = friend
//     return { user_id,nickname,remark }
//   })
//   return [...groupList,...friendList]
// })

/** 获取当前消息队列 */
const curMsgQueue = computed(()=>{
  return devStore[devStore.curAdapter].cur_message_type == 'group'?((curGroup.value as groupInfoType).msg_queue):(curPrivate.value.msg_queue)
  // return msgQueueController.curQueue
})

/** 获取当前群聊数据 */
const curGroup = computed(()=>{
    return (devStore[devStore.curAdapter].group_list.find((group:groupInfoType) => group.group_id == devStore[devStore.curAdapter].cur_group_id) || {}) as groupInfoType
})

/** 获取当前群聊对象索引 */
const curGroupIndex = computed(()=>{
    return devStore[devStore.curAdapter].group_list.findIndex((group:groupInfoType) => group.group_id == devStore[devStore.curAdapter].cur_group_id)
})

/** 获取当前私聊数据 */
const curPrivate = computed(()=>{
    return (devStore[devStore.curAdapter].friend_list.find((friend) => friend.user_id == devStore[devStore.curAdapter].cur_private_id) || {}) as friendInfoType
})

/** 获取当前私聊对象索引 */
const curPrivateIndex = computed(()=>{
    return devStore[devStore.curAdapter].friend_list.findIndex((friend) => friend.user_id == devStore[devStore.curAdapter].cur_private_id)
})

/** 获取当前操作者所在群聊的资料 */
const curGroupSelfInfo = computed(()=>{
    return (((curGroup.value as groupInfoType)?.member_list as groupMemberInfoType[])?.find((member:groupMemberInfoType) => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id) || {}) as groupMemberInfoType
})

/** 统计当前消息总数 */
const msgsSumCount = computed(()=>{
  return devStore[devStore.curAdapter].group_list.reduce((sum, group) => sum + (group.msg_queue as groupMsgQueueItemType[]).length,0) + 
    devStore[devStore.curAdapter].friend_list.reduce((sum, friend) => sum + (friend.msg_queue as privateMsgQueueItemType[]).length,0)
}) 

/** 获取当前群额外统计 */
const curGroupCardData = computed(() => {
  let earliestTime = 0
  let femaleCount = 0
  let youngCount = 0
  const youngAge = calculateYearsDif(2000)
  curGroup.value.member_list.forEach((member,index)=>{
    if(index == 0) earliestTime = member.join_time
    if(member.join_time < earliestTime) earliestTime = member.join_time
    if(member.sex == 'female') femaleCount++
    if(youngAge > member.age) youngCount++
  })
  const createdTime = getFormatDate(new Date(earliestTime * 1000),4)

  let activePer:any = {}
  curGroup.value.msg_queue.forEach((msg)=>{
    if(!activePer[msg.user_id]) activePer[msg.user_id] = 0
    activePer[msg.user_id]++
  })
  let activeCount = Object.keys(activePer).length
  return {
    activeCount,
    femaleCount,
    youngCount,
    createdTime,
    sumCount: curGroup.value.member_list.length
  }
})


/** 获取引用消息对象 */
const quoteMsgs = computed(()=>{
  let quoteObj:{[key:string]:queueItemType} = {}
  curMsgQueue.value.forEach((msg)=>{
    if(msg.message && msg.message?.length > 0) {
      msg.message.forEach((seg:MessageElem)=>{
        if(seg.type == 'reply') {
          quoteObj[seg.data.id] = (curMsgQueue.value.find((msg)=> String(msg.message_id) == seg.data.id)) as queueItemType
        }
      })
    }
  })
  return quoteObj
})

/** 判断当前是群聊还是私聊@deprecated */
// const curMessageType = computed(()=>{
//   const { cur_group_id, cur_private_id } = devStore[devStore.curAdapter]
//   if(cur_group_id && !cur_private_id) {
//     return 'group'
//   } else if(!cur_group_id && cur_private_id) {
//     return 'private'
//   } else {
//     return 'group'
//   }
// })

/** 判断函数 */
const selfNotInGroup = () => {
  if(devStore[devStore.curAdapter].cur_message_type == 'group') {
    if(curGroup.value.member_list.findIndex((member)=>member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id) == -1) {
      return true
    }
  }
  return false
}

/** 判断是否不在群聊 */
const input_disabled = computed(selfNotInGroup)


/** -----------------------------文件操作--------------------------- */

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
  type && sendMessage({
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

onMounted(() => {
  getBotInfo()
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
      .message-room-info-top {
        .message-room-info-top-content {
          font-size: 14px;
          width: calc(100% - 50px); 
          display: inline-block; 
          text-overflow: ellipsis; 
          overflow: hidden; 
          white-space: nowrap;
        }
      }
      .message-room-info-bottom {
        .message-room-info-bottom-content {
          font-size: 12px; 
          width: calc(100% - 30px); 
          display: inline-block; 
          text-overflow: ellipsis; 
          overflow: hidden; 
          white-space: nowrap;
        }
      }
    }
  }

  .message-room-list:hover {
    background-color: #F5F5F5;
  }

  .message-room-list-selected {
    background-color: #0099FF;
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

// qq表情工具栏
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

// 语音工具栏
.audio-box {
  display: flex;
  width: 100%;
  height: 160px;
  justify-content: center;
  align-items: center;
  .audio-btn-box {
    width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .audio-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-image: radial-gradient(circle, #00c5ff, #009bff);
    }
    .audio-desc {
      margin-top: 10px;
      width: 100%;
      text-align: center;
      color: #AAAAAA;
      font-size: 12px;
    }
  }

}

// 资料卡
.drawer-body__member__card {
  width: 100%;
  background-color: #FFFFFF;
  padding-top: 20px;
  margin-bottom: 30px;
  .drawer-body__member__card__bot {
    // margin-top: 30px;
    padding: 15px;
    .drawer-body__member__card__bot__avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%; 
    }
    .drawer-body__member__card__bot__name {
      display: flex;
      align-items: center;
      margin-top: 10px;
      font-size: 16px;
      .drawer-body__member__card__bot__logo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        margin-left: 10px;
        background-color: #0A64FF;
        border-radius: 3px;
        padding: 3px;
        font-size: 10px;
        color: #FFFFFF;
      }
    }
    .drawer-body__member__card__bot__desc {
      font-size: 12px;
      color: #7F7F7F;
      margin-top: 15px;
    }
  }

  .drawer-body__member__card__private {
    padding: 15px;
    display: flex;
    .drawer-body__member__card__private__avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%; 
    }
    .drawer-body__member__card__private__info {
      margin-left: 10px;
      padding: 5px;
      
      .drawer-body__member__card__private__name {
        // display: flex;
        align-items: center;
        font-size: 16px;
        .drawer-body__member__card__private__id {
          font-size: 12px;
          color: #7F7F7F;
          margin-top: 5px;
        }
      }
    }
    .drawer-body__member__card__private__thumbup {
      margin-left: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // border: 2px solid red;
      .drawer-body__member__card__private__thumbup__count {
        margin-top: 2px;
        font-size: 12px;
        color: #7F7F7F;
      }
    }
    
  }

  .drawer-body__member__card__group {
    padding: 15px;
    display: flex;
    .drawer-body__member__car__group__statistics {
      display: flex;
      justify-content: space-around;
    }
  }
}

.card-title {
  margin-left:15px; 
  font-size: 12px; 
  color: #7F7F7F;
}

.card-desc {
    margin-left: auto; 
    margin-right: 5px;
    font-size: 12px; 
    color: #7F7F7F;
}

.card-list-divider {
    width: 100%;
    height: 0.5px;
    background-color: #d3d3d397;
}

.card-list-item-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.card-list-item {

  .card-list-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
  }
  .card-list-item-bottom-desc {
    font-size: 12px; 
    line-height: 16px;
    color: #7F7F7F;
  }
}

.card-list-item:active,.card-list-item-flex:active {
    background-color: #E8E8E8;
}


</style>
