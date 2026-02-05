<template>
  <div>
    <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '../../store/modules/user'
import { getTime } from '../../utils/time'
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title{
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: grey;
    }
  }
}
</style>