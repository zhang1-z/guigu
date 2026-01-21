<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select style="width: 200px;" v-model="SpuParams.tmId">
          <el-option v-for="item in AllTrademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请你输入SPU描述" v-model="SpuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
         <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" style="height: 600px; width: 600px;"/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select v-model="saleAttrIdAndValueName" style="width: 200px;" :placeholder="unSelectSaleAttr?.length?`还未选择${unSelectSaleAttr.length}个`:'无'">
          <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
        </el-select>
        <el-button :disabled="!saleAttrIdAndValueName" type="primary" icon="Plus" style="margin-left: 10px;" @click="addSaleAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0;" :data="saleAttr">
          <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
          <el-table-column label="属性名" width="150px" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值">
            <template #="{row}">
              <el-tag @close="row.spuSaleAttrValueList.splice(index,1)" v-for="(item,index) in row.spuSaleAttrValueList" :key="row.id" closable style="margin: 0 5px;">
                {{item.saleAttrValueName}}
              </el-tag>
              <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true" placeholder="请你输入属性值" size="small" style="width: 100px;"></el-input>
              <el-button v-else type="primary" icon="Plus" size="small" @click="toEdit(row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template #="{index}">
            <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice(index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-table-item>
        <el-button :disabled="saleAttr.length>0?false:true" type="primary" style="margin-left: 100px;" @click="save">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-table-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { reqAllSaleAttr, reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAddOrUpdateSpu } from '../../../api/product/spu';
import { type SpuImg, type AllTradeMark, type HasSaleAttr, type HasSaleAttrResponseData, type SaleAttr, type SaleAttrResponseData, type SpuData, type SpuHasImg, type Trademark, type SaleAttrValue } from '../../../api/product/spu/type';
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['changeScene'])
const cancel = () => {
  $emit('changeScene',0)
}
//存储已有的SPU数据
const AllTrademark = ref<Trademark[]>([])
//商品图片
const imgList = ref<SpuImg[]>([])
const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
//已有SPU销售属性
const saleAttr = ref<SaleAttr[]>([])
//全部销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
const SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuSaleAttrList: [],
  spuImageList: []
})
const saleAttrIdAndValueName = ref<string>('')
const initHasSpuData = async(spu:SpuData) => {
  SpuParams.value = spu
  //spu:即为父组件传递过来的已有的SPU对象【不完整】
  //获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖的照片
  const result1: SpuHasImg = await reqSpuImageList(<number>spu.id)
  //获取已有的SPU销售属性的数据
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(<number>spu.id)
  //获取整个项目全部SPU的销售属性
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  //存储全部品牌的数据
  AllTrademark.value = result.data
  //SPU对应商品图片
  imgList.value = result1.data.map(item => {
    return{
      name:item.imgName,
      url:item.imgUrl
    }
  })
  //存储已有的SPU销售属性
  saleAttr.value = result2.data
  //存储全部的销售属性
  allSaleAttr.value = result3.data
}
const handlePictureCardPreview = (file:any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value?.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}
const toEdit = (row:SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
const toLook = (row:SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName:<string>saleAttrValue
  }
  if((saleAttrValue as string).trim()==''){
    ElMessage({
      type: 'error',
      message:'属性值为空'
    })
    return
  }
  const repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue
  })
  if(repeat){
    ElMessage({
      type: 'error',
      message:'属性值已存在'
    })
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}
const save = async() => {
  SpuParams.value.spuImageList = imgList.value.map((item:any) => {
    return{
      imgName:item.name,
      imgUrl:(item.response && item.response.data)||item.url
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value
  const result = await reqAddOrUpdateSpu(SpuParams.value)
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeScene',0)
  }else{
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败' 
    })
}}
const initAddSpu = async(c3Id:number|string) => {
  Object.assign(SpuParams.value,{
    category3Id:c3Id,
    spuName:'',
    description:'',
    tmId:'',
    spuSaleAttrList:[],
    spuImageList:[]
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  SpuParams.value.category3Id = c3Id
  const result: AllTradeMark = await reqAllTradeMark()
  const result1: HasSaleAttrResponseData = await reqAllSaleAttr()  
  AllTrademark.value = result.data
  allSaleAttr.value = result1.data
}
defineExpose({initHasSpuData,initAddSpu})
</script>

<style scoped>

</style>