import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入router和store
import router from './router/index'
import store from './store/index'
// 導入elementplus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
axios.defaults.baseURL = "/api"


const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
app.config.globalProperties.$axios = axios;