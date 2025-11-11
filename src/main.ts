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
//引入路由
import router from './router'
//获取应用实例对象
const app = createApp(App)
//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
//注册路由
app.use(router)
app.mount('#app')
