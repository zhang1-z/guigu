<template>
  <div>
    <el-card>
      <el-form inline class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="请输入搜索职位关键字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 10px 0;" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column align="center" label="职位名称" prop="roleName"></el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" label="更新时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template #="{row}">
            <el-button type="primary" size="small" icon="User" @click="setPermisstion(row.id)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
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
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @change="getHasRole()"
      />
    </el-card>
    <el-dialog v-model="dialogVisite" :title="roleParams.id ? '更新职位' : '添加职位'" >
      <el-form :model="roleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请你输入职位名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="dialogVisite = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
          <el-tree
            style="max-width: 600px"
            :data="menuArr"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="selectArr"
            :props="defaultProps"
            ref="tree"
          />
      </template>
      <template #footer>
        <el-button @click="drawer=false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '../../../store/modules/setting'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { MenuData, RoleResponseData } from '../../../api/acl/role/type'
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermission } from '../../../api/acl/role'
import type { Records, RoleData } from '../../../api/acl/role/type'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const keyword = ref<string>('')
const allRole = ref<Records>([])
const total = ref<number>(0)
const settingStore = useLayOutSettingStore()
const dialogVisite = ref<boolean>(false)
const roleParams = reactive<RoleData>({
  roleName: '',
})
const form = ref<any>()
const drawer = ref<boolean>(false)
const menuArr = ref<MenuData[]>([])
const selectArr = ref<number[]>([])
const tree = ref<any>()

const getHasRole = async() => {
  const result:RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  allRole.value = result.data.records
  total.value = result.data.total
}
const search = () => {
  getHasRole()
  keyword.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
const addRole = () => {
  dialogVisite.value = true
  Object.assign(roleParams, {
    roleName: '',
    id:0
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const updateRole = (row:RoleData) => {
  dialogVisite.value = true
  Object.assign(roleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const validatorRoleName = (rule:any, value:string, callback:any) => {
  if(value.trim().length >=2){
    callback()
  }else {
    callback(new Error('职位名称至少两位'))
  }
}
const rules = {
  roleName: [
    {required:true, trigger: 'blur', validator: validatorRoleName}
  ]
}
const save = async() => {
  await form.value.validate()
  const result = await reqAddOrUpdateRole(roleParams)
  if(result.code === 200){
    ElMessage.success(roleParams.id ? '更新成功' : '添加成功')
    dialogVisite.value = false
    getHasRole()
  }

}
const setPermisstion = async(id:number) => {
  drawer.value = true
  roleParams.id = id
  const result = await reqAllMenuList(id)
  if(result.code === 200){
    menuArr.value = result.data 
    selectArr.value = filterSelectArr(menuArr.value,[])
  }
}
const filterSelectArr = (allData:any,initArr:any) => {
  allData.forEach((item:any) => {
    if(item.select&&item.children==null){
      initArr.push(item.id)
    }
    if(item.children&&item.children.length>0){
      filterSelectArr(item.children,initArr)
    }
  })
  return initArr
}
const handler = async() => {
  //职位id
  const roleId = roleParams.id as number
  //选中节点的id
  const arr = tree.value.getCheckedKeys()
  //选中节点的父节点id
  const arr1 = tree.value.getHalfCheckedKeys()
  const permissionId = arr.concat(arr1)
  const result:any = await reqSetPermission(roleId, permissionId)
  if(result.code === 200){
    ElMessage.success('权限分配成功')
    drawer.value = false
    window.location.reload()
  }
}
const removeRole = async(id:number) => {
  const result = await reqRemoveRole(id)
  if(result.code === 200){
    ElMessage.success('删除成功')
    getHasRole()
  }
}

const defaultProps = {
  children: 'children',
  label: 'name',
}


onMounted(() => {
  getHasRole()
})
</script>

<style scoped>
.form{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>s