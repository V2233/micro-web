<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page-slide">
      <!-- 渲染layout以及路由组件的子路由 -->
      <div class="com" :key="route.fullPath">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

import useLayoutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayoutSettingStore()

// 监听仓库数据变化
watch(
  () => layoutSettingStore.refresh,
  () => {
    // 页面刷新时重新渲染组件
    const comElement = document.querySelector('.com')
    if (comElement) {
      comElement.classList.remove('page-slide-enter-active')
      nextTick(() => {
        comElement.classList.add('page-slide-enter-active')
      })
    }
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped lang="scss">
// 页面切换动画 - 向右划出 + 从右侧划入
// Out Sine缓动函数: cubic-bezier(0.61, 1, 0.88, 1)
.page-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.page-slide-enter-active {
  transition: all 1s cubic-bezier(0.61, 1, 0.88, 1);
}
.page-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.page-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.page-slide-leave-active {
  transition: all 1s cubic-bezier(0.61, 1, 0.88, 1);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.com {
  /* 确保动画效果正确显示，两个页面能够重叠 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
