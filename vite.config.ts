import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server:{
    proxy:{
  //这里是通过请求/api 来转发到 http://47.98.212.252/
  //假如你要请求http://47.98.212.252/a
  //那么axios的url，可以配置为 /api/a
      '/api': {
        target: 'http://127.0.0.1:80/', // 实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    hmr:true  //配置热更新
  }

})
