<template>
  <el-card style="margin: 10px 0">
    <el-form>
      <el-form-item>实验性，请跳过该模块...</el-form-item>
    </el-form>
    <el-input v-model="extendedName" />
    <el-button @click="getSearchPath" style="margin-top: 10px">
      点击筛选包含特定关键词的文件分支
    </el-button>
    <Editor v-if="treeCode" :code="treeCode" ext="json" />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reqFilterDirTree } from '@/api/dev/fs/index'
import Editor from '../../dev/fs/codeEditor.vue'
import { reqBotWorkURI } from '@/api/dev/plugin'
import type { botURIResponseType } from '@/api/dev/plugin/type'

const extendedName = ref('')

const treeCode = ref('')

const searchPath = ref('')

const getFilteredTree = async () => {
  console.log(extendedName.value)

  if (extendedName.value == '') {
    ElMessage.error('筛选条件为空！')
    return
  }
  
  let res = await reqFilterDirTree(
    searchPath.value + '/plugins',
    extendedName.value,
  )
  if (res.code == 200) {
    console.log(res.data)
    treeCode.value = res.data
  }
}

const getSearchPath = async () => {
  let res: botURIResponseType = await reqBotWorkURI()
  if (res.code == 200) {
    treeCode.value = res.data.replace(/^file:\/\/\//, '')
    
  }
}

onMounted(() => {
  // getSearchPath()
})
</script>
