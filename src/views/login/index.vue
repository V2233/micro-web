<template>
  <div class="login_container">
    <login-bg @mouseenter="card = 1" @mouseleave="card = 0">
      <template #content>
        <div class="login_box" v-if="card == 0">
          <div>
            <img class="blinking-image" src="/terminal.png">
          </div>
        </div>

        <div class="login_box" v-if="card == 1">
          <el-form :model="loginForm" :rules="rules" ref="loginForms" style="width: 100%;">
            <h2>Please login!</h2>
            <el-form-item prop="username">
              <el-input class="form_input" :prefix-icon="User" v-model="loginForm.username" :input-style="{
                width: '100%',
              }"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="form_input" :prefix-icon="Lock" show-password type="password"
                v-model="loginForm.password" @keydown.enter="login" style="width: 100%;"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btn_box" @click="login">
                <LoginBtn />
              </div>
            </el-form-item>
            <p>Powered by Yunzai-Bot & Micro-Plugin</p>
          </el-form>

        </div>

      </template>
    </login-bg>
  </div>

</template>

<script setup lang="ts">
// 时间欢迎提示
import { getTime } from '@/utils/time'
// 引入图标
import { User, Lock } from '@element-plus/icons-vue'
// 引入通告
import { ElNotification } from 'element-plus'
// 收集账号密码
import { reactive, ref, onMounted } from 'vue'
// 引入 router
import { useRouter, useRoute } from 'vue-router'

import LoginBg from './bg.vue'
import LoginBtn from './button.vue'

// 引入仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

// 主题
let dark = ref<boolean>(true)
const card = ref(0)

// 登录信息
let loginForm = reactive({ username: 'admin', password: '114514' })
// 按钮进度条
let loading = ref(false)
// 获取表单验证实例
let loginForms = ref()

/** 表单校验规则
 * @params rule 规则对象
 * @params value 校验值
 */
const validatorUsername = (rule: any, value: any, callback: any) => {
  // if(/^\d{5,10}/.test(value)) {
  // console.log(value)
  if (value.length >= 2 && value.length <= 20) {
    callback()
  } else {
    callback(new Error('账号长度2-20位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  // if(/^\d{5,10}/.test(value)) {
  if (value.length >= 5 && value.length <= 20) {
    callback()
  } else {
    callback(new Error('密码长度5-20位'))
  }
}

const rules = reactive({
  username: [
    {
      trigger: 'change',
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
})

// 点击登录
const login = async () => {
  await loginForms.value.validate()

  loading.value = true
  // 通知仓库发送登录请求
  try {
    await useStore.userLogin(loginForm)
    // $router.push('/')
    // 判断路由是否含有重定向
    $router.push({
      path: ($route.query.redirect as any) || '/',
    })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
    loading.value = false
  } catch (err) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (err as Error).message,
    })
  }
  // 请求成功，跳转数据页

  // 失败
}

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  html.className = 'dark'
}

onMounted(() => {
  changeDark()
})
</script>

<style scoped lang="scss">
.login_container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding: 40px;
  z-index: -50;

  .login_box {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 80;

    h2 {
      font-size: 20px;
      color: rgb(29, 255, 225);
      margin: 20px 0;
    }

    .btn_box {
      margin-top: 5px;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    p:last-child {
      font-size: 13px;
      line-height: 18px;
      color: #1cffca;
      font-weight: 600;
    }

    .blinking-image {
      // border: 2px solid red;
      height: 200px;
      animation: blink 1.2s infinite;
      /* 动画名称、持续时间、重复次数 */
    }

    @keyframes blink {

      0%,
      100% {
        opacity: 1;
      }

      30%,
      60% {
        opacity: 0;
      }
    }
  }

  h1 {
    color: white;
    font-size: 40px;
  }

  .login_btn {
    width: 100%;
  }

}
</style>
