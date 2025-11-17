//路由鉴权：鉴权，项目当中路由能不能被访问权限的设置（某一个路由什么条件下可以访问、什么条件下不可以访问）
import router from './router'
import nprogress from 'nprogress'
import setting from './setting'
//引入进度条的样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)
//全局守卫：项目中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  //to:你将要访问的那个路由
  //from:你从哪个路由跳转而来
  //next:路由的放行函数
  nprogress.start()
  //获取token，去判断用户登录，还是未登录
  let token = userStore.token
  let username = userStore.username
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next()
        } catch {
          //token过期：获取不到用户信息了
          //用户手动修改本地存储token
          //退出登录->用户相关数据清空
          userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})