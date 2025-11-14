import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
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
    }
  }
})
