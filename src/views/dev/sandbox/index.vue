<template>
  <Msglist class="message-list" 
      :avatar="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${devStore.onebot11.cur_master_id??userStore.masterQQ}`"
      :title="userStore.username"
      state="在线"
      @click-tabbar="clickTabbar"
  >
    <template #messages>
      <!-- 机器人列表(可以不分) -->
      <!-- <div v-if="curTabbarBtn == 'messages'" class="message-room-list" v-for="(row,index) in botInfoList" :key="index" @click="devStore.qqScene = 1">
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
      </div> -->
      <!-- 群消息列表 -->
      <div v-if="curTabbarBtn == 'messages'" 
        class="message-room-list" 
        :class="[(devStore.onebot11.cur_message_type == 'group' && devStore.onebot11.cur_group_id == row.group_id)?'message-room-list-selected':'']"
        v-for="(row,index) in devStore.onebot11.group_list" 
        :key="index" 
        @click="(
          devStore.qqScene = 1,
          devStore.onebot11.cur_group_id = row.group_id,
          devStore.onebot11.cur_message_type = 'group'
        )"
      >
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

      <!-- 私聊消息列表 -->
      <div v-if="curTabbarBtn == 'messages'" 
        v-for="(row,index) in devStore.onebot11.friend_list" 
        :key="index"
        class="message-room-list" 
        :class="[(devStore.onebot11.cur_message_type == 'private' && devStore.onebot11.cur_private_id == row.user_id)?'message-room-list-selected':'']"
        @click="(
          devStore.qqScene = 1,
          devStore.onebot11.cur_private_id = row.user_id,
          devStore.onebot11.cur_message_type = 'private'
        )"
      >
        <img class="message-room-avatar" :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${row.user_id}`"/>
        <div class="message-room-info">
          <div class="message-room-info-top">
            <span style="font-size: 14px;">{{ row.nickname }}</span>
            <span style="font-size: 12px;">
              {{ getFormatDate(new Date(devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1]?.time * 1000),3) }}
            </span>
          </div>
          <div class="message-room-info-bottom">
            <div style="font-size: 12px; width: calc(100% - 30px); display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
              {{ devStore.onebot11.msgQueue[devStore.onebot11.msgQueue.length - 1]?.sender?.nickname }}: 
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
              <div class="message-room-list" v-for="(row,index) in devStore.onebot11.friend_list" :key="index" @click="devStore.qqScene = 1">
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
        ref="chatWindowRef"
        :title="(curGroup as groupInfoType)?.group_name" 
        :count="(curGroup as groupInfoType)?.member_list?.length" 
        :msgs_length="devStore.onebot11.msgQueue.length"
        :header_visible="chatHeaderVisible"
        :footer_type="footer_type"
        :footerview_visible = "footerview_visible"
        @connect-ws="Ws.connect(devStore.onebot11.cur_self_id)"
        @send-input="sendMessage($event)"
        @go-setting="handleDrawerSetting"
        @multi-check="handleMultiMsgs"
        @footer-btn="(curFooterBtn = $event,($event == 'none'?footerview_visible = false:footerview_visible = true))"
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
                :role="msg.sender?.role"
                :role_title="`${msg.sender?.level} ${(msg.sender?.title)?(msg.sender?.title):roleMap[msg.sender?.role]}`"
                :onright="msg.isSelf"
                @msg-operation="handleMsgOperation($event,msg,id)"
                @avatar-operation="handleAvatarOperation($event,msg,id)"
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
                :role="msg.sender?.role"
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
                :role="msg.sender?.role"
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
                :role="msg.sender?.role"
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
                :role="msg.sender?.role"
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
                :role="msg.sender?.role"
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
          <!-- 抽屉顶部header -->
          <div class="fakeqq-header" style="background-image: #ffffff;">
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
          <!-- 抽屉资料主体 -->
          <GroupSetting v-if="curDrawerData.scene == 0" @set-name="handleSettingItem"/>
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
            <!-- 个人资料 -->
            <div v-if="curDrawerData.body.member_type != 'bot'">
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
                    <svg-icon name="thumbup" width="24px" height="24px"/>
                    <span class="drawer-body__member__card__private__thumbup__count">114514</span>
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
        <template #atlist>
          <div class="fakeqq-footer__members__list">
            <div class="fakeqq-footer__members__list__item" 
              v-for="(member, memberId) in (curGroup as groupInfoType)?.member_list" 
              :key="memberId"
              @click="chatWindowRef.inputValue += `${member.card} `"
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
import GroupSetting from './chatdrawer/groupSetting.vue';

// 小组件
import RecorderButton from './components/recorder.vue';
import SildeTab from './components/tab.vue'
import QQcard from './components/qqcard.vue'

import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

import faceData from '@/assets/qfaces/data.json'
import { getFormatDate } from '@/utils/time'
// API
import useDevStore from '@/store/modules/dev';
import useUserStore from '@/store/modules/user'
import { reqBotInfo } from '@/api/dev/plugin'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type'
import { ref, reactive, onMounted, computed, watch } from 'vue'

import type { MessageElem,NodeElem } from './protocol/onebotv11/message/message.elem'
import type { queueItemType } from './protocol/onebotv11/event/type'
import type { groupInfoType,groupMemberInfoType } from './protocol/onebotv11/api/type'
import type { drawerDataType } from './types/drawer'

import Events from './protocol/onebotv11/event/event'
import Onebot from './protocol/ws'

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
      card_changeable: true
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
const selfAvatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${devStore.onebot11.cur_master_id}`

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

