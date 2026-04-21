import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/loginPage.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/homePage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('../views/DeviceManage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/AccountManage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/warning',
    name: 'Warning',
    component: () => import('../views/WarningManage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/repair',
    name: 'Repair',
    component: () => import('../views/RepairRecord.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // 重定向到登录页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要鉴权
  if (to.meta.requiresAuth) {
    // 检查本地存储中是否有登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      next()
    } else {
      // 未登录，重定向到登录页面
      next('/login')
    }
  } else {
    // 不需要鉴权的路由，直接通过
    next()
  }
})

export default router
