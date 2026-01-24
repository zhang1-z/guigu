<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0;" :data="skuArr">
        <el-table-column label="序号" type="index" align="center" width="120px"></el-table-column>
        <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
        <el-table-column label="描述" show-overflow-tooltip width="200px" prop="skuDesc"></el-table-column>
        <el-table-column label="图片" width="200px">
          <template #="{row}">
             <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="重量" width="200px" prop="weight"></el-table-column>
        <el-table-column label="价格" width="200px" prop="price"></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template #="{row}">
            <el-button type="primary" size="small" :icon="row.isSale==1?'Bottom':'Top'" @click="updateSale"></el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
            <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.skuName}`" width="200px" @confirm="removeSku(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @change="handler"
      />
      <el-drawer v-model="drawer">
        <template #header>
          <h4>查看商品详细</h4>
        </template>
        <template #default>
          <el-row style="margin:10px 0">
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{skuInfo.skuName}}</el-col>
          </el-row> 
          <el-row style="margin:10px 0">
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{skuInfo.skuDesc }}</el-col>
          </el-row> 
          <el-row style="margin:10px 0">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{skuInfo.price}}</el-col>
          </el-row> 
          <el-row style="margin:10px 0">
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag v-for="item in skuInfo.skuAttrValueList" style="margin:5px" :key="item.id">{{ item.valueName }}</el-tag>
            </el-col>
          </el-row> 
            <el-row style="margin:10px 0">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag v-for="item in skuInfo.skuSaleAttrValueList" style="margin:5px" :key="item.id">{{ item.saleAttrValueName }}</el-tag>
            </el-col>
          </el-row> 
          <el-row style="margin:10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <!-- <el-carousel height="150px"> -->
              <!-- <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id"> -->
                <img :src="skuInfo.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
              <!-- </el-carousel-item> -->
            <!-- </el-carousel> -->
          </el-col>
          </el-row> 
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqCanCelSale, reqSaleSku, reqSkuList } from '../../../api/product/sku';
import type { SkuResponseData, SkuData } from '../../../api/product/sku/type';
import { ElMessage } from 'element-plus';
import { reqRemoveAttr } from '../../../api/product/attr';

const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const drawer = ref<boolean>(false)
const skuInfo = ref<any>({})

const getHasSku = async() => {
  const result:SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if(result.code ==200){
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const handler = () => {
  getHasSku()
}
const updateSale = async (row:SkuData) => {
  if(row.isSale == 1){
    await reqCanCelSale((row.id as number))
    ElMessage.success('下架成功')
    getHasSku()
  }else{
    await reqSaleSku((row.id as number))
    ElMessage.success('上架成功')
    getHasSku()
  }
}
const updateSku = () => {
  ElMessage.success('程序员在努力的更新中...')
}
const findSku = (row:SkuData) => {
  drawer.value = true
  skuInfo.value = row
}
const removeSku = async(id:number) => {
  const result = await reqRemoveAttr(id)
  if(result.code == 200){
    ElMessage.success('删除成功')
    getHasSku()
  }else{
    ElMessage.error('系统数据不能删除')
  }
}

onMounted(() => {
  getHasSku()
})
</script>

<style scoped>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>