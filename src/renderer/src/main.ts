import './assets/main.css'

// 配置Cesium基础URL
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import permissionPlugin from './plugins/permission'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(permissionPlugin)
app.mount('#app')
