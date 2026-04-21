<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Notification from './components/Notification.vue'

const route = useRoute()
// 存储登录状态
const isLoggedIn = ref(false)

// 通知组件状态
const notificationVisible = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')

// 检查登录状态
const checkLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  if (isLoggedIn.value) {
    checkPlatformExpiry()
  }
}

// 检查平台过期状态
const checkPlatformExpiry = () => {
  const platformInfoStr = localStorage.getItem('platformInfo')
  if (platformInfoStr) {
    try {
      const platformInfo = JSON.parse(platformInfoStr)
      const now = new Date()
      const expiryDate = new Date(platformInfo.expiryTime)
      const timeDiff = expiryDate.getTime() - now.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      // 检查是否在一周内过期
      if (daysDiff <= 7 && daysDiff > 0) {
        notificationMessage.value = `平台将于 ${daysDiff} 天后过期，请及时续费`
        notificationType.value = 'warning'
        notificationVisible.value = true
      }
      // 检查是否已过期
      else if (daysDiff <= 0) {
        notificationMessage.value = '平台已过期，无法进行操作'
        notificationType.value = 'error'
        notificationVisible.value = true
      }
    } catch (error) {
      console.error('解析平台信息失败:', error)
    }
  }
}

// 显示通知
const showNotification = (message: string, type: string = 'info') => {
  notificationMessage.value = message
  notificationType.value = type
  notificationVisible.value = true
  
  // 3秒后自动关闭
  setTimeout(() => {
    notificationVisible.value = false
  }, 5000)
}

// 关闭通知
const closeNotification = () => {
  notificationVisible.value = false
}

// 计算是否显示header
const showHeader = computed(() => {
  // 登录页不显示header
  if (route.path === '/login') {
    return false
  }
  // 其他页面仅登录后显示header
  return isLoggedIn.value
})

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
  // 监听localStorage变化
  window.addEventListener('storage', checkLoginStatus)
})

// 监听路由变化，重新检查登录状态
watch(() => route.path, () => {
  checkLoginStatus()
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus)
})
</script>

<template>
  <div class="app-container">
    <!-- 头部，仅登录后且非登录页显示 -->
    <Header v-if="showHeader" />
    
    <!-- 路由出口 -->
    <div class="router-container">
      <router-view />
    </div>
    
    <!-- 通知组件 -->
    <Notification 
      :visible="notificationVisible" 
      :message="notificationMessage" 
      :type="notificationType"
      @close="closeNotification"
    />
  </div>
</template>

<style scoped lang="less">
// 全局表格滚动条样式
.table-container,
.el-table__body-wrapper,
.el-table__body,
.el-table-body,
.table-body {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 229, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 229, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 229, 255, 0.5);
    }
  }
}

// 表格容器 - 只在内容区域显示滚动条
.table-container {
  overflow: auto;
  max-height: calc(100vh - 280px);
  min-height: 200px;
}

.app-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1929 0%, #1a2a40 100%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  // 科技感背景元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 229, 255, 0.05) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.03) 0%, transparent 40%),
      linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.02) 50%, transparent 100%);
    z-index: 0;
  }
  
  // 网格线效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
  }
  
  // 响应式布局
  @media (max-width: 1200px) {
    .router-container {
      padding: 10px;
    }
  }
  
  @media (max-width: 768px) {
    .router-container {
      padding: 5px;
      border-radius: 8px;
    }
  }
}

.router-container {
  flex: 1;
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(0, 229, 255, 0.2),
    inset 0 0 0 1px rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);
  position: relative;
  z-index: 1;
  
  // 异形设计元素 - 左上角装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, transparent 100%);
    border-radius: 12px 0 100px 0;
    z-index: 0;
  }
  
  // 异形设计元素 - 右下角装饰
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, transparent 0%, rgba(0, 229, 255, 0.05) 100%);
    border-radius: 100px 0 12px 0;
    z-index: 0;
  }
  
  // 响应式调整
  @media (max-width: 768px) {
    &::before {
      width: 80px;
      height: 80px;
    }
    
    &::after {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
