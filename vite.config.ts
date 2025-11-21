import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各种环境下的对应变量
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue(),
    viteMockServe({
      // localEnabled: command === 'serve',
      enable: command === 'serve',
    })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss";`
        }
      }
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
