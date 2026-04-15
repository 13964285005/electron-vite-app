import type { Platform, User, Role, Page } from '../types';

// 模拟平台数据
export const mockPlatforms: Platform[] = [
  { id: '1', name: '平台A', status: 'active', statusText: '启用', createdAt: '2024-01-01 09:00:00', expiryTime: '2026-12-31 23:59:59', hashCode: 'PLATFORM_A_20261231_1' },
  { id: '2', name: '平台B', status: 'active', statusText: '启用', createdAt: '2024-01-02 10:00:00', expiryTime: '2026-12-31 23:59:59', hashCode: 'PLATFORM_B_20261231_2' },
  { id: '3', name: '平台C', status: 'inactive', statusText: '禁用', createdAt: '2024-01-03 11:00:00', expiryTime: '2026-12-31 23:59:59', hashCode: 'PLATFORM_C_20261231_3' }
];

// 模拟用户数据
export const mockUsers: User[] = [
  { username: 'admin', roleId: '1', roleName: '超级管理员', platformId: '1', status: 'active', statusText: '启用', createdAt: '2024-01-01 10:00:00' },
  { username: 'user', roleId: '2', roleName: '普通用户', platformId: '1', status: 'active', statusText: '启用', createdAt: '2024-01-02 14:30:00' },
  { username: 'admin2', roleId: '1', roleName: '超级管理员', platformId: '2', status: 'active', statusText: '启用', createdAt: '2024-01-01 10:00:00' },
  { username: 'user2', roleId: '2', roleName: '普通用户', platformId: '2', status: 'active', statusText: '启用', createdAt: '2024-01-02 14:30:00' }
];

// 模拟角色数据
export const mockRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    permissions: ['page:home', 'page:device', 'page:account', 'device:add', 'device:edit', 'device:delete', 'user:add', 'user:edit', 'user:delete', 'role:add', 'role:edit', 'role:delete', 'page:add', 'page:edit', 'page:delete'],
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    name: '普通用户',
    permissions: ['page:home', 'page:device'],
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-01 09:30:00'
  }
];

// 模拟页面数据
export const mockPages: Page[] = [
  {
    id: '1',
    name: '首页',
    path: '/',
    functions: []
  },
  {
    id: '2',
    name: '设备管理',
    path: '/device',
    functions: [
      { id: '1', name: '查看设备', code: 'device:view' },
      { id: '2', name: '新增设备', code: 'device:add' },
      { id: '3', name: '编辑设备', code: 'device:edit' },
      { id: '4', name: '删除设备', code: 'device:delete' }
    ]
  },
  {
    id: '3',
    name: '账号管理',
    path: '/account',
    functions: [
      { id: '1', name: '查看用户', code: 'user:view' },
      { id: '2', name: '新增用户', code: 'user:add' },
      { id: '3', name: '编辑用户', code: 'user:edit' },
      { id: '4', name: '删除用户', code: 'user:delete' },
      { id: '5', name: '查看角色', code: 'role:view' },
      { id: '6', name: '新增角色', code: 'role:add' },
      { id: '7', name: '编辑角色', code: 'role:edit' },
      { id: '8', name: '删除角色', code: 'role:delete' },
      { id: '9', name: '查看页面', code: 'page:view' },
      { id: '10', name: '新增页面', code: 'page:add' },
      { id: '11', name: '编辑页面', code: 'page:edit' },
      { id: '12', name: '删除页面', code: 'page:delete' }
    ]
  }
];
