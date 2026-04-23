import './assets/main.css'

// 导入Cesium及其样式
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import permissionPlugin from './plugins/permission'

// 配置Cesium
window.Cesium = Cesium

// 设置Cesium静态资源路径
window.CESIUM_BASE_URL = import.meta.env.BASE_URL

// 设置Cesium Ion默认访问token（可选）
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyM2RlNzg3YS0zYzY4LTQ0OGMtOWE2ZS1mOTI3MjhkZGJlMmIiLCJpZCI6MjU2MzE3LCJpYXQiOjE3MzE5ODgwOTl9.KqIIaRAzYqENz7XQ6lPAzgRp357ps9_zv3Ta7OUMKCY'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(permissionPlugin)
app.mount('#app')
