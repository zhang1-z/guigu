//创建用户相关的小仓库
import { defineStore } from "pinia"
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from "../../api/user"
import type { loginFormData, userInfoResponseData, loginResponseData } from "../../api/user/type"
import type { UserState } from "./types/type"
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "../../utils/token"
//引入路由
import { constantRoutes } from "../../router/routes"
//创建用户小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),//用户唯一标识token
      menuRoutes: constantRoutes, //用户菜单路由
      username: '',
      avatar: '',

    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的地方
    async userLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        //pinia仓库存储token
        this.token = (result.data as string)
        //本地存储持久化存储一份
        SET_TOKEN((result.data as string))
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息方法
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code === 200) {
        //目前没有mock接口：退出登录接口（通知服务器本次用户唯一标识失效）
        this.token = '',
          this.username = '',
          this.avatar = '',
          REMOVE_TOKEN()
      } else {

      }

    }
  },
  getters: {

  }
})
//对外暴露获取小仓库方法
export default useUserStore