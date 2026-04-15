// 权限管理工具

// 权限检查函数
export const checkPermission = (requiredPermission: string): boolean => {
  // 从本地存储获取用户角色
  const userRole = localStorage.getItem('userRole')
  if (!userRole) {
    return false
  }
  
  // 模拟角色权限映射
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
  
  // 获取当前角色的权限列表
  const permissions = rolePermissions[userRole] || []
  
  // 检查是否拥有所需权限
  return permissions.includes(requiredPermission)
}

// 批量检查权限
export const checkPermissions = (requiredPermissions: string[]): boolean => {
  return requiredPermissions.every(permission => checkPermission(permission))
}

// 检查页面访问权限
export const checkPageAccess = (pagePath: string): boolean => {
  const pagePermission = `page:${pagePath.replace('/', '') || 'home'}`
  return checkPermission(pagePermission)
}

// 检查功能权限
export const checkFunctionAccess = (functionCode: string): boolean => {
  return checkPermission(functionCode)
}

// 获取用户权限列表
export const getUserPermissions = (): string[] => {
  const userRole = localStorage.getItem('userRole')
  if (!userRole) {
    return []
  }
  
  // 模拟角色权限映射
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
  
  return rolePermissions[userRole] || []
}

// 权限指令（Vue 3 指令）
export const permissionDirective = {
  mounted(el: HTMLElement, binding: any) {
    const permission = binding.value
    if (permission && !checkPermission(permission)) {
      el.style.display = 'none'
    }
  },
  updated(el: HTMLElement, binding: any) {
    const permission = binding.value
    if (permission && !checkPermission(permission)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

// 权限组合函数
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => checkPermission(permission))
}

// 权限过滤函数
export const filterByPermission = <T>(items: T[], permissionField: keyof T): T[] => {
  return items.filter(item => {
    const permission = item[permissionField] as string
    return permission ? checkPermission(permission) : true
  })
}