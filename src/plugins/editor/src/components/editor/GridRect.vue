<template>
  <div class="grid-rect" :style="rectStyle">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern v-if="showSmall" :id="smallGridId" :width="grid" :height="grid" patternUnits="userSpaceOnUse">
          <path :d="`M ${grid} 0 L 0 0 0 ${grid}`" fill="none" :stroke="color.grid" stroke-width="0.5" />
        </pattern>
        <pattern :id="gridId" :width="bigGrid" :height="bigGrid" patternUnits="userSpaceOnUse">
          <rect v-if="showSmall" :width="bigGrid" :height="bigGrid" :fill="`url(#${smallGridId})`" />
          <path :d="`M ${bigGrid} 0 L 0 0 0 ${bigGrid}`" fill="none" :stroke="color.bigGrid" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${gridId})`" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MColor from 'color'
import { useId } from '../../utils'
import { useEditorStore } from '../../store'
const store = useEditorStore()
const props = defineProps({
  grid: {
    // 小网格的大小
    type: Number,
    default: 10
  },
  gridCount: {
    // 小网格的数量，默认为5个
    type: Number,
    default: 5
  },
  showSmall: {
    // 是否显示小网格
    type: Boolean,
    default: true
  },
  borderColor: {
    type: String
  },
  smallGridId: String,
  gridId: String
})

const smallGridId = computed(() => props.smallGridId || useId('smallGrid'))
const gridId = computed(() => props.gridId || useId('grid'))

// 计算大网格的大小
const bigGrid = computed(() => props.grid * props.gridCount)

// 处理网站皮肤，可忽略
const color = computed(() => {
  if (props.borderColor) {
    return {
      bigGrid: props.borderColor,
      grid: MColor(props.borderColor).fade(0.5).rgb().string()
    }
  }
  const colors = [
    ['#e4e7ed', '#ebeef5'],
    ['#414243', '#363637']
  ]
  const [bigGrid, grid] = colors[store.theme === 'light' ? 0 : 1]
  return { bigGrid, grid }
})

const rectStyle = computed(() => ({ '--border-color': color.value.bigGrid }))

</script>

<style lang="scss" scoped>
.grid-rect {
  width: 100%;
  height: 100%;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
</style>
