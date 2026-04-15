import { ref, reactive } from 'vue';
import type { Platform } from '../types';
import router from '../router/index';

// 表单数据
const username = ref('');
const password = ref('');

// 错误信息
const errors = reactive({
  username: '',
  password: '',
  login: ''
});

// 模拟平台数据
const mockPlatforms: Record<string, Platform> = {
  '1': {
    id: '1',
    name: '平台A',
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-01 09:00:00',
    expiryTime: '2026-12-31 23:59:59',
    hashCode: 'PLATFORM_A_20261231_1'
  },
  '2': {
    id: '2',
    name: '平台B',
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-02 10:00:00',
    expiryTime: '2026-12-31 23:59:59',
    hashCode: 'PLATFORM_B_20261231_2'
  },
  '3': {
    id: '3',
    name: '平台C',
    status: 'inactive',
    statusText: '禁用',
    createdAt: '2024-01-03 11:00:00',
    expiryTime: '2026-12-31 23:59:59',
    hashCode: 'PLATFORM_C_20261231_3'
  }
};

// 模拟用户数据
const mockUsers = {
  'platform': {
    username: 'platform',
    password: 'platform123',
    role: 'platform', // 平台管理员
    permissions: ['platform:manage', 'platform:view', 'device:view', 'account:view', 'account:edit']
  },
  'admin': {
    username: 'admin',
    password: 'admin123',
    role: 'admin', // 超级管理员
    platformId: '1', // 所属平台
    permissions: ['device:view', 'account:view', 'account:edit', 'role:manage']
  },
  'user': {
    username: 'user',
    password: 'user123',
    role: 'user', // 普通用户
    platformId: '1', // 所属平台
    permissions: ['device:view']
  }
};

// 验证表单
const validateForm = () => {
  let isValid = true;
  
  // 重置错误
  errors.username = '';
  errors.password = '';
  errors.login = '';
  
  // 验证用户名
  if (!username.value.trim()) {
    errors.username = '请输入用户名';
    isValid = false;
  }
  
  // 验证密码
  if (!password.value.trim()) {
    errors.password = '请输入密码';
    isValid = false;
  }
  
  return isValid;
};

// 处理登录
const handleLogin = () => {
  // 验证表单
  if (!validateForm()) {
    return;
  }
  
  // 验证用户凭据
  const user = Object.values(mockUsers).find(u => u.username === username.value);
  if (user && password.value === user.password) {
    // 检查平台状态（非平台管理员需要检查）
    if (user.role !== 'platform' && 'platformId' in user && user.platformId) {
      const platform = mockPlatforms[user.platformId];
      if (!platform) {
        errors.login = '所属平台不存在';
        return;
      }
      
      if (platform.status !== 'active') {
        errors.login = '所属平台已禁用';
        return;
      }
      
      // 检查平台是否已过期
      const now = new Date();
      const expiryDate = new Date(platform.expiryTime);
      
      if (now > expiryDate) {
        errors.login = '所属平台已过期，无法登录';
        return;
      }
      
      // 存储平台信息
      localStorage.setItem('platformInfo', JSON.stringify(platform));
    }
    
    // 登录成功，设置登录状态
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userPermissions', JSON.stringify(user.permissions));
    if ('platformId' in user && user.platformId) {
      localStorage.setItem('platformId', user.platformId);
    }
    // 跳转到首页
    router.push('/');
  } else {
    // 登录失败
    errors.login = '用户名或密码错误';
  }
};

// 处理登出
const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('userPermissions');
  localStorage.removeItem('platformId');
  localStorage.removeItem('platformInfo');
  
  // 跳转到登录页
  router.push('/login');
};

export {
  // 状态
  username,
  password,
  errors,
  mockPlatforms,
  mockUsers,
  
  // 方法
  validateForm,
  handleLogin,
  handleLogout
};
