<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select :disabled="scene==1" placeholder="请输入" style="width: 240px;" v-model="categoryStore.c1Id" @change="handler">
            <el-option v-for="(c1,index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="二级分类">
          <el-select :disabled="scene==1" placeholder="请输入" style="width: 240px;" v-model="categoryStore.c2Id" @change="hanlder1">
            <el-option v-for="(c2,index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="三级分类">
          <el-select :disabled="scene==1" placeholder="请输入" style="width: 240px;" v-model="categoryStore.c3Id">
            <el-option v-for="(c3,index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useCategoryStore from '../../store/modules/category'
const categoryStore = useCategoryStore()
onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()  
}
const handler = () => {
  //清空二级、三级分类的数据
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
const hanlder1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
//接受父组件传递过来的scene
defineProps(['scene'])
</script>

<style scoped>

</style>