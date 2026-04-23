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
      <h1>{{ systemName }}</h1>
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
        <router-link to="/warning" class="nav-button" :class="{ active: route.path === '/warning' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>预警管理</span>
        </router-link>
        <router-link v-if="hasPermission('repair:view')" to="/repair" class="nav-button" :class="{ active: route.path === '/repair' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <span>维修记录</span>
        </router-link>
        
        <!-- 展开菜单按钮 -->
        <div class="nav-dropdown">
          <div class="nav-dropdown-button" @mouseenter="showNavDropdown = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </div>
          <div v-if="showNavDropdown" class="nav-dropdown-menu" @mouseenter="showNavDropdown = true" @mouseleave="showNavDropdown = false">
            <!-- 设备管理 - 索引1 -->
            <router-link v-if="hasPermission('device:view') && shouldShowInDropdown(1)" to="/device" class="nav-dropdown-item" :class="{ active: route.path === '/device' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>设备管理</span>
            </router-link>
            <!-- 账号管理 - 索引2 -->
            <router-link v-if="(isPlatformAdmin || (isSuperAdmin && hasPermission('account:view'))) && shouldShowInDropdown(2)" to="/account" class="nav-dropdown-item" :class="{ active: route.path === '/account' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{{ isPlatformAdmin ? '平台管理' : '账号管理' }}</span>
            </router-link>
            <!-- 预警管理 - 索引3 -->
            <router-link v-if="shouldShowInDropdown(3)" to="/warning" class="nav-dropdown-item" :class="{ active: route.path === '/warning' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>预警管理</span>
            </router-link>
            <!-- 维修记录 - 索引4 -->
            <router-link v-if="hasPermission('repair:view') && shouldShowInDropdown(4)" to="/repair" class="nav-dropdown-item" :class="{ active: route.path === '/repair' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              <span>维修记录</span>
            </router-link>
          </div>
        </div>
    </div>
    
    <!-- 登录用户和小铃铛 -->
    <div class="header-user">
      <div class="user-info">
        <div class="notification-bell" @click="toggleNotification">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          <div v-if="showNotification" class="notification-dropdown">
            <div class="dropdown-header">
              <span class="dropdown-title">预警信息</span>
              <span class="dropdown-count">{{ unreadCount }} 条未读</span>
            </div>
            <div class="dropdown-body">
              <div v-if="recentWarnings.length === 0" class="dropdown-empty">
                暂无预警信息
              </div>
              <div v-else class="dropdown-list">
                <div v-for="warning in recentWarnings" :key="warning.id" class="dropdown-item" :class="warning.level" @click="goToWarningDetail(warning)">
                  <div class="item-icon">
                    <svg v-if="warning.level === 'critical'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <svg v-else-if="warning.level === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div class="item-content">
                    <div class="item-text">{{ warning.content }}</div>
                    <div class="item-meta">
                      <span class="item-device">{{ warning.deviceName }}</span>
                      <span class="item-time">{{ formatTime(warning.createTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="dropdown-footer" @click="goToWarningPage">
              查看全部预警
            </div>
          </div>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { handleLogout } from '../stores/authStore'
import useWarningStore from '../stores/warningStore'

const route = useRoute()
const router = useRouter()
const username = ref('管理员')
const userRole = ref('管理员')
const userPermissions = ref<string[]>([])
const platformId = ref('')
const platformName = ref('')
const systemName = ref('三维热力管网可视化系统')
const showNotification = ref(false)
const showNavDropdown = ref(false)
const windowWidth = ref(window.innerWidth)

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 计算哪些按钮应该在展开菜单中显示
const shouldShowInDropdown = (index: number) => {
  if (windowWidth.value < 480) {
    return index >= 1 // 只显示首页按钮（索引0），其他都在下拉菜单
  } else if (windowWidth.value < 600) {
    return index >= 2 // 显示前两个按钮（首页和设备管理），其他在下拉菜单
  }
  return false // 窗口足够大，不需要在下拉菜单中显示
}

// 使用预警 store
const { warnings, unreadCount, recentWarnings, loadWarnings } = useWarningStore()

const toggleNotification = (e: Event) => {
  e.stopPropagation()
  showNotification.value = !showNotification.value
}

const closeNavDropdown = (e: Event) => {
  if (!(e.target as HTMLElement).closest('.nav-dropdown')) {
    showNavDropdown.value = false
  }
}

const goToWarningPage = () => {
  showNotification.value = false
  router.push('/warning')
}

const goToWarningDetail = (warning: any) => {
  showNotification.value = false
  router.push({
    path: '/warning',
    query: { warningId: warning.id }
  })
}

const formatTime = (time?: string) => {
  if (!time) return '-'
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const closeNotification = (e: Event) => {
  if (!(e.target as HTMLElement).closest('.notification-dropdown') && !(e.target as HTMLElement).closest('.notification-bell')) {
    showNotification.value = false
  }
}

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
  
  // 从本地存储获取系统名称
  const storedSystemName = localStorage.getItem('systemName')
  if (storedSystemName) {
    systemName.value = storedSystemName
  }

  // 加载预警信息
  loadWarnings()

  // 监听storage事件，更新用户信息
  window.addEventListener('storage', updateUserInfo)
  // 添加点击事件监听器，关闭下拉框
  window.addEventListener('click', closeNotification)
  // 添加点击事件监听器，关闭导航下拉框
  window.addEventListener('click', closeNavDropdown)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('storage', updateUserInfo)
  window.removeEventListener('click', closeNotification)
  window.removeEventListener('click', closeNavDropdown)
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
  
  // 从本地存储获取系统名称
  const storedSystemName = localStorage.getItem('systemName')
  if (storedSystemName) {
    systemName.value = storedSystemName
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
  z-index: 100;
  overflow: visible;
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
  white-space: nowrap;
  overflow: hidden;
  
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

// 响应式布局：当窗口宽度小于 1200px 时隐藏标题
@media (max-width: 1200px) {
  .header-title {
    display: none;
  }
}

// 响应式布局：当窗口宽度小于 992px 时开始调整导航按钮
@media (max-width: 992px) {
  .header-nav {
    gap: 10px;
    margin-right: 20px;
    
    .nav-button {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
}

// 响应式布局：当窗口宽度小于 800px 时隐藏导航按钮文字，保留图标
@media (max-width: 800px) {
  .header-nav .nav-button span {
    display: none;
  }
  
  .header-nav .nav-button {
    padding: 10px 12px;
    min-width: 44px;
    justify-content: center;
  }
}

// 响应式布局：当窗口宽度小于 600px 时隐藏部分导航按钮
@media (max-width: 600px) {
  .header-nav .nav-button:nth-child(n+3) {
    display: none;
  }
  
  // 确保展开菜单始终显示
  .header-nav .nav-dropdown {
    display: block;
  }
}

// 响应式布局：当窗口宽度小于 480px 时只显示首页按钮
@media (max-width: 480px) {
  .header-nav .nav-button:nth-child(n+2) {
    display: none;
  }
  
  // 确保展开菜单始终显示
  .header-nav .nav-dropdown {
    display: block;
  }
}

// 默认情况下隐藏展开菜单，只在窗口缩小时显示
@media (min-width: 601px) {
  .header-nav .nav-dropdown {
    display: none;
  }
}

// 响应式布局：当窗口宽度小于 768px 时调整用户信息区域
@media (max-width: 768px) {
  .header-user .user-info {
    gap: 8px;
    padding: 8px 16px;
  }
  
  .header-user .user-details {
    margin-right: 5px;
  }
  
  .header-user .user-details .user-role {
    display: none;
  }
  
  .header-user .logout-button {
    font-size: 10px;
    padding: 5px 8px;
  }
}

// 响应式布局：当窗口宽度小于 600px 时进一步调整用户信息区域
@media (max-width: 600px) {
  .header-user .user-details .user-name {
    display: none;
  }
  
  .header-user .logout-button span {
    display: none;
  }
  
  .header-user .logout-button {
    padding: 5px;
  }
  
  .header-user .notification-bell {
    padding: 5px;
  }
}

// 响应式布局：当窗口宽度小于 480px 时最小化用户信息区域
@media (max-width: 480px) {
  .header-user .user-avatar {
    display: none;
  }
}

.header-nav {
  display: flex;
  gap: 15px;
  margin-right: 40px;
  z-index: 1;
  flex-wrap: nowrap;
  overflow: visible;
  
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
    white-space: nowrap;
    
    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    
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
  
  // 展开菜单
  .nav-dropdown {
    position: relative;
    
    .nav-dropdown-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 12px;
      border-radius: 6px;
      background: rgba(0, 229, 255, 0.1);
      color: #00e5ff;
      border: 1px solid rgba(0, 229, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(0, 229, 255, 0.2);
        border-color: #00e5ff;
        box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
      }
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
    .nav-dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 5px;
      min-width: 180px;
      background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
      z-index: 1000;
      overflow: hidden;
      
      .nav-dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        color: #00e5ff;
        text-decoration: none;
        font-size: 14px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(0, 229, 255, 0.1);
        }
        
        &.active {
          background: rgba(0, 229, 255, 0.2);
          font-weight: 600;
        }
        
        svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      }
    }
  }
}



.header-user {
  z-index: 1;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 25px;
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    transition: all 0.3s ease;
    flex-wrap: nowrap;
    overflow: visible;
    
    &:hover {
      background: rgba(0, 229, 255, 0.2);
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
    }
    
    .notification-bell {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 6px;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.3);
      color: #00e5ff;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1001;
      position: relative;
      flex-shrink: 0;

      &:hover {
        background: rgba(0, 229, 255, 0.2);
        border-color: #00e5ff;
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
      }

      .notification-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 8px;
        background: #ff4d4f;
        color: #fff;
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 8px rgba(255, 77, 79, 0.5);
      }

      .notification-dropdown {
        position: absolute;
        top: calc(100% + 5px);
        right: 0;
        width: 360px;
        background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 8px;
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
        z-index: 9999;
        overflow: hidden;

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background: rgba(0, 229, 255, 0.1);
          border-bottom: 1px solid rgba(0, 229, 255, 0.2);

          .dropdown-title {
            font-size: 14px;
            font-weight: 600;
            color: #00e5ff;
          }

          .dropdown-count {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .dropdown-body {
          max-height: 300px;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: rgba(0, 229, 255, 0.05);
          }

          &::-webkit-scrollbar-thumb {
            background: rgba(0, 229, 255, 0.3);
            border-radius: 3px;
          }
        }

        .dropdown-empty {
          padding: 30px 15px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .dropdown-list {
          .dropdown-item {
            display: flex;
            gap: 12px;
            padding: 12px 15px;
            border-bottom: 1px solid rgba(0, 229, 255, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;

            &:hover {
              background: rgba(0, 229, 255, 0.05);
            }

            &:last-child {
              border-bottom: none;
            }

            &.critical {
              border-left: 3px solid #ff4d4f;
            }

            &.warning {
              border-left: 3px solid #ff9800;
            }

            &.info {
              border-left: 3px solid #00e5ff;
            }

            .item-icon {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 6px;
              flex-shrink: 0;

              .critical & {
                background: rgba(255, 77, 79, 0.2);
                color: #ff4d4f;
              }

              .warning & {
                background: rgba(255, 152, 0, 0.2);
                color: #ff9800;
              }

              .info & {
                background: rgba(0, 229, 255, 0.2);
                color: #00e5ff;
              }
            }

            .item-content {
              flex: 1;
              min-width: 0;

              .item-text {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .item-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
              }
            }
          }
        }

        .dropdown-footer {
          padding: 12px 15px;
          text-align: center;
          font-size: 13px;
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.05);
          border-top: 1px solid rgba(0, 229, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(0, 229, 255, 0.1);
          }
        }
      }
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
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
      margin-right: 10px;
      
      .user-name {
        font-size: 13px;
        font-weight: 600;
        color: #00e5ff;
        white-space: nowrap;
      }
      
      .user-role {
        font-size: 11px;
        color: rgba(0, 229, 255, 0.7);
        white-space: nowrap;
      }
    }
    
    .logout-button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      border-radius: 15px;
      background: rgba(255, 77, 79, 0.1);
      border: 1px solid rgba(255, 77, 79, 0.3);
      color: #ff4d4f;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
      white-space: nowrap;
      
      &:hover {
        background: rgba(255, 77, 79, 0.2);
        border-color: #ff4d4f;
        box-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
      }
    }
  }
}
</style>