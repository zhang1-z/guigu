<template>
  <div class="layout_container">

    <div class="layout_slider">
      <logo />
      <!-- 展示菜单 -->
       <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
         <el-menu background-color="#001529" text-color="white">
           <el-menu-item index="1">首页</el-menu-item>
           <el-menu-item index="2">数据大屏</el-menu-item>
           <!-- 折叠菜单 -->
            <el-sub-menu index="3">
              <template #title>
                <span>权限管理</span>
              </template>
              <el-menu-item index="3-1">用户管理</el-menu-item>
              <el-menu-item index="3-2">角色管理</el-menu-item>
              <el-menu-item index="3-3">菜单管理</el-menu-item>
            </el-sub-menu>

         </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar"></div>
    <div class="layout_main">
      <p style="height: 10000px;">我是段落标签</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
</script>

<style scoped lang="scss">
//全局样式未能解决
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: 260px;
    height: 100vh;
    background: #001539;
    .scrollbar {
      width: 100%;
      height: calc(100vh - 50px);
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - 260px);
    height: 50px;
    background: cyan;
    top: 0;
    left: 260px;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - 260px);
    height: calc(100vh - 50px);
    background: yellowgreen;
    left: 260px;
    top: 50px;
    padding: 20px;
    overflow: auto;
  }
}
</style>