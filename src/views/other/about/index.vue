<template>
    <div class="card_box">
        <personal-card 
            v-for="(c,index) in contributors"
            :key="index"
            :author="c.author" 
            :avatar="c.avatar"
            :content="c.content" 
            :qq="c.qq"
            :github="c.github"
            :gitee="c.gitee" 
        />
        
    </div>
</template>

<script setup lang="ts">
import PersonalCard from './card.vue'
import contributors from '@/contributors';

</script>

<style scoped lang="scss">
.card_box {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
}
@media (orientation: portrait) {
    .card_box {
        justify-content: center;
    }
}

</style>