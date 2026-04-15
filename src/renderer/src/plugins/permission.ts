import { App } from 'vue'
import { permissionDirective } from '../hooks/Permission'

// 权限插件
export default {
  install(app: App) {
    // 注册权限指令
    app.directive('permission', permissionDirective)
    
    // 全局注入权限检查方法
    app.config.globalProperties.$checkPermission = (permission: string) => {
      const userRole = localStorage.getItem('userRole')
      if (!userRole) return false
      
      const rolePermissions: Record<string, string[]> = {
        admin: [
          'page:home',
          'page:device',
          'page:account',
          'device:view',
          'device:add',
          'device:edit',
          'device:delete',
          'user:view',
          'user:add',
          'user:edit',
          'user:delete',
          'role:view',
          'role:add',
          'role:edit',
          'role:delete',
          'page:view',
          'page:add',
          'page:edit',
          'page:delete'
        ],
        user: [
          'page:home',
          'page:device',
          'device:view'
        ]
      }
      
      const permissions = rolePermissions[userRole] || []
      return permissions.includes(permission)
    }
  }
}