<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover
    placement="bottom"
    title="主题设置"
    :width="200"
    trigger="hover"
  >
  <el-form>
    <el-form-item label="主题颜色">
      <el-color-picker @change="setColor" v-model="color" size="small" show-alpha :predefine="predefineColors"/>
    </el-form-item>
    <el-form-item label="暗黑模式">
      <el-switch @change="changeDark" v-model="dark" size="small" active-icon="MoonNight" inactive-icon="Sunny" inline-prompt></el-switch>
    </el-form-item>
  </el-form>
  <template #reference>
    <el-button size="small" icon="Setting" circle></el-button>
  </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px; height: 24px; margin:0 10px;border-radius: 50%;">
  <el-dropdown>
    <span class="el-dropdown-link">
      {{userStore.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '../../../store/modules/setting'
import useUserStore from '../../../store/modules/user'
import { useRouter, useRoute } from 'vue-router'
const layOutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const dark = ref<boolean>(false)
const updateRefresh = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
const fullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是不是全屏模式【全屏：true，不是全屏：false】
  let full = document.fullscreenElement
  //切换全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  }else{
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录点击回调
const logout = async() => {
  //第一件事：需要向服务器发送请求【退出登录接口】
  //第二件事：仓库当中关于用户相关的数据清空【token|username|avatar】
  //第三件事：跳转到登录页面
  await userStore.userLogout()
  router.push({path: '/login', query: {redirect: route.path}})
}
const changeDark = () => {
  const html = document.documentElement
  dark.value?html.className='dark':html.className=''
}
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}


import { ref } from 'vue'

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>

<style scoped>

</style>