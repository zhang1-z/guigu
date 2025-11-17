<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms"> 
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
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
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '../../utils/time'
//引入用户相关的小仓库
import useUserStore from '../../store/modules/user'
let useStore = useUserStore()
let router = useRouter()
let route = useRoute()
let loading = ref(false)
let loginForms = ref()
//收集账号和密码的数据
let loginForm = reactive({username:'admin', password:'111111'})
const login =  async() => {
  await loginForms.value.validate()
  loading.value = true
  //点击登录按钮以后干什么
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登录失败信息
  try {
    await useStore.userLogin(loginForm)
    //判断登录的时候，路由路径当中是否有query参数，如果有就往query跳转，没有跳转到首页
    let redirect: any = route.query.redirect
    router.push({path: redirect || '/'})
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`
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
const validatorUserName = (rule:any, value:any, callback:any) => {
  if (value.length >=5) {
    callback()
  }else {
    callback(new Error('用户名长度必须大于等于5个字符'))
  }
}
const validatorPassword = (rule:any, value:any, callback:any) => {
  if (value.length >=6) {
    callback()
  }else {
    callback(new Error('密码长度必须大于等于6个字符'))
  }
}
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // { required: true, min:6, max: 10, message: '用户名长度必须在6到10个字符之间', trigger: 'change' }
     { trigger: 'change', validator: validatorUserName}
  ],
  password: [
    // {required:true, min:6, max:15, message: '密码长度必须在6到15个字符之间', trigger: 'change'}
     { trigger: 'change', validator: validatorPassword}
  ]
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