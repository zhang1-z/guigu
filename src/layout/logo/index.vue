<template>
  <div class="logo" v-if="!setting.logoHidden"> 
    <img :src="setting.logo" alt="">
    <p v-show="!LayOutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '../../setting'
import useLayOutSettingStore from '../../store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: 50px;
  color: white;
  display: flex;
  padding: 20px;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: 20px;
    margin-left: 10px;
  }
}
</style>