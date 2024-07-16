<template>
  <el-card class="log_box">
    <div class="log_select">
      <div class="log_title">
        <span style="margin-right: 10px">日志</span>

        <el-color-picker @change="setDetailColor" v-model="logDetailColor" size="small" show-alpha
          :predefine="predefineColors" />
      </div>
      <!-- 日志多选框 -->
      <div class="select_log">
        <el-button class="update_btn" size="small" icon="Refresh" circle @click="updateLog"
          style="margin-right: -5px"></el-button>
        <!-- 设置 -->
        <el-popover placement="bottom" title="日志设置" :width="300" trigger="hover">
          <!-- 表单元素 -->
          <el-form>
            <el-form-item label="窗口高度">
              <el-slider v-model="logBoxHeight" size="large" :min="400" :max="1000" @input="changeLogHeight" />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-slider v-model="logFontSize" size="large" :min="12" :max="30" @input="changeLogFontSize" />
            </el-form-item>
          </el-form>
          <template #reference>
            <el-button size="small" icon="Setting" circle style="margin-right: 5px"></el-button>
          </template>
        </el-popover>
        <!-- 日期选择 -->
        <el-select v-model="curLog" placeholder="Select" size="small" style="width: 130px" @change="changeLog">
          <el-option v-for="(item, index) in logsList" :key="index" :label="item.replace('command.', '')"
            :value="item" />
        </el-select>
      </div>
    </div>
    <!-- 日志窗口 -->
    <div class="page-logs" :style="{ height: `${newHeight}px` }">
      <div class="line" v-for="(item, index) in logs" :key="index" :style="{
        fontSize: `${newFontSize}px`,
        marginTop: `${Math.round(newFontSize * 0.2,)}px`,
        lineHeight: `${String(Math.round(1.5 * newFontSize))}px`
      }">
        <span class="timestamp">{{ item.time }}</span>
        <span
          :class="LEVEL_MAP[item.level as keyof typeof LEVEL_MAP] ? LEVEL_MAP[item.level as keyof typeof LEVEL_MAP] : LEVEL_MAP['STDOUT']">
          [{{ item.level }}]
        </span>
        <span class="detail" :style="{ color: `${detailCssColor}` }">
          {{ item.detail }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqLogs } from '@/api/screen/index'

type logType = {
  time: string
  level: string
  detail: string
}

let logs = ref<logType[]>([])
let logsList = ref<string[]>([])
let logId = ref<string>('0')
let curLog = ref('')

// 窗口设置
let logBoxHeight = ref(500)
let newHeight = ref(500)
let logDetailColor = ref('#c8c7c7')
let detailCssColor = ref('#c8c7c7')

let logFontSize = ref(16)
let newFontSize = ref(16)

const predefineColors = ref([
  '#c8c7c7',
  'rgba(30, 244, 251, 1)',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
])

const LEVEL_MAP = ref({
  STDOUT: 'stdout',
  TRACE: 'level-trace',
  DEBUG: 'level-debug',
  INFO: 'level-info',
  WARN: 'level-warn',
  WARNING: 'level-warn',
  ERROR: 'level-error',
  ERRO: 'level-error',
  FATAL: 'level-fatal',
  MARK: 'level-mark',
})

onMounted(() => {
  getLog()
})

const changeLogHeight = (e: number) => {
  newHeight.value = logBoxHeight.value
}

const changeLogFontSize = (e: number) => {
  newFontSize.value = logFontSize.value
}

const setDetailColor = () => {
  detailCssColor.value = logDetailColor.value
}

const getLog = async (id?: string) => {
  let res: any
  if (id == '0' || !id) {
    res = await reqLogs('0')
  } else {
    res = await reqLogs(id)
  }
  // console.log(res)
  if (res.code == 200) {
    logs.value = res.data.logText
      .split('\r')
      .map((line: string) => parseLog(line.trim())) as logType[]
    logsList.value = res.data.logList
    curLog.value = res.data.curLog
  }
}

const changeLog = (e: string) => {
  getLog(e)
}

const updateLog = () => {
  getLog(logId.value)
}

const parseLog = (log: string) => {
  // 正则表达式来匹配时间、日志等级和日志详情
  // 时间格式：[HH:MM:SS.sss]
  // 日志等级：ERRO、MARK等（这里假设它是大写且后面紧跟中括号）
  // 日志详情：其余部分
  const regex = /^(\[\d+:\d+:\d+.\d+\])\[([A-Z]+?)\](.*)/
  const match = regex.exec(log)

  if (match && match.length >= 4) {
    // 提取时间、日志等级和日志详情
    const time = match[1] as string
    const level = match[2] as string
    const detail = match[3] as string

    // 返回提取出的结果
    return { time, level, detail }
  } else {
    // 如果没有匹配到，返回一个表示错误的数组
    return {
      time: '',
      level: '',
      detail: log,
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/../node_modules/@fontsource/roboto-mono/index.css';

$--terminal-bg: #24292f;
$--terminal-fg: #d0d7de;
$--terminal-bg-hover: #32383f;
$--terminal-fg-hover: #f6f8fa;
$--terminal-bg-selection: rgba(33, 139, 255, 0.15);
$--terminal-separator: rgba(140, 149, 159, 0.75);
$--terminal-timestamp: #3c8de9;
$--terminal-detail: #c8c7c7;

$--terminal-trace: #2a0cec;
$--terminal-debug: #4194e7;
$--terminal-info: #87f355;
$--terminal-warn: #f8c471;
$--terminal-error: #f37672;
$--terminal-fatal: #f72a1b;
$--terminal-mark: #b7b7b7;

.log_box {
  width: 100%;

  .log_select {
    // border: 2px solid red;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .log_title {
      font-size: 18px;
      font-family: 'Roboto Mono';
      font-weight: 700;
      display: flex;
      align-items: center;
    }
  }
}

.page-logs {
  color: $--terminal-fg;
  background-color: $--terminal-bg;
  margin-top: 20rpx;
  border-radius: 5px;
  padding-bottom: 5px;
  padding-top: 5px;

  overflow-y: scroll;

  .logs {
    transform-origin: top left;
    padding: 15rpx 10rpx;
  }

  .logs:first-child .line:first-child {
    margin-top: 0;

    &::before {
      display: none;
    }
  }

  .line {
    padding: 0 0.5rem;
    border-radius: 2px;
    white-space: pre-wrap;
    position: relative;
    font-family: 'Roboto Mono', monospace, serif;
    max-width: 200rpx;
    word-wrap: break-word;

    &:hover {
      color: $--terminal-fg-hover;
      background-color: $--terminal-bg-hover;
    }

    ::selection {
      background-color: $--terminal-bg-selection;
    }

    .timestamp {
      color: $--terminal-timestamp;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .level {
      color: $--terminal-fg;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .detail {
      color: $--terminal-detail;
      font-weight: bold;
    }

    .level-trace {
      color: $--terminal-trace;
    }

    .level-debug {
      color: $--terminal-debug;
    }

    .level-info {
      color: $--terminal-info;
    }

    .level-warn {
      color: $--terminal-warn;
    }

    .level-error {
      color: $--terminal-error;
    }

    .level-fatal {
      color: $--terminal-fatal;
    }

    .level-mark {
      color: $--terminal-mark;
    }

    .stdout {
      color: $--terminal-fg;
    }
  }
}
</style>
