<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入用户名" style="width: 200px;" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!keyword" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>  
    <el-card style="margin: 10ox 0;">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="primary" :disabled="!selectIdArr.length" @click="deleteSelectUser">批量删除</el-button>
      <el-table @selection-change="selectChange" style="margin: 10px 0;" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#"align="center" type="index"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{row}">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @change="getHasUser()"
      />
      <el-drawer v-model="drawer">
        <template #header>
          <h4>{{userParams.id? '更新用户':'添加用户'}}</h4>
        </template>
        <template #default>
          <el-form :model="userParams" :rules="rules" ref="formRef">
            <el-form-item label="用户姓名" prop="username">
              <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="name">
              <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
              <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </template>
      </el-drawer>
      <el-drawer v-model="drawer1">
        <template #header>
          <h4>分配角色(职位)</h4>
        </template>
        <template #default>
          <el-form>
            <el-form-item label="用户姓名"> 
              <el-input v-model="userParams.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="职位列表">
              <el-checkbox  @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
              <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(role,index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '../../../store/modules/setting';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { type AllRole, type User, type UserResponseData } from '../../../api/acl/user/type';
import { reqAddOrUpdateUser, reqAllRole, reqRemoveUser, reqSelectUser, reqSetUserRole, reqUserInfo } from '../../../api/acl/user';
import type { AllRoleResponseData, Records, SetRoleData } from '../../../api/acl/user/type';
import { ElMessage } from 'element-plus';

const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(0)
const userArr = ref<Records>([])
const drawer = ref<boolean>(false)
const formRef = ref<any>()
const drawer1 = ref<boolean>(false)
const allRole = ref<AllRole>([])
const userRole = ref<AllRole>([])
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
const selectIdArr = ref<number[]>([])
const keyword = ref<string>('')
const settingStore = useLayOutSettingStore()

const userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
const validatorUsername = (rule: any, value: string, callback: any) => {
  if(value.trim().length>=5){
    callback()
  }else{
    callback(new Error('用户名长度必须大于等于5'))
  }
}
const validatorname = (rule: any, value: string, callback: any) => {
  if(value.trim().length>=5){
    callback()
  }else{
    callback(new Error('用户昵称长度必须大于等于5'))
  }
}
const validatorPassword = (rule: any, value: string, callback: any) => {
  if(value.trim().length>=6){
    callback()
  }else{
    callback(new Error('用户昵称长度必须大于等于6'))
  }
}
const rules = {
  username:[{required:true,trigger:'blur',validator:validatorUsername}],
  name:[{required:true,trigger:'blur',validator:validatorname}],
  password:[{required:true,trigger:'blur',validator:validatorPassword}],
}

const getHasUser = async () => {
  // pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    userArr.value = result.data.records
    total.value = result.data.total 
  }
}
const addUser = () => {
  drawer.value = true 
  
//清除上一次的错误提示信息
nextTick(()=> {
  formRef.value.resetFields()
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '', 
  });
})
}
const updateUser = (row: User) => {
  drawer.value = true
  nextTick(()=> {
  formRef.value.resetFields()
  Object.assign(userParams,row)
})
}
const save = async() => {
  //点击保存按钮的时候，需要保证表单全部符合条件再去发请求
  await formRef.value.validate()
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    drawer.value = false
    ElMessage.success(userParams.id ? '更新成功' : '添加成功')
    getHasUser()
    window.location.reload()
  }else{
    ElMessage.error('操作失败')
  }
}
const cancel = () => {
  drawer.value = false
}
const setRole = async (row: User) => {
  Object.assign(userParams,row)
  const result:AllRoleResponseData = await reqAllRole((userParams.id as number))
  if (result.code === 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
const confirmClick = async () => {
  const data:SetRoleData = {
    userId:userParams.id as number,
    roleIdList:(userRole.value.map(item=>item.id))as number[]
  }
  const result:any = await reqSetUserRole(data)
  if (result.code === 200) {
    ElMessage.success('分配角色成功')
    drawer1.value = false
    getHasUser()
  }
}
const deleteUser = async (userId: number) => {
  const result:any = await reqRemoveUser(userId)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasUser()
  }
}
const selectChange = (val: any) => {
  selectIdArr.value = val.map((item: any) => item.id)
}
const deleteSelectUser = async () => {
  const result:any = await reqSelectUser(selectIdArr.value)
  if (result.code === 200) {
    ElMessage.success('批量删除成功')
    getHasUser()
  }
}
const search = () => {
  getHasUser()
  //清空关键字
  keyword.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

onMounted(() => {
  getHasUser()
})
</script>

<style scoped>
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>