<template>
  <QQCard>
    <div class="introduction">
        <img class="introduction-avatar" src="https://q1.qlogo.cn/g?b=qq&s=0&nk=1593519730"/>
        <div class="introduction-content">
            <div class="introduction-content-left">
                <span style="font-size: 14px;">沙箱测试群</span>
            </div>
            <div class="introduction-content-right">
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>
    </div>
  </QQCard>
  <QQCard>
    <div class="group-members">
        <div class="group-members-title">
            <span>群聊成员</span>
            <span class="card-desc">查看{{ group_size }}名群成员</span>
            <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="group-members-list">
            <div class="group-members-item" v-for="item in 10" :key="item">
                <img class="group-members-item-avatar" src="https://q1.qlogo.cn/g?b=qq&s=0&nk=1593519730">
                <div class="group-members-item-nickname">
                    {{ nickname }}
                </div>
            </div>
            <div class="group-members-item">
                <div class="group-members-item-avatar">
                    <el-icon><Plus /></el-icon>
                </div>
                <div class="group-members-item-nickname">
                    邀请
                </div>
            </div>
            <div class="group-members-item">
                <div class="group-members-item-avatar">
                    <el-icon><Minus /></el-icon>
                </div>
                <div class="group-members-item-nickname">
                    移除
                </div>
            </div>
        </div>
    </div>
  </QQCard>
  <div class="card-title">群聊信息</div>
  <QQCard>
    <div class="card-list-item">
        <span>群聊名称</span>
        <span class="card-desc">{{ group_name }}</span>
        <el-icon><ArrowRight /></el-icon>
    </div>
    <div class="card-list-divider"></div>
    <div class="card-list-item">
        <span>群号</span>
        <span class="card-desc">{{ group_id }}</span>
        <el-icon><ArrowRight /></el-icon>
    </div>
    <div class="card-list-divider"></div>
    <div class="card-list-item">
        <span>我的本群昵称</span>
        <span class="card-desc">{{ card }}</span>
        <el-icon><ArrowRight /></el-icon>
    </div>
  </QQCard>
  <div class="card-title">群聊会话</div>
  <QQCard>
    <div class="card-list-item">
        <span>查找聊天记录</span>
        <span class="card-desc">图片、视频、文件等</span>
        <el-icon><ArrowRight /></el-icon>
    </div>
    <div class="card-list-divider"></div>
    <div class="card-list-item">
        <span>设为置顶</span>
        <span class="card-desc">
            <el-switch v-model="isTop" class="ml-2" size="small"/>
        </span>
    </div>
  </QQCard>
  <QQCard>
    <div class="dismiss-group">解散群聊</div>
  </QQCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QQCard from './components/qqcard.vue';
import { number } from 'echarts';

const isTop = ref(false)

const props = defineProps({
    /** 当前会话场景，'group','private','guild' */
    chat_type: {type: String, default: 'group'},
    group_size: {type: Number, default: 11},
    group_id: {type: Number, default: 114514},
    nickname: {type: String, default: '未知'},
    group_name: {type: String, default: '群聊沙箱'},
    card: {type: String, default: '未知'},
})

</script>

<style lang="scss" scoped>
.card-title {
    margin-left:15px; 
    font-size: 12px; 
    color: #7F7F7F;
}
.card-desc {
    margin-left: auto; 
    margin-right: 5px;
    font-size: 12px; 
    color: #7F7F7F;
}
.card-list-divider {
    width: 100%;
    height: 0.5px;
    margin: 10px 0;
    background-color: #d3d3d397;
}
.card-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 15px;
}
.introduction {
    display: flex;
    width: 100%;
    height: 40px;
    // padding: 5px;
    .introduction-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .introduction-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 10px;
        width: 100%;
    }
}
.group-members {
    .group-members-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    .group-members-list {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        flex-wrap: wrap;
        // border: 2px solid red;
        .group-members-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 50px;
            
            .group-members-item-avatar {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #E8E8E8;
            }
            .group-members-item-nickname {
                margin: 8px 0 12px;
                width: 100%;
                text-align: center;
                font-size: 10px;
                // border: 2px solid red;
            }
        }
    }
}
.dismiss-group {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: red;
}

</style>
