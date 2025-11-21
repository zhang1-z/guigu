<template>
  <div>
    <el-card >
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <el-table style="margin: 10px 0;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" width="" align="center" prop="tmName">
        </el-table-column>
        <el-table-column label="品牌LOGO" width="" align="center">
          <template #="{row,$index}">
            <img :src="row.logoUrl" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" width="" align="center">
          <template #="{row,$index}">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.tmName}吗?`" width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
                <template #reference>
                   <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @change="getHasTrademark" 
        :pagecount="9"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->, sizes, total "
        :total="total"
      />
    </el-card>
    <el-dialog :title="trademarkParams.id? '修改品牌': '添加品牌'" v-model="dialogFormVisible">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { ref,onMounted,watch,reactive } from 'vue'
import { reqHasTrademark,reqAddOrUpdateTrademark,reqDeleteTrademark } from '../../../api/product/trademark'
import type { Records,TradeMarkResponseData, TradeMark } from '../../../api/product/trademark/type'
const pageNo = ref<number>(1)
const limit = ref<number>(3)
const total = ref<number>(0)
const trademarkArr = ref<Records>([])   
const dialogFormVisible = ref<boolean>(false)
//获取组件实例对象
const formRef = ref()
const getHasTrademark = async(p0: number) => {
  let result:TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
onMounted(() => {
  getHasTrademark()
}) 
watch(limit,() => {
  pageNo.value = 1
  getHasTrademark()
})
//分页器当前页码发生变化时触发
//对于当前页码发生变化自定事件，组件pagination父组件回传了数据（当前页码）
// const changePageNo = () => {
//   getHasTrademark()
// }
const addTrademark = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
const updateTrademark = (row: TradeMark) => {
  //清空校验规则出错提示信息
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  dialogFormVisible.value = true
  Object.assign(trademarkParams,row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}
const cancel =() => [
  dialogFormVisible.value = false
]
const confirm = async() => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if(result.code === 200) {
    dialogFormVisible.value = false
    ElMessage({
      type:'success',
      message: trademarkParams.id? '修改品牌成功':'添加品牌成功'
    })
    getHasTrademark(trademarkParams.id? pageNo.value: 1)
  }else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id? '修改品牌失败':'添加品牌失败'
    })
  }
}
const trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
//上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  //要求：上传文件格式png|jpg|gif 4M
  if(rawFile.type === 'image/png' || rawFile.type === 'image/jpg' || rawFile.type === 'image/gif'){
    if(rawFile.size / 1024 / 1024 < 4){
      return true
    }else{
      ElMessage({
        type: 'error',
        message: '图片大小不能超过4M'
      })
      return false
    }
  }else {
    ElMessage({
      type: 'error',
      message: '请上传png|jpg|gif格式图片'
    })
    return false
  }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
const validatorTmName = (rule: any, value: string, callback: any) => {
  if (value.trim().length>=2){
    callback()
  }else {
    callback(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: string, callback: any) => {
  if(value) {
    callback()
  }else {
    callback(new Error('LOGO图片务必上传'))
  }
}
const rules = {
  tmName: [
    {required:true, trigger: 'blur', validator: validatorTmName}
  ],
  logoUrl: [
    {required:true, validator: validatorLogoUrl}
  ]
}
const removeTradeMark = async(id: number) => {
  let result = await reqDeleteTrademark(id)
  if(result.code === 200) {
    ElMessage({
      type:'success',
      message: '删除品牌成功'
    })
    //删除成功后，重新获取当前页码数据
    getHasTrademark(trademarkArr.value.length > 1? pageNo.value : pageNo.value - 1)
  }else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>