import { createApp } from 'vue'
import App from './App.vue'
//引入element-plus插件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置elemen-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入模块的全局的样式
// import './styles/reset.scss'
import './styles/index.scss'
// import './styles/variable.scss'
//引入路由
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入仓库
import pinia from './store'
//引入路由鉴权
import './permission'
//引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

//获取应用实例对象
const app = createApp(App)
//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


//注册路由
app.use(router)
// 注册仓库
app.use(pinia)
//引入自定义指令文件
import { isHasButton } from './directive/has'
isHasButton(app)
app.mount('#app')
