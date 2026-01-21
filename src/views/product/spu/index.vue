<template>
  <div>
    <!-- 三级分类 -->
     <Category :scene="scene"></Category>
     <el-card style="margin: 10px 0;">
      <div v-show="scene==0">
         <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">添加SPU</el-button>
      <el-table style="margin: 10px 0;" border :data="records">
        <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="SPU操作">
          <template #="{row}">
            <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
            <el-button type="primary" size="small" icon="Edit" title="修改SKU" @click="updateSpu(row)"></el-button>
            <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
            <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
               </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3,5,7,9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes , total"
        :total="total"
        @change="getHasSpu"
      />
      </div>
      <spuForm ref="spu" v-show="scene==1" @changeScene="changeScene"></spuForm>
      <skuForm ref="sku" v-show="scene==2" @changeScene="changeScene"></skuForm>
      <!-- dialog对话框：展示已有的SKU数据 -->
       <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{row}">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;"/>
            </template>
          </el-table-column>
        </el-table>
       </el-dialog>
     </el-card>
  </div>
</template>

<script setup lang="ts">
import Category from "../../../components/Category/index.vue"
import { onBeforeUnmount, ref,watch } from 'vue'
import useCategoryStore from "../../../store/modules/category"
import { reqHasSpu, reqRemoveSpu, reqSkuList } from "../../../api/product/spu"
import { type SkuData, type HasSpuResponseData, type Records, type SkuInfoData } from "../../../api/product/spu/type"
import skuForm from "./skuForm.vue"
import spuForm from "./spuForm.vue"
import type { SpuData } from "../../../api/product/spu/type"
import { ElMessage } from "element-plus"
import { el } from "element-plus/es/locales.mjs"
const categoryStore = useCategoryStore()
const scene = ref<number>(0)//0:spu展示 1：添加或修改spu 3:添加sku
const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const records = ref<Records>([])
const total = ref<number>(0)
const spu = ref<any>()
const sku = ref<any>()
const skuArr = ref<SkuData[]>([])
const show = ref<boolean>(false)
watch(() => categoryStore.c3Id, () => {
  if(!categoryStore.c3Id) return
  getHasSpu()
})
//获取某一个三级分类下所有的数据
const getHasSpu =  async() => {
  const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)  
}
const changeScene = (num: number)=> {
  //子组件spuform点击取消变为场景0：展示已有spu
  scene.value = num
  //再次获取全部的SPU
  getHasSpu()
}
const addSku = (row:SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id,categoryStore.c2Id,row)
}
const findSku = async(row:SpuData) => {
  const result: SkuInfoData = await reqSkuList((row.id as number))
  if(result.code === 200){
    skuArr.value = result.data
    show.value = true
  }
}
const deleteSpu = async(row:SpuData) => {
  const result = await reqRemoveSpu(row.id as number)
  if(result.code === 200){
    ElMessage.success('删除成功')
    getHasSpu()
  }else{
    ElMessage.error('删除失败')
  }
}
//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped>

</style>