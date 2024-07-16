<template>
  <DashboardCard title="面板设置">
    <template #content>
      <div class="setting-box">
        <div class="settings">
          <div class="slider-demo-block">
            <span class="demonstration">自动滚动</span>
            <el-switch
              v-model="screenStore.settings.isAutoScroll"
              class="mb-2"
              size="large"
              style="--el-switch-on-color: cyan"
            />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">字体大小</span>
            <el-slider
              v-model="screenStore.settings.fontSize"
              :min="12"
              :max="50"
            />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">图片宽度</span>
            <el-slider
              v-model="screenStore.settings.imageWidth"
              :min="50"
              :max="940"
            />
          </div>

          <div class="slider-demo-block">
            <span class="demonstration">流量单位</span>
            <el-slider
              v-model="screenStore.settings.qpsInterval"
              :min="1"
              :max="60"
            />
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/dashboard/index.vue'
import useScreenstore from '@/store/modules/screen'
import { ref, onMounted } from 'vue'

const screenStore = useScreenstore()

const imageWidth = ref(400)

const fontSize = ref(20)

const qpsInterval = ref(1)

//组件挂载完毕
onMounted(() => {})
</script>

<style scoped lang="scss">
.setting-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .settings {
    height: 80%;
    width: 80%;
    font-size: 20px;
    color: white;
  }
}

.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>