/** 自动记录抽屉场景变化 */
watch(()=>curDrawerData.scene,(oldValue,newValue)=>{
  curDrawerData.last_scene = newValue
  // console.log(curDrawerData.last_scene)
  // console.log(newValue)
})

/**
 * 折叠面板折叠事件
 */
const handleChange = (val: string[]) => {
  console.log(val)
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
const sendMessage = (seg:MessageElem) => {
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

    if((seg.type as any) == 'audio') seg.type = 'record'

    message.push(seg)

    let myMsg = Events.group_message({
        message_id: Math.round(Date.now() / 1000),
        group_id: (curGroup.value as groupInfoType)?.group_id,
        user_id: devStore.onebot11.cur_master_id,
        nickname: (curGroupSelfInfo.value as groupMemberInfoType)?.nickname,
        message: message,
        raw_message: Events.makeCQ(message),
        role: (curGroupSelfInfo.value as groupMemberInfoType)?.role,
        card: (curGroupSelfInfo.value as groupMemberInfoType)?.card,
        level: (curGroupSelfInfo.value as groupMemberInfoType)?.level,
        title: (curGroupSelfInfo.value as groupMemberInfoType)?.title,
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

/** 发送通知事件@todo */
const sendNotice = (seg:MessageElem) => {

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


const handleAudioRecorded = (data:{url:string}) => {  
  sendMessage({type: 'record', data: {url: data.url, file: data.url}})
}; 


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

/** 处理头像点击操作 */
const handleAvatarOperation = (e:any, msg:any, id:number) => {
  console.log(e,msg,id)
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
    chatHeaderVisible.value = false
  } else {
    footer_type.value = 'Input'
    chatHeaderVisible.value = true
  }
}

/** 进入不同设置场景 */
const handleSettingItem = (e:{type:string, data: unknown}) => {
  console.log(e)
  
  switch(e.type) {
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
        curDrawerData.body.member_type = (e.data as groupMemberInfoType).role
      }
      curDrawerData.body.member_data = e.data as groupMemberInfoType
      curDrawerData.scene = 2
      break;
    case 'bot_welcome':
      curDrawerData.title = '设置入群欢迎'
      curSettingInputValue.value = e.data as string
      curDrawerData.scene = 1
      break;
    
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
  const curGroupIndex = devStore.onebot11.group_list.findIndex((group:groupInfoType) => group.group_id == devStore.onebot11.cur_group_id)
  if(curGroupIndex == -1) {
    ElMessage.warning('未能找到当前群聊数据，请刷新网页重试！')
    return
  }
  const curSelfIndex = devStore.onebot11.group_list[curGroupIndex].member_list?.findIndex((member:groupMemberInfoType) => member.user_id == devStore.onebot11.cur_master_id)
  switch(curDrawerData.type) {
    case 'group_name':
      devStore.onebot11.group_list[curGroupIndex].group_name = curSettingInputValue.value as string
      curDrawerData.title = '群聊设置'
      curDrawerData.scene = 0
      break;
    case 'self_card':
      
      if(curSelfIndex == -1) {
        ElMessage.warning('未能找到自己所在当前群聊数据，请刷新网页重试！')
        return
      }
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].card = curSettingInputValue.value as string
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
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].sex = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'private_age':
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].age = curSettingInputValue.value as number
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'private_area':
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].area = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_level':
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].level = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_title':
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].title = curSettingInputValue.value as string
      }
      curDrawerData.title = '资料卡'
      curDrawerData.scene = 2
      break;
    case 'group_role':
      if(devStore.onebot11.group_list[curGroupIndex].member_list) {
        devStore.onebot11.group_list[curGroupIndex].member_list[curSelfIndex as number].role = curSettingInputValue.value as any
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

/** 获取当前群聊数据 */
const curGroup = computed(()=>{
    return devStore.onebot11.group_list.find((group:groupInfoType) => group.group_id == devStore.onebot11.cur_group_id) || {}
})

/** 获取当前私聊数据 */
const curPrivate = computed(()=>{
    return devStore.onebot11.friend_list.find((group:groupInfoType) => group.group_id == devStore.onebot11.cur_group_id) || {}
})

/** 获取当前操作者所在群聊的资料 */
const curGroupSelfInfo = computed(()=>{
    return ((curGroup.value as groupInfoType)?.member_list as groupMemberInfoType[])?.find((member:groupMemberInfoType) => member.user_id == devStore.onebot11.cur_master_id) || {}
})

/** 聊天窗口顶部header配置 */
const curChatHeaderData = computed(()=>{
  let title = ''
  if(curDrawerData.scene = 0) title = `${(curGroup.value as groupInfoType)?.group_name}(${(curGroup.value as groupInfoType)?.member_list?.length})`
  if(curDrawerData.scene = 1) title = '群聊设置'
  if(curDrawerData.scene = 1) title = '群聊设置'
  return {
    title: title 
  }
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

/** 判断当前是群聊还是私聊 */
const curMessageType = computed(()=>{
  const { cur_group_id, cur_private_id } = devStore.onebot11
  if(cur_group_id && !cur_private_id) {
    return 'group'
  } else if(!cur_group_id && cur_private_id) {
    return 'private'
  } else {
    return 'group'
  }
})


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
