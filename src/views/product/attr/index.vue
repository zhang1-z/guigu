<template>
  <div>
    <!-- 三级分类全局组件 --> 
     <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0;">
      <div v-show="scene==0">
        <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addAttr">添加平台属性</el-button>
          <el-table border style="margin: 10px 0;" :data="attrArr">
            <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
            <el-table-column label="属性名称" width="140px" prop="attrName"></el-table-column>
            <el-table-column label="属性值操作">
              <template #="{row}">
                <el-tag style="margin: 5px;" v-for="(item) in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
              <template #="{row}">
                <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                 <el-popconfirm :title="`你确定要删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                  <template #reference>
                   <el-button type="primary" size="small" icon="Delete"></el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <div v-show="scene==1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" type="primary" size="default" icon="Plus" :disabled="!attrParams.attrName">添加属性值</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="120px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{row, index}">
              <el-input :ref="(vc:any) => inputArr[index] = vc" v-if="row.flag" @blur="toLook(row,index)" size="small"placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row,index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{index}">
              <el-button type="danger" size="small" icon="Delete" @click="attrParams.attrValueList.splice(index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save" :disabled="!attrParams.attrValueList.length">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from "vue"
import { reqAttr,reqAddOrUpdateAttr, reqRemoveAttr } from "../../../api/product/attr"
import Category from "../../../components/Category/index.vue"
import useCategoryStore from "../../../store/modules/category"
import type { AttrResponseData,Attr, AttrValue } from "../../../api/product/attr/type"
import { ElMessage } from "element-plus"
const categoryStore = useCategoryStore()
const attrArr = ref<Attr[]>([])
const scene = ref<number>(0)//等于0显示table，等于1显示添加与修改属性结构
//收集新增属性的数据
const attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})
//准备一个数组：将来存储对应的组件实例el-input
let inputArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
  attrArr.value = []
  if(!categoryStore.c3Id) return
  getAttr()
})
const getAttr = async() => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const result:AttrResponseData = await reqAttr(c1Id,c2Id,c3Id)
  if (result.code === 200) {
    attrArr.value = result.data 
  }
}
const addAttr = () => {
  //每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })
  scene.value = 1
}
const updateAttr = (row: Attr) => {
  scene.value = 1
  //将已有的属性对象赋给attrParams对象
  Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(()=> {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
const save = async() => {
  let result:any = await reqAddOrUpdateAttr(attrParams)
  if(result.code == 200)  {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '新增成功'
    })
    getAttr()
  }else{
    ElMessage({
      type: 'error',
      message: '保存失败'
    })
  }
}
const toLook = (row: AttrValue,$index:number) => {
  //非法情况判断
  if(row.valueName.trim() === '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能为空'
    })
    return
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item)=> {
    if(item!=row) {
      return item.valueName === row.valueName
    }
  })
  if(repeat) {
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能重复'
    })
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue,index:number) => {
  row.flag = true
  nextTick(()=> {
    inputArr.value[index].focus()
  })
}
const deleteAttr = async(attrId: number) => {
  let result:any = await reqRemoveAttr(attrId)
  if(result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
  }else{
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库数据
  categoryStore.$reset()
})

</script>

<style scoped>

</style>