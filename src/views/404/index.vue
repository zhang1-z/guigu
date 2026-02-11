<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="">
    <button @click="goHome">首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<style scoped lang="scss"> 
.box {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: yellowgreen;
  img{
    width: 800px;
    height: 400px;
  }
  button{
    width: 50px;
    height: 50px;
    background-color: white;
  }
}
</style>