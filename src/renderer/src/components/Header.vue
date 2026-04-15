<template>
  <header class="header-container">
    <!-- Logo -->
    <div class="header-logo">
      <div class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12h8M13 12h8M3 8v8M13 8v8M8 3h8M8 19h8M3 8h8M13 8h8M3 12h8M13 12h8M3 16h8M13 16h8"></path>
          <circle cx="8" cy="8" r="1"></circle>
          <circle cx="16" cy="8" r="1"></circle>
          <circle cx="8" cy="16" r="1"></circle>
          <circle cx="16" cy="16" r="1"></circle>
          <circle cx="12" cy="12" r="1"></circle>
        </svg>
      </div>
    </div>
    
    <!-- 标题 -->
    <div class="header-title">
      <h1>三维热力管网可视化系统</h1>
      <div class="header-subtitle">Real-time Monitoring & Control</div>
    </div>
    
    <!-- 路由按钮 -->
    <div class="header-nav">
      <router-link to="/" class="nav-button" :class="{ active: route.path === '/' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>首页</span>
      </router-link>
      <router-link v-if="hasPermission('device:view')" to="/device" class="nav-button" :class="{ active: route.path === '/device' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <span>设备管理</span>
        </router-link>
        <router-link v-if="isPlatformAdmin || (isSuperAdmin && hasPermission('account:view'))" to="/account" class="nav-button" :class="{ active: route.path === '/account' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>{{ isPlatformAdmin ? '平台管理' : '账号管理' }}</span>
        </router-link>
    </div>
    
    <!-- 登录用户 -->
    <div class="header-user">
      <div class="user-info">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="user-details">
          <span class="user-name">{{ username }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
        <button class="logout-button" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>退出</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { handleLogout } from '../stores/authStore'

const route = useRoute()
const username = ref('管理员')
const userRole = ref('管理员')
const userPermissions = ref<string[]>([])
const platformId = ref('')
const platformName = ref('')

onMounted(() => {
  // 从本地存储获取用户名
  const storedUsername = localStorage.getItem('username')
  if (storedUsername) {
    username.value = storedUsername
  }
  
  // 从本地存储获取用户角色
  const storedRole = localStorage.getItem('userRole')
  if (storedRole) {
    userRole.value = storedRole === 'platform' ? '平台管理员' : storedRole === 'admin' ? '超级管理员' : '普通用户'
  }
  
  // 从本地存储获取用户权限
  const storedPermissions = localStorage.getItem('userPermissions')
  if (storedPermissions) {
    userPermissions.value = JSON.parse(storedPermissions)
  }
  
  // 从本地存储获取平台ID
  const storedPlatformId = localStorage.getItem('platformId')
  if (storedPlatformId) {
    platformId.value = storedPlatformId
  }
  
  // 从本地存储获取平台信息
  const storedPlatformInfo = localStorage.getItem('platformInfo')
  if (storedPlatformInfo) {
    try {
      const platformInfo = JSON.parse(storedPlatformInfo)
      platformName.value = platformInfo.name
    } catch (error) {
      console.error('解析平台信息失败:', error)
    }
  }
  
  // 监听storage事件，更新用户信息
  window.addEventListener('storage', updateUserInfo)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('storage', updateUserInfo)
})

// 更新用户信息
const updateUserInfo = () => {
  const storedUsername = localStorage.getItem('username')
  if (storedUsername) {
    username.value = storedUsername
  }
  
  const storedRole = localStorage.getItem('userRole')
  if (storedRole) {
    userRole.value = storedRole === 'platform' ? '平台管理员' : storedRole === 'admin' ? '超级管理员' : '普通用户'
  }
  
  const storedPermissions = localStorage.getItem('userPermissions')
  if (storedPermissions) {
    userPermissions.value = JSON.parse(storedPermissions)
  }
  
  const storedPlatformId = localStorage.getItem('platformId')
  if (storedPlatformId) {
    platformId.value = storedPlatformId
  }
  
  // 从本地存储获取平台信息
  const storedPlatformInfo = localStorage.getItem('platformInfo')
  if (storedPlatformInfo) {
    try {
      const platformInfo = JSON.parse(storedPlatformInfo)
      platformName.value = platformInfo.name
    } catch (error) {
      console.error('解析平台信息失败:', error)
    }
  }
}

// 检查用户是否有访问权限
const hasPermission = (permission: string) => {
  return userPermissions.value.includes(permission)
}

// 检查用户是否是平台管理员
const isPlatformAdmin = computed(() => {
  return localStorage.getItem('userRole') === 'platform'
})

// 检查用户是否是超级管理员
const isSuperAdmin = computed(() => {
  return localStorage.getItem('userRole') === 'admin'
})
</script>

<style scoped lang="less">
.header-container {
  display: flex;
  align-items: center;
  height: 70px;
  background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 50%, #2c5282 100%);
  color: #00e5ff;
  padding: 0 30px;
  box-shadow: 0 2px 20px rgba(0, 229, 255, 0.2);
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 229, 255, 0.3);
  
  // 科技感背景元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(0, 229, 255, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.05) 0%, transparent 30%),
      linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.03) 50%, transparent 100%);
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
      linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0;
  }
}

.header-logo {
  margin-right: 30px;
  z-index: 1;
  
  .logo-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
    color: #0a1929;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
      transform: rotate(5deg) scale(1.05);
      box-shadow: 0 0 30px rgba(0, 229, 255, 0.7);
    }
  }
}

.header-title {
  flex: 1;
  z-index: 1;
  margin-right: 40px;
  
  h1 {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 2px 0;
    background: linear-gradient(135deg, #00e5ff 0%, #00bfff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  }
  
  .header-subtitle {
    font-size: 12px;
    color: rgba(0, 229, 255, 0.7);
    letter-spacing: 1px;
  }
}

.header-nav {
  display: flex;
  gap: 15px;
  margin-right: 40px;
  z-index: 1;
  
  .nav-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 6px;
    background: rgba(0, 229, 255, 0.1);
    color: #00e5ff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 229, 255, 0.3);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover {
      background: rgba(0, 229, 255, 0.2);
      border-color: #00e5ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
      
      &::before {
        left: 100%;
      }
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.4), rgba(0, 128, 255, 0.3));
      border-color: #00e5ff;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 10px rgba(0, 229, 255, 0.2);
      transform: translateY(-2px);
      font-weight: 600;
      text-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
    }
  }
}

.header-user {
  z-index: 1;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
    border-radius: 25px;
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 229, 255, 0.2);
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
      border-radius: 50%;
      color: #0a1929;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
      flex-shrink: 0;
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      
      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: #00e5ff;
      }
      
      .user-role {
        font-size: 12px;
        color: rgba(0, 229, 255, 0.7);
      }
    }
    
    .logout-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 15px;
      background: rgba(255, 77, 79, 0.1);
      border: 1px solid rgba(255, 77, 79, 0.3);
      color: #ff4d4f;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-left: 10px;
      
      &:hover {
        background: rgba(255, 77, 79, 0.2);
        border-color: #ff4d4f;
        box-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
      }
    }
  }
}
</style>