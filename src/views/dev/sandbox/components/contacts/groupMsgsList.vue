<template>
    <div
        class="message-room-list" 
        :class="[(devStore[devStore.curAdapter].cur_message_type == 'group' && devStore[devStore.curAdapter].cur_group_id == row.group_id)?'message-room-list-selected':'']"
        v-for="(row,index) in devStore[devStore.curAdapter].group_list" 
        :key="index" 
        @click="$emit('click-group',row)"
    >
        <img class="message-room-avatar" :src="`https://p.qlogo.cn/gh/${row.group_id}/${row.group_id}/640`"/>
        <div class="message-room-info">
        <div class="message-room-info-top">
            <span class="message-room-info-top-content">{{ row.group_name }}</span>
            <span style="font-size: 12px;">
                {{ getFormatDate(new Date(row.msg_queue[row.msg_queue.length - 1]?.time * 1000),3) }}
            </span>
        </div>
        <div class="message-room-info-bottom">
            <div class="message-room-info-bottom-content">
            {{ row.msg_queue[row.msg_queue.length - 1]?.sender?.card }}
            <span v-if="row.msg_queue.length > 0"></span>
            {{ row.msg_queue[row.msg_queue.length - 1]?.raw_message }}
            </div>
            <el-badge  
            class="item"
            v-if="row.msg_queue.length > 0"
            :value="row.msg_queue.length" 
            :max="99" >
            </el-badge>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getFormatDate } from '@/utils/time'
import useDevStore from '@/store/modules/dev';

const $emit = defineEmits(['click-group'])

const devStore = useDevStore()
const props = defineProps({
    group_list: { type: Array, default: [] },
})

</script>

<style lang="scss" scoped>
  .message-room-list {
    // border: 2px solid red;
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    .message-room-avatar {
      margin-left: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .message-room-info {
      margin-left: 10px;
      width: calc(100% - 76px);
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .message-room-info-top,.message-room-info-bottom {
        width: 100%;
        height: 18px;
        display: flex;
        justify-content: space-between;
      }
      .message-room-info-top {
        .message-room-info-top-content {
          font-size: 14px;
          width: calc(100% - 50px); 
          display: inline-block; 
          text-overflow: ellipsis; 
          overflow: hidden; 
          white-space: nowrap;
        }
      }
      .message-room-info-bottom {
        .message-room-info-bottom-content {
          font-size: 12px; 
          width: calc(100% - 30px); 
          display: inline-block; 
          text-overflow: ellipsis; 
          overflow: hidden; 
          white-space: nowrap;
        }
      }
    }
  }

  .message-room-list:hover {
    background-color: #F5F5F5;
  }

  .message-room-list-selected {
    background-color: #0099FF;
  }
</style>