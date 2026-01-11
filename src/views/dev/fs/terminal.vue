<template>
  <div class="bg-main" ref="termboxRef">
    <div class="setting-bar">
      <el-button size="small" style="margin-left: auto;" @click="devStore.fillSSHInfo(),dialogFormVisible = true">SSH</el-button>
      <el-popover placement="bottom" title="终端设置" :width="300" trigger="hover">
        <!-- 终端设置 -->
        <el-form>
          <el-form-item label="高度(行)">
            <el-slider v-model="termHeight" size="large" :min="20" :max="100"
              @input="changeTermHeight" />
          </el-form-item>
          <!-- <el-form-item label="字体大小">
            <el-slider v-model="termFontSize" size="large" :min="12" :max="30" @input="changeTermFontSize" />
          </el-form-item> -->
        </el-form>
        <template #reference>
          <el-button icon="Setting" circle size="small"></el-button>
        </template>
      </el-popover>
      <el-button size="small" icon="FullScreen" circle style="margin:0 5px;" @click="toggleFullScreen(termboxRef)"></el-button>
    </div>
    <!-- 终端视图 -->
    <div
      ref="terminal"
      id="terminal"
    ></div>
    <!-- ssh连接设置 -->
    <el-dialog v-model="dialogFormVisible" title="ssh连接设置">
      <el-form>
        <el-form-item label="主机">
          <el-input :prefix-icon="User" v-model="devStore.sshInfo.host" :input-style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-input :prefix-icon="User" v-model="devStore.sshInfo.username" :input-style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input :prefix-icon="Lock" show-password type="password" v-model="devStore.sshInfo.password" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input :prefix-icon="Lock" v-model="devStore.sshInfo.port" style="width: 100%;"></el-input>
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
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import { Terminal } from '@xterm/xterm'
  import { FitAddon } from '@xterm/addon-fit'

  // 引入图标
  import { User, Lock } from '@element-plus/icons-vue'
  
  import { debounce } from 'lodash' 
  import useUserStore from '@/store/modules/user'
  import useDevStore from '@/store/modules/dev'
  import '@xterm/xterm/css/xterm.css'
  import Ws from '@/api/ws'

  const props = defineProps(['dirPath'])

  // ssh表单
  const dialogFormVisible = ref(false)
  // 是否处于ssh模式
  const isSSHMode = ref(false)

  const devStore = useDevStore()

  // 获取用户名
  const userStore = useUserStore()
  const userName = ref(userStore.username)
  
  // 视图显示PATH
  const prefixPath = ref(props.dirPath)

  // 终端实例
  const termboxRef = ref()
  const terminal = ref<HTMLElement>()
  const term = ref<Terminal>(new Terminal({
    // lineHeight: 1.2,
    fontSize: 14,
    fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
    theme: {
      background: '#181d28'
    },
    // 光标闪烁
    cursorBlink: true,
    cursorStyle: 'underline',
    convertEol: true
    // scrollback: 100,
    // tabStopWidth: 4,
  }))
  const fitAddon = new FitAddon()

  // 终端高度
  const termHeight = ref(30)
  const termFontSize = ref(14)

  let termWs = ref(new Ws('/micro/webui/term'))

  /**
   * 改变高度
   * @returns
   */
  const changeTermHeight = (rows:number) => {
    term.value && term.value.resize(term.value.cols,rows)
  }

  // const changeTermFontSize = (size:number) => {
  //   term.value.setOption && term.value.setOption('fontSize', size)
  // }

  /**
   * 全屏模式
   * @returns
   */
  const toggleFullScreen = (elem:HTMLElement) => {  
    // 检查传入的元素是否存在  
    if (!elem) {  
      console.error('需要传入一个元素');  
      return;  
    }  
    
    // 检查该元素是否已经是全屏状态  
    if (!document.fullscreenElement) {  
      // 如果不是全屏，尝试进入全屏  
      if (elem.requestFullscreen) {  
        elem.requestFullscreen().catch(err => {  
          console.error('全屏请求失败:', err);  
        });  
      } else {  
        console.error('当前浏览器不支持全屏API');  
      }  
    } else {  
      // 如果已经是全屏，则退出全屏  
      if (document.exitFullscreen) {  
        document.exitFullscreen();  
      }  
    }  
    fitTerm()
  }; 
  
  /**
   * 终端输入触发事件
   * @returns
   */
  const termData = () => {
    // 输入与粘贴的情况,onData不能重复绑定,不然会发送多次
    let cache = ''

    term.value.onData((data) => {
      
      if(data.endsWith('\n') || data.endsWith('\r') || data.endsWith('\x0D')) {
        const input = cache.replace('\r','').replace('\n','')
        if(input) {
          try {
            if(isSSHMode.value == false) {
              termWs.value.sendWs(JSON.stringify(
                {
                  type: 'exec',
                  params: {
                    cmd: input,
                    path: null
                  },
                }
              ))
            } else {
              termWs.value.sendWs(JSON.stringify(
                {
                  type: 'ssh',
                  params: {
                    cmd: input,
                    path: null
                  },
                }
              ))
            }
          } catch(err) {
            err && term.value.write(JSON.stringify(err))
          }
        }
        
        cache = ''
        term.value.write(data)
        term.value.write('\n')
        if(isSSHMode.value == false) {
          term.value.write(`\x1B[36;1m ${userName.value} <\x1B[36m${prefixPath.value}>\x1B[36;1m ~\x1B[0m $ `)
        }
        
      } else if(data === '\x08' || data === '\x7F') {
        cache = cache.slice(0, -1)
        term.value.write('\b \b')
        
      } else {
        cache += data
        term.value.write(data)
      }
      // console.log(cache, '输入')
    })

  }
  
  // // 是否连接中0 1 2 3 状态
  // const isWsOpen = () => {
  //   const readyState = terminalSocket.value && terminalSocket.value.readyState
  //   return readyState === 1
  // }
  
  /**
   * 适应浏览器尺寸变化
   * @returns
   */
  const fitTerm = () => {
    fitAddon.fit()
  }
  const onResize = debounce(() => fitTerm(), 500)
  const onTerminalResize = () => {
    window.addEventListener('resize', onResize)
  }
  const removeResizeListener = () => {
    window.removeEventListener('resize', onResize)
  }

  /**
   * 获取路径差
   * @returns
   */
  const comparePaths = (path1:string, path2:string) => {  
    // 使用split('/')分割路径，并过滤掉空字符串（由连续的'/'导致）  
    const segments1 = path1.split('/').filter(segment => segment !== '');  
    const segments2 = path2.split('/').filter(segment => segment !== '');  
  
    // 计算两个路径的层级差  
    const diff = segments2.length - segments1.length;  
  
    if (diff === 0) {  
        // 如果层级相同，直接返回path2（或根据实际情况处理）  
        return "路径层级相同，返回第二个路径: " + path2;  
    } else if (diff > 0) {  
        // 如果path2比path1多几级，返回多出的部分  
        return segments2.slice(segments1.length).join('/');  
    } else {  
        // 如果path2比path1少几级，用'..'代替每缺少的一级  
        return '../'.repeat(-diff) + segments2.join('/');  
    }  
  }
  
  /**
   * 连接ws
   * @returns
   */
  const openWs = async() => {

    await termWs.value.openWs('',()=>{
      termWs.value.sendWs(JSON.stringify(
        {
          type: 'exec',
          params: {
            cmd: 'cd',
            path: props.dirPath
          },
        }
      ))
    })
  }

  /** 连接SSH */
  const handleConnectSSH = async() => {
    try {
      await devStore.connectSSH()
      termWs.value.closeWs()
      isSSHMode.value = true
      await termWs.value.openWs('',()=>{
        termWs.value.sendWs(JSON.stringify(
          {
            type: 'ssh',
            params: {},
          }
        ))
      })
      dialogFormVisible.value = false
    } catch(err) {

    }
  }

  watch(()=>termWs.value.msgQueue,(stdout) => {
    const line = stdout[stdout.length - 1]
    if(line.type == 'ssh') {
      isSSHMode.value = true
    } else {
      isSSHMode.value = false
    }

    if(line.action == "meta") {
      if(line.type == 'ssh') {
        isSSHMode.value = true
        term.value.write('\n\n')
      }
      return
    }
    term.value.write(line.params)
    // ssh登出
    if(line.params?.includes('logout')) {
      isSSHMode.value = false
      termWs.value.sendWs(JSON.stringify({
        type: 'ssh',
        params: {
          cmd: 'logout',
          path: null
        }
      }))
    }
    // 更新路径前缀
    if(line.params?.startsWith('UpdateCwd:')) {
      prefixPath.value = line.params.replace('UpdateCwd:','')
      term.value.write('\n')
      term.value.write(`\x1B[36;1m ${userName.value} <\x1B[36m${prefixPath.value}>\x1B[36;1m ~\x1B[0m $ `)
    }

  },{deep:true})

  onMounted(() => {
      term.value.open(terminal.value as HTMLElement);
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ 欢迎使用小微终端!\r\n`)
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ 默认使用exec执行命令，如连接远程服务器，请点击ssh按钮使用ssh连接!\r\n`)
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ 注意：ssh会话中使用快捷键时，需要回车！！例如：\r\n`)
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ ssh会话中使用【ctrl + c + Enter】终止应用程序运行！\r\n`)
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ ssh会话中使用【ctrl + ad + Enter】退出ssh连接！\r\n`)
      term.value.write(`\x1B[36;1m Systerm ~\x1B[0m $ cd ${props.dirPath}`)
      openWs()
      term.value.loadAddon(fitAddon)
      fitTerm()
      onTerminalResize()
      termData()
  })
  
  onBeforeUnmount(() => {
    termWs.value.closeWs()
    removeResizeListener()
  })

</script>
<style lang="scss" scoped>
  .terminal {
    width: 100%;
    height: calc(100% - 62px);
  }
  .setting-bar {
    width: 100%; 
    display: flex;
    margin-bottom: 5px;
  }
</style>