import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
    proxy: {
    '/api': { // 拦截所有以/api开头的请求
      target: 'http://localhost:3000',// 将前端5173转发到后端地址3000
      changeOrigin: true, // 修改请求头中的Origin为目标地址
      rewrite: (path) => path.replace(/^\/api/, '')  // 去掉/api前缀
    }
  }
})
