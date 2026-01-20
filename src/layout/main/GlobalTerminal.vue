<template>
  <div class="log_box">
    <Terminal class="terminal" ref="termRef" @press-enter="onEnter">
      <template #header>
        <el-button
          size="small"
          v-for="sess of tabs"
          :type="sess.id === termSession?.id ? 'primary' : 'default'"
          @click="changeTab(sess)"
        >
          {{ sess.id }}
          <el-icon class="el-icon--right">
            <Close @click="deleteSession(sess)" />
          </el-icon>
        </el-button>
        <el-dropdown>
          <el-button
            icon="Plus"
            circle
            size="small"
            color="red"
            style="margin-left: 5px"
          ></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleConnectShell">
                Shell
              </el-dropdown-item>
              <el-dropdown-item @click="dialogFormVisible = true">
                SSH
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #header-right>
        <el-tooltip effect="dark" content="销毁全部会话" placement="bottom-end">
          <el-button
            icon="SwitchButton"
            circle
            size="small"
            color="red"
            @click="destroy"
          ></el-button>
        </el-tooltip>
      </template>
    </Terminal>
    <!-- ssh连接设置 -->
    <el-dialog v-model="dialogFormVisible" title="ssh连接设置">
      <el-form>
        <el-form-item label="主机">
          <el-input
            :placeholder="localtionHost"
            :prefix-icon="User"
            v-model="devStore.sshInfo.host"
            :input-style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-input
            placeholder="root"
            :prefix-icon="User"
            v-model="devStore.sshInfo.username"
            :input-style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            :prefix-icon="Lock"
            show-password
            type="password"
            v-model="devStore.sshInfo.password"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input
            placeholder="22"
            :prefix-icon="Lock"
            v-model="devStore.sshInfo.port"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="handleConnectSSH">
          连接
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Terminal from '@/components/Terminal/index.vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// 引入图标
import { Lock, User } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

import useDevStore from '@/store/modules/dev'
import ussLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'

import Session from './Session'

const props = defineProps(['dirPath'])

// ssh表单
const dialogFormVisible = ref(false)

const devStore = useDevStore()

// 获取用户名
const userStore = useUserStore()
const userName = ref(userStore.username)

// 视图显示PATH
const prefixPath = ref(props.dirPath)

const { globalTerminal } = ussLayoutSettingStore()

const termRef = ref<InstanceType<typeof Terminal>>()

const termSession = ref<Session>()

const tabs = ref<Session[]>([])

const localtionHost = ref(location.hostname || location.host)

watch(
  () => Session.activeSession,
  (newValue) => {
    console.log(newValue)
  },
)

const onEnter = (text: string) => {
  if (!termSession.value) return
  if (termSession.value?.mode == 'ssh') {
    termSession.value.ws?.send(
      JSON.stringify({
        clientId: termSession.value.id,
        type: 'ssh',
        params: {
          cmd: text,
          path: null,
        },
      }),
    )
  } else {
    termSession.value.ws?.send(
      JSON.stringify({
        clientId: termSession.value.id,
        type: 'exec',
        params: {
          cmd: text,
          path: null,
        },
      }),
    )
  }
}

/** 连接SSH */
const handleConnectSSH = async () => {
  const urlParams = new URLSearchParams({
    host: devStore.sshInfo.host,
    port: String(devStore.sshInfo.port),
    username: devStore.sshInfo.username,
    password: devStore.sshInfo.password,
  })

  termSession.value = new Session('ssh')
  // return
  termSession.value
    .connect('/micro/webui/term/ssh?' + urlParams.toString())
    .then((e) => {
      termSession.value?.ws?.send(
        JSON.stringify({
          type: 'ssh',
          params: {},
        }),
      )
      termSession.value?.ws?.addEventListener('message', (e) => {
        const msg = JSON.parse(e.data)
        console.log(msg)
        if (msg.type === 'ssh' && msg.action === 'stdout') {
          termRef.value?.write(msg.params)
        }
      })
    })
}

/** 连接Shell */
const handleConnectShell = async () => {
  termSession.value = new Session('spawn')
  termSession.value.connect().then((e) => {
    termSession.value?.ws?.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      console.log(msg)
      if (msg.type === 'exec' && msg.action === 'stdout') {
        termRef.value?.write(msg.params)
      }
    })
  })
}

const changeTab = (session: Session) => {
  if (session.id == termSession.value?.id) return
  Session.activeSession = session
  termSession.value = session
  termRef.value?.termRef.clear()
  termRef.value?.write(
    session.msgQueue
      .map((v) => {
        if (
          (v?.type === 'exec' || v?.type === 'ssh') &&
          v?.action === 'stdout'
        ) {
          return v.params
        } else {
          return ''
        }
      })
      .join('\n'),
  )
}

const deleteSession = (session: Session) => {
  if (tabs.value.length == 1) {
    ElNotification.warning('请按右侧电源键！')
    return
  }
  Session.deleteSession(session)
  if (tabs.value.length >= 0) {
    changeTab(tabs.value[0])
  }
}

const destroy = () => {
  Session.sessions.forEach((session) => {
    if (session.ws?.readyState == session.ws?.OPEN) {
      session.ws?.close()
    }
    session.msgQueue = []
  })
  Session.sessions.clear()
  Session.activeSession = null
}

const getNetworkInfo = () => {
  // 重要：检查浏览器是否支持此API
  //@ts-ignore
  if (navigator?.connection && navigator?.connection?.effectiveType) {
    //@ts-ignore
    const connection = navigator?.connection
    return {
      // 网络类型：'slow-2g', '2g', '3g', '4g', '5g'
      effectiveType: connection.effectiveType,
      // 估算的下行速度 (Mbps)
      downlink: connection.downlink,
      // 估算的上行速度 (Mbps) - 支持度更差
      uplink: connection.uplink || '未知',
      // 往返时延估计 (ms)
      rtt: connection.rtt,
      // 是否在节约数据模式
      saveData: connection.saveData,
    }
  } else {
    return { error: '您的浏览器不支持 Network Information API' }
  }
}

onMounted(() => {
  Session.onSessionsChange = (type, message) => {
    ElNotification({
      type,
      message,
    })
    tabs.value = tabs.value = Array.from(Session.sessions.values())
  }
  handleConnectShell()
})

onBeforeUnmount(() => {
  destroy()
  Session.onSessionsChange = null
})
</script>
<style lang="scss" scoped>
.log_box {
  border-radius: $border-radius-medium;
  overflow: hidden;
  z-index: 88;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
  // padding-top: 5px;
}
</style>
