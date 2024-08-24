<template>
     <div v-html="markdownToHtml" class="sandbox-markdown-body"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked';
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps(['mdContent'])

const render = new marked.Renderer()
marked.setOptions({
  renderer: render, // 这是必填项
  gfm: true,	// 启动类似于Github样式的Markdown语法
  pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
  tables: true,
  breaks: false,
  smartLists: true,
  smartpants: false,
  // highlight: (code, lang) => hljs.highlight(code, { language: hljs.getLanguage(lang)??'plaintext' }).value,
})

const markdownToHtml = ref("")
markdownToHtml.value = marked(props.mdContent) as string

const change = (value: string) => {
  markdownToHtml.value = marked(value) as string
}

// watch(()=>markdownToHtml.value,(newValue)=>{
    
// },{immediate:true})

onMounted(()=>{
  console.log(markdownToHtml.value)
  hljs.highlightAll()
})

</script>

<style lang="scss">
.sandbox-markdown-body {
  pre {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  pre code {
    padding: 5px;
    border-radius: 5px;
    background-color: #eceff7c7;
  }
  img {
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    width: 100%;
  }
}
</style>