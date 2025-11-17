<template>
  <el-icon style="margin-right: 10px;" @click="changeIcon">
    <component :is="LayOutSettingStore.fold? Fold : Expand"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item v-for="(item,index) in route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <!-- 图标 -->
       <el-icon>
         <component :is="item.meta.icon"></component>
       </el-icon>
       <!-- 面包屑展示匹配路由的标题 -->
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { Fold,Expand } from '@element-plus/icons-vue'
import useLayOutSettingStore from '../../../store/modules/setting'
import { useRoute} from 'vue-router'
let LayOutSettingStore = useLayOutSettingStore()
const route = useRoute()
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<style scoped>

</style>