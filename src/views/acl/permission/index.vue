<template>
  <div>
    <el-table :data="permisstionArr" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{row}">
          <el-button type="primary" @click="addPermisstion(row)" size="small" :disabled="row.level==4?true:false">{{row.level==3?'添加功能':'添加菜单'}}</el-button>
          <el-button type="primary" @click="updatePermisstion(row)" size="small" :disabled="row.level==1?true:false">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level==1?true:false">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'"> 
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { reqAddOrUpdateMenu, reqAllPermisstion, reqRemoveMenu } from '../../../api/acl/menu';
import{ type MenuParams, type Permisstion } from '../../../api/acl/menu/type';
import { ElMessage } from 'element-plus';

const permisstionArr = ref<Permisstion[]>([])
const dialogVisible = ref(false)
const menuData = reactive<MenuParams>({
  code: '',
  level:0,
  name: '',
  pid: 0
})

const getHasPermisstion = async () => {
  const result = await reqAllPermisstion()
  if(result.code === 200) {
    permisstionArr.value = result.data
  }
}
const addPermisstion = (row: Permisstion) => {
  Object.assign(menuData,{
    id:0,
    code: '',
    level:0,
    name: '',
    pid: 0
  } )
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id
}
const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(menuData,row)
}
const save = async () => {
  const result = await reqAddOrUpdateMenu(menuData)
  if(result.code === 200) {
    dialogVisible.value = false
    ElMessage.success(menuData.id ? '更新成功' : '添加成功')
    getHasPermisstion()
  }
}
const removeMenu = async (id: number) => {
  const result = await reqRemoveMenu(id)
  if(result.code === 200) {
    ElMessage.success('删除成功')
    getHasPermisstion()
  }
}

onMounted(() => {
  getHasPermisstion()
})
</script>

<style scoped>

</style>