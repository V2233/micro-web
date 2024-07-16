<template>
    <div class="card_box">
        <personal-card author="Smallv" avatar="https://q1.qlogo.cn/g?b=qq&s=0&nk=2330660495"
            content="此仓库鼓励贡献代码，插件修改和使用无需向作者授权，未经允许严禁商用，您可点击名片查看仓库" :contact="contact" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PersonalCard from './card.vue'

const contact = reactive({
    github: 'https://github.com/V2233/micro-plugin',
    gitee: 'https://gitee.com/V2233/micro-plugin',
    qq: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=6qeMfgydE5k8e_nTorXz0ywmahixBTFw&authKey=9iCyC5qsuluUfxwz4evh5xPmJb3YwlixjoMTxN9He%2BrGu7WiDf2dY8OGk7t%2BGaIu&noverify=0&group_code=397798018',
})

</script>

<style>
.card_box {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-self: center;
    align-items: center;
}

a:hover {
    cursor: pointer;
}
</style>