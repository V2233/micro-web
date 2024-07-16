<template>
  <div class="plugins_box" v-if="devStore.scene == 0">
    <el-card>
      <div class="top_bar">
        <div class="sub-title">指令列表</div>
        <el-button type="primary" icon="Plus" @click="goAddPlugin">
          添加指令
        </el-button>
      </div>

      <el-table :data="pluginsList">
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column label="指令">
          <template #="{ row, $index }">
            {{ row.reg }}
          </template>
        </el-table-column>

        <el-table-column label="消息类型">
          <template #="{ row, $index }">
            <span style="font-size: 12px">[{{ (row.message.map((item: any) => item.type)).join(',') }}]</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #="{ row, $index }">
            <span style="font-size: 12px">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="120px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="goEditPlugin($index)"></el-button>
            <el-popconfirm title="删除后不可恢复，您确定吗？" @confirm="deletePlugin($index)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 插件编辑器 -->
  <div class="Plugin_editor" v-if="devStore.isPluginEdited">
    <PluginEditor :editedPluginValue="editedPluginValue" @save-plugin="updatePluginsList" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqPluginsList, reqDeletePlugin } from '@/api/dev/plugin'
import type { pluginType, pluginResponseType } from '@/api/dev/plugin/type'
import useDevStore from '@/store/modules/dev'
import PluginEditor from './pluginEditor/index.vue'
import { getFormatDate } from '@/utils/time'

const devStore = useDevStore()

const pluginsList = ref<pluginType[]>([])

const editedPluginValue = ref({
  id: '',
})

onMounted(() => {
  getPluginsList()
})

/**
 * 获取插件列表
 * @returns
 */
const getPluginsList = async () => {
  let res: pluginResponseType = await reqPluginsList()
  console.log(res)
  if (res.code == 200) {
    pluginsList.value = res.data
  }
}

/**
 * 添加插件
 * @returns
 */
const goAddPlugin = () => {
  ; (devStore.isPluginEdited = true), (devStore.scene = 1)
  devStore.curEditedMode = 'add'
  editedPluginValue.value.id = getFormatDate()
  devStore.curPluginId = editedPluginValue.value.id
}

/**
 * 编辑插件
 * @param index 插件索引
 * @returns
 */
const goEditPlugin = (index: number) => {
  ; (devStore.isPluginEdited = true), (devStore.scene = 1)
  devStore.curEditedMode = 'update'
  // pluginsList.value[index].id = String(index)
  editedPluginValue.value = pluginsList.value[index]
}

/**
 * 处理子组件保存事件
 * @param e 更新后的插件列表
 * @returns
 */
const updatePluginsList = (e: pluginType[]) => {
  pluginsList.value = e
}

/**
 * 删除插件
 * @param index 插件索引
 * @returns
 */
const deletePlugin = async (index: number) => {
  let res: pluginResponseType = await reqDeletePlugin(index)
  console.log(res)
  if (res.code == 200) {
    pluginsList.value = res.data
  }
}
</script>

<style scoped lang="scss">
.top_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sub-title {
    position: relative;
    height: 24px;
    width: 100px;
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    align-items: center;
    margin-bottom: 15px;
  }
}
</style>
