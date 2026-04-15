// 平台类型
export interface Platform {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  statusText: string;
  createdAt: string;
  expiryTime: string;
  hashCode: string;
}

// 用户类型
export interface User {
  username: string;
  roleId: string;
  roleName: string;
  platformId: string;
  status: 'active' | 'inactive';
  statusText: string;
  createdAt: string;
}

// 角色类型
export interface Role {
  id: string;
  name: string;
  permissions: string[];
  status: 'active' | 'inactive';
  statusText: string;
  createdAt: string;
}

// 页面功能类型
export interface PageFunction {
  id: string;
  name: string;
  code: string;
}

// 页面类型
export interface Page {
  id: string;
  name: string;
  path: string;
  functions: PageFunction[];
}

// 新增用户表单类型
export interface AddUserForm {
  username: string;
  password: string;
  roleId: string;
  platformId: string;
}

// 编辑用户表单类型
export interface EditUserForm {
  username: string;
  password: string;
  roleId: string;
  platformId: string;
  status: 'active' | 'inactive';
}

// 新增角色表单类型
export interface AddRoleForm {
  name: string;
  pagePermissions: Record<string, boolean>;
  functionPermissions: Record<string, boolean>;
}

// 编辑角色表单类型
export interface EditRoleForm {
  id: string;
  name: string;
  pagePermissions: Record<string, boolean>;
  functionPermissions: Record<string, boolean>;
}

// 新增页面表单类型
export interface AddPageForm {
  name: string;
  path: string;
  functions: { name: string; code: string }[];
}

// 编辑页面表单类型
export interface EditPageForm {
  id: string;
  name: string;
  path: string;
  functions: { name: string; code: string }[];
}

// 新增平台表单类型
export interface AddPlatformForm {
  name: string;
  expiryTime: string;
  hashCode: string;
  adminUsername: string;
  adminPassword: string;
  isPermanent: boolean;
}

// 编辑平台表单类型
export interface EditPlatformForm {
  id: string;
  name: string;
  expiryTime: string;
  hashCode: string;
  adminUsername: string;
  adminPassword: string;
}

// 续约平台表单类型
export interface RenewPlatformForm {
  id: string;
  expiryTime: string;
  hashCode: string;
  isPermanent: boolean;
}

// 标签页类型
export interface Tab {
  key: string;
  label: string;
}
