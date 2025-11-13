<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form"> 
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item>
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="large" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter} from 'vue-router'
import { ElNotification } from 'element-plus'
//引入用户相关的小仓库
import useUserStore from '../../store/modules/user'
let useStore = useUserStore()
let route = useRouter()
let loading = ref(false)
//收集账号和密码的数据
let loginForm = reactive({username:'admin', password:'111111'})
const login =  async() => {
  loading.value = true
  //点击登录按钮以后干什么
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登录失败信息
  try {
    await useStore.userLogin(loginForm)
    route.push('/')
    ElNotification({
      type: 'success',
      message: '登录成功'
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: ( error as Error ).message
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url(../../assets/images/login_form.png) no-repeat;
  background-size: cover;
  padding: 40px;
 }
 h1 {
  color: white;
  font-size: 40px;
 }
 h2 {
  font-size: 20px;
  color: white;
  margin: 20px 0;
 }
 .login_btn {
  width: 100%;
 }
}

</style>