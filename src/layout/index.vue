<template>
  <div class="layout_container">

    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold ? true :false}">
      <logo />
      <!-- 展示菜单 -->
       <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
         <el-menu :collapse="LayOutSettingStore.fold ? true :false" :default-active="route.path" background-color="#001529" text-color="white">
          <Menu :menuList="userStore.menuRoutes"></Menu>
         </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true :false}">
      <Tabbar />
    </div>
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true :false}">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import { useRoute } from 'vue-router'
//获取用户相关的小仓库
import useUserStore from '../store/modules/user'
import useLayOutSettingStore from '../store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let route = useRoute()
</script>

<style scoped lang="scss">
//全局样式未能解决
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    color: white;
    width: 260px;
    height: 100vh;
    background: #001539;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - 50px);
      .el-menu {
        border-right: none;
      }
    }

  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - 260px);
    height: 50px;
    top: 0;
    left: 260px;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - 260px);
    height: calc(100vh - 50px);
    left: 260px;
    top: 50px;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
     &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }
}
</style>