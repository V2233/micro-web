<template>
  <el-form :model="store.current" label-width="80px" label-position="left"
    v-if="store.current && store.current.selected">
    <div class="color-list">
      <div v-for="style in itemList" class="color-item" :style="style" @click="handleColorClick(style)"></div>
    </div>

    <!-- <el-divider /> -->

    <template v-if="store.current.style">
      <Background v-model="elementBg" />
      <el-divider />

      <el-row :gutter="10">
        <el-col :span="10">透明度:</el-col>
        <el-col :span="14">
          <el-slider :modelValue="1" :step="0.01" :min="0" :max="1" size="small" @input="onChange('opacity', $event)" />
        </el-col>
      </el-row>

      <!-- <el-row :gutter="10">
        <el-col :span="10">磨砂玻璃:</el-col>
        <el-col :span="14">
          <el-slider :modelValue="1" :step="0.1" :min="0" :max="10" size="small"
            @input="onChange('backdropFilter', $event)" />
        </el-col>
      </el-row> -->

      <el-divider />
      <TextStyle />

      <el-divider />
      <Border />

      <el-divider />
      <Shadow />
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref, CSSProperties, computed } from 'vue'
import TextStyle from './TextStyle.vue'
import { useEditorStore } from '../../../store'
import Background from '../components/Background.vue'
import Border from '../components/Border.vue'
import Shadow from '../components/Shadow.vue'

const store = useEditorStore()
const itemList = ref<CSSProperties[]>([
  { backgroundColor: '#ff4500' },
  { backgroundColor: '#ff8c00' },
  { backgroundColor: '#ffd700' },
  { backgroundColor: '#90ee90' },
  { backgroundColor: '#00ced1' },
  { backgroundColor: '#1e90ff' },
  { backgroundColor: '#c71585' },
  { backgroundColor: 'rgba(255, 69, 0, 0.68)' },
])

const elementBg = computed<any>({
  get: () =>
    store.current.style!.background || store.current.style!.backgroundColor,
  set: (val) => {
    store.current.style!.background = val
  },
})

const handleColorClick = (style: CSSProperties) => {
  if (!store.current.selected) return
  store.current.style = { ...store.current.style, ...style }
}

function onChange(key: string, value: any) {
  ; (store.current.style as any)[key] = value
}
</script>

<style lang="scss" scoped>
.color-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 20px;

  .color-item {
    width: 11%;
    height: 28px;
    margin-top: 10px;
    border-radius: 3px;
  }
}

.es-col {
  display: flex;
  align-items: center;
}

.text-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  :deep(.es-icon) {
    margin-right: 4px;
  }
}
</style>
