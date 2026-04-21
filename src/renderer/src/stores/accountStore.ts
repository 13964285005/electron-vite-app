import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Platform, User, Role, Page, Tab, AddUserForm, EditUserForm, AddRoleForm, EditRoleForm, AddPageForm, EditPageForm, AddPlatformForm, EditPlatformForm, RenewPlatformForm } from '../types';
import { mockPlatforms, mockUsers, mockRoles, mockPages } from '../mock';
import { getDefaultExpiryTime, formatExpiryTime } from '../utils';

// 标签页
const tabs = ref<Tab[]>([
  { key: 'user', label: '用户管理' },
  { key: 'role', label: '角色管理' },
  { key: 'page', label: '页面管理' }
]);

const activeTab = ref('user');

// 当前用户信息
const currentUserRole = ref('user');
const currentUserPermissions = ref<string[]>([]);
const currentPlatformId = ref('');

// 数据
const platforms = ref<Platform[]>([...mockPlatforms]);
const users = ref<User[]>([...mockUsers]);
const roles = ref<Role[]>([...mockRoles]);
const pages = ref<Page[]>([...mockPages]);

// 模态框状态
const showAddUserModalVisible = ref(false);
const showEditUserModalVisible = ref(false);
const showAddRoleModalVisible = ref(false);
const showEditRoleModalVisible = ref(false);
const showAddPageModalVisible = ref(false);
const showEditPageModalVisible = ref(false);
const showAddPlatformModalVisible = ref(false);
const showEditPlatformModalVisible = ref(false);
const showRenewPlatformModalVisible = ref(false);

// 表单
const addUserForm = ref<AddUserForm>({
  username: '',
  password: '',
  roleId: '',
  platformId: ''
});

const editUserForm = ref<EditUserForm>({
  username: '',
  password: '',
  roleId: '',
  platformId: '',
  status: 'active'
});

const addRoleForm = ref<AddRoleForm>({
  name: '',
  pagePermissions: {},
  functionPermissions: {}
});

const editRoleForm = ref<EditRoleForm>({
  id: '',
  name: '',
  pagePermissions: {},
  functionPermissions: {}
});

const addPageForm = ref<AddPageForm>({
  name: '',
  path: '',
  functions: [{ name: '', code: '' }]
});

const editPageForm = ref<EditPageForm>({
  id: '',
  name: '',
  path: '',
  functions: [{ name: '', code: '' }]
});

const addPlatformForm = ref<AddPlatformForm>({
  name: '',
  expiryTime: getDefaultExpiryTime(),
  hashCode: '',
  adminUsername: '',
  adminPassword: '',
  systemName: '三维热力管网可视化系统',
  isPermanent: false
});

const editPlatformForm = ref<EditPlatformForm>({
  id: '',
  name: '',
  expiryTime: '',
  hashCode: '',
  adminUsername: '',
  adminPassword: '',
  systemName: '三维热力管网可视化系统'
});

const renewPlatformForm = ref<RenewPlatformForm>({
  id: '',
  expiryTime: getDefaultExpiryTime(),
  hashCode: '',
  isPermanent: false
});

// 更改密码表单
const showChangePasswordModalVisible = ref(false);
const changePasswordForm = ref({
  username: '',
  newPassword: '',
  confirmPassword: ''
});

// 通知组件状态
const notificationVisible = ref(false);
const notificationMessage = ref('');
const notificationType = ref('info');

// 计算属性
const isPlatformAdmin = computed(() => {
  return currentUserRole.value === 'platform';
});

const isSuperAdmin = computed(() => {
  return currentUserRole.value === 'admin';
});

const visibleUsers = computed(() => {
  if (isPlatformAdmin.value) {
    return users.value;
  } else if (isSuperAdmin.value) {
    return users.value.filter(user => user.platformId === currentPlatformId.value);
  }
  return [];
});

const visiblePages = computed(() => {
  if (isPlatformAdmin.value) {
    // 平台管理员可以看到所有页面
    return pages.value;
  } else if (isSuperAdmin.value) {
    // 超级管理员可以看到所有页面（实际应用中可能需要根据权限控制）
    return pages.value;
  } else {
    // 普通用户只能看到有权限的页面
    return pages.value.filter(page => {
      return currentUserPermissions.value.includes(page.id);
    });
  }
});

// 检查是否可以操作指定用户
const canOperateUser = (user: User): boolean => {
  // 用户不能操作自己
  const currentUsername = localStorage.getItem('username');
  if (user.username === currentUsername) {
    return false;
  }
  
  // 权限级别：platform > admin > user
  const roleLevel = {
    platform: 3,
    admin: 2,
    user: 1
  };
  
  // 获取当前用户角色级别
  const currentRole = currentUserRole.value;
  const currentLevel = roleLevel[currentRole as keyof typeof roleLevel] || 0;
  
  // 获取目标用户角色级别
  let targetRole = user.roleName;
  if (targetRole === '平台管理员') targetRole = 'platform';
  else if (targetRole === '超级管理员') targetRole = 'admin';
  else targetRole = 'user';
  const targetLevel = roleLevel[targetRole as keyof typeof roleLevel] || 0;
  
  // 只能操作权限级别低于自己的用户
  if (currentLevel <= targetLevel) {
    return false;
  }
  
  if (isPlatformAdmin.value) {
    return true;
  } else if (isSuperAdmin.value) {
    return user.platformId === currentPlatformId.value;
  }
  return false;
};

// 检查是否可以启用/禁用指定用户
const canToggleUserStatus = (user: User): boolean => {
  // 用户不能操作自己
  const currentUsername = localStorage.getItem('username');
  if (user.username === currentUsername) {
    return false;
  }
  
  return canOperateUser(user);
};

// 初始化当前用户信息
const initCurrentUserInfo = () => {
  // 从本地存储获取用户角色
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    currentUserRole.value = storedRole;
  }
  
  // 从本地存储获取用户权限
  const storedPermissions = localStorage.getItem('userPermissions');
  if (storedPermissions) {
    currentUserPermissions.value = JSON.parse(storedPermissions);
  }
  
  // 从本地存储获取平台ID
  const storedPlatformId = localStorage.getItem('platformId');
  if (storedPlatformId) {
    currentPlatformId.value = storedPlatformId;
  }
  
  // 根据用户角色调整标签页
  if (currentUserRole.value === 'platform') {
    tabs.value = [
      { key: 'platform', label: '平台管理' }
    ];
    activeTab.value = 'platform';
  } else if (currentUserRole.value === 'admin') {
    tabs.value = [
      { key: 'user', label: '用户管理' },
      { key: 'role', label: '角色管理' }
    ];
    activeTab.value = 'user';
  }
};

// 处理storage变化
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'userRole' || event.key === 'platformId' || event.key === 'userPermissions') {
    initCurrentUserInfo();
  }
};

// 初始化数据
onMounted(() => {
  initCurrentUserInfo();
  
  // 监听localStorage变化，当用户角色或平台信息变化时重新初始化数据
  window.addEventListener('storage', handleStorageChange);
});

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

// 显示通知
const showNotification = (message: string, type: string = 'info') => {
  notificationMessage.value = message;
  notificationType.value = type;
  notificationVisible.value = true;
  
  // 3秒后自动关闭
  setTimeout(() => {
    notificationVisible.value = false;
  }, 3000);
};

// 关闭通知
const closeNotification = () => {
  notificationVisible.value = false;
};

// 显示新增用户模态框
const showAddUserModal = () => {
  addUserForm.value = {
    username: '',
    password: '',
    roleId: '',
    platformId: ''
  };
  showAddUserModalVisible.value = true;
};

// 显示编辑用户模态框
const showEditUserModal = (user: User) => {
  editUserForm.value = {
    username: user.username,
    password: '',
    roleId: user.roleId,
    platformId: user.platformId,
    status: user.status
  };
  showEditUserModalVisible.value = true;
};

// 新增用户
const addUser = () => {
  if (!addUserForm.value.username) {
    showNotification('请输入用户名', 'error');
    return;
  }
  
  if (!addUserForm.value.password) {
    showNotification('请输入密码', 'error');
    return;
  }
  
  if (addUserForm.value.password.length < 6) {
    showNotification('密码长度不能少于6位', 'error');
    return;
  }
  
  if (!addUserForm.value.roleId) {
    showNotification('请选择角色', 'error');
    return;
  }
  
  const role = roles.value.find(r => r.id === addUserForm.value.roleId);
  if (!role) {
    showNotification('角色不存在', 'error');
    return;
  }
  
  // 自动使用创建者所属的平台 ID
  let platformId = currentPlatformId.value;
  if (isPlatformAdmin.value && !platformId) {
    // 平台管理员默认使用第一个平台
    if (platforms.value.length > 0) {
      platformId = platforms.value[0].id;
    }
  }
  
  if (!platformId) {
    showNotification('无法获取所属平台信息', 'error');
    return;
  }
  
  users.value.push({
    username: addUserForm.value.username,
    password: addUserForm.value.password,
    roleId: addUserForm.value.roleId,
    roleName: role.name,
    platformId: platformId,
    status: 'active',
    statusText: '启用',
    createdAt: new Date().toLocaleString('zh-CN')
  });
  
  showAddUserModalVisible.value = false;
  showNotification('用户已添加', 'success');
};

// 更新用户
const updateUser = () => {
  const index = users.value.findIndex(u => u.username === editUserForm.value.username);
  if (index === -1) {
    showNotification('用户不存在', 'error');
    return;
  }
  
  // 检查是否有权限更新此用户
  if (!canOperateUser(users.value[index])) {
    showNotification('无权限更新此用户', 'error');
    return;
  }
  
  const role = roles.value.find(r => r.id === editUserForm.value.roleId);
  if (!role) {
    showNotification('角色不存在', 'error');
    return;
  }
  
  // 检查平台是否存在
  const platform = platforms.value.find(p => p.id === editUserForm.value.platformId);
  if (!platform) {
    showNotification('平台不存在', 'error');
    return;
  }
  
  // 检查权限：超级管理员只能更新自己所在平台的用户
  if (isSuperAdmin.value && editUserForm.value.platformId !== currentPlatformId.value) {
    showNotification('无权限更新其他平台的用户', 'error');
    return;
  }
  
  users.value[index] = {
    ...users.value[index],
    roleId: editUserForm.value.roleId,
    roleName: role.name,
    platformId: editUserForm.value.platformId,
    status: editUserForm.value.status,
    statusText: editUserForm.value.status === 'active' ? '启用' : '禁用'
  };
  
  if (editUserForm.value.password) {
    // 实际项目中这里应该更新密码
  }
  
  showEditUserModalVisible.value = false;
  showNotification('用户信息已更新', 'success');
};

// 删除用户
const deleteUser = (username: string) => {
  const user = users.value.find(u => u.username === username);
  if (!user) {
    showNotification('用户不存在', 'error');
    return;
  }
  
  // 检查是否有权限删除此用户
  if (!canOperateUser(user)) {
    showNotification('无权限删除此用户', 'error');
    return;
  }
  
  if (confirm('确定要删除该用户吗？')) {
    const index = users.value.findIndex(u => u.username === username);
    if (index !== -1) {
      users.value.splice(index, 1);
      showNotification('用户已删除', 'success');
    }
  }
};

// 切换用户状态
const toggleUserStatus = (user: User) => {
  if (!canToggleUserStatus(user)) {
    showNotification('无权限操作此用户', 'error');
    return;
  }
  
  const index = users.value.findIndex(u => u.username === user.username);
  if (index !== -1) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    users.value[index] = {
      ...user,
      status: newStatus,
      statusText: newStatus === 'active' ? '启用' : '禁用'
    };
    showNotification(`用户已${newStatus === 'active' ? '启用' : '禁用'}`, 'success');
  }
};

// 显示新增角色模态框
const showAddRoleModal = () => {
  const pagePermissions: Record<string, boolean> = {};
  const functionPermissions: Record<string, boolean> = {};
  
  pages.value.forEach(page => {
    pagePermissions[page.id] = false;
    page.functions.forEach(func => {
      functionPermissions[`${page.id}-${func.id}`] = false;
    });
  });
  
  addRoleForm.value = {
    name: '',
    pagePermissions,
    functionPermissions
  };
  
  showAddRoleModalVisible.value = true;
};

// 显示编辑角色模态框
const showEditRoleModal = (role: Role) => {
  const pagePermissions: Record<string, boolean> = {};
  const functionPermissions: Record<string, boolean> = {};
  
  pages.value.forEach(page => {
    pagePermissions[page.id] = role.permissions.includes(`page:${page.path.replace('/', '')}`);
    page.functions.forEach(func => {
      functionPermissions[`${page.id}-${func.id}`] = role.permissions.includes(func.code);
    });
  });
  
  editRoleForm.value = {
    id: role.id,
    name: role.name,
    pagePermissions,
    functionPermissions
  };
  
  showEditRoleModalVisible.value = true;
};

// 新增角色
const addRole = () => {
  if (!addRoleForm.value.name) {
    showNotification('请填写角色名称', 'error');
    return;
  }
  
  const permissions: string[] = [];
  
  // 收集页面权限
  Object.entries(addRoleForm.value.pagePermissions).forEach(([pageId, checked]) => {
    if (checked) {
      const page = pages.value.find(p => p.id === pageId);
      if (page) {
        permissions.push(`page:${page.path.replace('/', '')}`);
      }
    }
  });
  
  // 收集功能权限
  Object.entries(addRoleForm.value.functionPermissions).forEach(([key, checked]) => {
    if (checked) {
      const [pageId, funcId] = key.split('-');
      const page = pages.value.find(p => p.id === pageId);
      if (page) {
        const func = page.functions.find(f => f.id === funcId);
        if (func) {
          permissions.push(func.code);
        }
      }
    }
  });
  
  roles.value.push({
    id: (roles.value.length + 1).toString(),
    name: addRoleForm.value.name,
    permissions,
    status: 'active',
    statusText: '启用',
    createdAt: new Date().toLocaleString('zh-CN')
  });
  
  showAddRoleModalVisible.value = false;
  showNotification('角色已添加', 'success');
};

// 更新角色
const updateRole = () => {
  if (!editRoleForm.value.name) {
    showNotification('请填写角色名称', 'error');
    return;
  }
  
  const index = roles.value.findIndex(r => r.id === editRoleForm.value.id);
  if (index === -1) {
    showNotification('角色不存在', 'error');
    return;
  }
  
  const permissions: string[] = [];
  
  // 收集页面权限
  Object.entries(editRoleForm.value.pagePermissions).forEach(([pageId, checked]) => {
    if (checked) {
      const page = pages.value.find(p => p.id === pageId);
      if (page) {
        permissions.push(`page:${page.path.replace('/', '')}`);
      }
    }
  });
  
  // 收集功能权限
  Object.entries(editRoleForm.value.functionPermissions).forEach(([key, checked]) => {
    if (checked) {
      const [pageId, funcId] = key.split('-');
      const page = pages.value.find(p => p.id === pageId);
      if (page) {
        const func = page.functions.find(f => f.id === funcId);
        if (func) {
          permissions.push(func.code);
        }
      }
    }
  });
  
  roles.value[index] = {
    ...roles.value[index],
    name: editRoleForm.value.name,
    permissions
  };
  
  showEditRoleModalVisible.value = false;
  showNotification('角色信息已更新', 'success');
};

// 切换角色状态
const toggleRoleStatus = (role: Role) => {
  const index = roles.value.findIndex(r => r.id === role.id);
  if (index !== -1) {
    const newStatus = role.status === 'active' ? 'inactive' : 'active';
    roles.value[index] = {
      ...role,
      status: newStatus,
      statusText: newStatus === 'active' ? '启用' : '禁用'
    };
  }
};

// 删除角色
const deleteRole = (roleId: string) => {
  if (confirm('确定要删除该角色吗？')) {
    const index = roles.value.findIndex(r => r.id === roleId);
    if (index !== -1) {
      roles.value.splice(index, 1);
      showNotification('角色已删除', 'success');
    }
  }
};

// 显示新增页面模态框
const showAddPageModal = () => {
  addPageForm.value = {
    name: '',
    path: '',
    functions: [{ name: '', code: '' }]
  };
  showAddPageModalVisible.value = true;
};

// 显示编辑页面模态框
const showEditPageModal = (page: Page) => {
  editPageForm.value = {
    id: page.id,
    name: page.name,
    path: page.path,
    functions: [...page.functions]
  };
  showEditPageModalVisible.value = true;
};

// 添加功能
const addFunction = () => {
  addPageForm.value.functions.push({ name: '', code: '' });
};

// 移除功能
const removeFunction = (index: number) => {
  if (addPageForm.value.functions.length > 1) {
    addPageForm.value.functions.splice(index, 1);
  }
};

// 添加编辑功能
const addEditFunction = () => {
  editPageForm.value.functions.push({ name: '', code: '' });
};

// 移除编辑功能
const removeEditFunction = (index: number) => {
  if (editPageForm.value.functions.length > 0) {
    editPageForm.value.functions.splice(index, 1);
  }
};

// 新增页面
const addPage = () => {
  if (!addPageForm.value.name || !addPageForm.value.path) {
    showNotification('请填写页面名称和路径', 'error');
    return;
  }
  
  pages.value.push({
    id: (pages.value.length + 1).toString(),
    name: addPageForm.value.name,
    path: addPageForm.value.path,
    functions: addPageForm.value.functions.filter(func => func.name && func.code).map((func, index) => ({
      id: (index + 1).toString(),
      name: func.name,
      code: func.code
    }))
  });
  
  showAddPageModalVisible.value = false;
  showNotification('页面已添加', 'success');
};

// 更新页面
const updatePage = () => {
  if (!editPageForm.value.name || !editPageForm.value.path) {
    showNotification('请填写页面名称和路径', 'error');
    return;
  }
  
  const index = pages.value.findIndex(p => p.id === editPageForm.value.id);
  if (index === -1) {
    showNotification('页面不存在', 'error');
    return;
  }
  
  pages.value[index] = {
    ...pages.value[index],
    name: editPageForm.value.name,
    path: editPageForm.value.path,
    functions: editPageForm.value.functions.filter(func => func.name && func.code).map((func, index) => ({
      id: (func as { id?: string; name: string; code: string }).id || (index + 1).toString(),
      name: func.name,
      code: func.code
    }))
  };
  
  showEditPageModalVisible.value = false;
  showNotification('页面信息已更新', 'success');
};

// 删除页面
const deletePage = (pageId: string) => {
  if (confirm('确定要删除该页面吗？')) {
    const index = pages.value.findIndex(p => p.id === pageId);
    if (index !== -1) {
      pages.value.splice(index, 1);
      showNotification('页面已删除', 'success');
    }
  }
};

// 显示新增平台模态框
const showAddPlatformModal = () => {
  addPlatformForm.value = {
    name: '',
    expiryTime: getDefaultExpiryTime(),
    hashCode: '',
    adminUsername: '',
    adminPassword: '',
    isPermanent: false
  };
  showAddPlatformModalVisible.value = true;
};

// 显示编辑平台模态框
const showEditPlatformModal = (platform: Platform) => {
  // 查找平台的初始超级管理员用户
  const adminUser = users.value.find(user => user.platformId === platform.id && user.roleName === '超级管理员');
  
  editPlatformForm.value = {
    id: platform.id,
    name: platform.name,
    expiryTime: platform.expiryTime === '9999-12-31T23:59:59.999Z' ? formatExpiryTime(platform.expiryTime) : formatExpiryTime(platform.expiryTime),
    hashCode: platform.hashCode,
    adminUsername: adminUser?.username || '',
    adminPassword: '',
    systemName: platform.systemName || '三维热力管网可视化系统'
  };
  showEditPlatformModalVisible.value = true;
};

// 显示续约平台模态框
const showRenewPlatformModal = (platform: Platform) => {
  renewPlatformForm.value = {
    id: platform.id,
    expiryTime: formatExpiryTime(platform.expiryTime),
    hashCode: platform.hashCode,
    isPermanent: platform.expiryTime === '9999-12-31T23:59:59.999Z'
  };
  showRenewPlatformModalVisible.value = true;
};

// 生成哈希码
const generateHashCode = (form: AddPlatformForm | EditPlatformForm | RenewPlatformForm) => {
  if ('name' in form && !form.name) {
    showNotification('请先填写平台名称', 'error');
    return;
  }
  
  if (!('isPermanent' in form) && !form.expiryTime) {
    showNotification('请先填写到期时间', 'error');
    return;
  }
  
  if ('isPermanent' in form && !form.isPermanent && !form.expiryTime) {
    showNotification('请先填写到期时间', 'error');
    return;
  }
  
  // 生成平台ID（如果是新增平台）
  const platformId = 'id' in form ? form.id : (platforms.value.length + 1).toString();
  
  // 格式化到期时间
  let formattedExpiry = '';
  if ('isPermanent' in form && form.isPermanent) {
    formattedExpiry = 'PERMANENT';
  } else {
    const expiryDate = new Date(form.expiryTime);
    formattedExpiry = expiryDate.toISOString().slice(0, 10).replace(/-/g, '');
  }
  
  // 获取平台名称
  let platformName = '';
  if ('name' in form) {
    platformName = form.name;
  } else {
    const platform = platforms.value.find(p => p.id === form.id);
    platformName = platform?.name || '';
  }
  
  // 生成哈希码
  const hashCode = `${platformName.toUpperCase().replace(/\s+/g, '_')}_${formattedExpiry}_${platformId}`;
  
  // 更新表单中的哈希码
  form.hashCode = hashCode;
  
  showNotification('哈希码已生成', 'success');
};

// 新增平台
const addPlatform = () => {
  if (!addPlatformForm.value.name) {
    showNotification('请填写平台名称', 'error');
    return;
  }
  
  if (!addPlatformForm.value.expiryTime && !addPlatformForm.value.isPermanent) {
    showNotification('请选择到期时间或选择永久', 'error');
    return;
  }
  
  if (!addPlatformForm.value.hashCode) {
    showNotification('请生成哈希码', 'error');
    return;
  }
  
  if (!addPlatformForm.value.adminUsername) {
    showNotification('请填写初始超级管理员用户名', 'error');
    return;
  }
  
  if (!addPlatformForm.value.adminPassword) {
    showNotification('请填写初始超级管理员密码', 'error');
    return;
  }
  
  const platformId = (platforms.value.length + 1).toString();
  
  // 设置到期时间
  let expiryTime = '';
  if (addPlatformForm.value.isPermanent) {
    expiryTime = '9999-12-31T23:59:59.999Z';
  } else {
    expiryTime = new Date(addPlatformForm.value.expiryTime).toISOString();
  }
  
  platforms.value.push({
    id: platformId,
    name: addPlatformForm.value.name,
    status: 'active',
    statusText: '启用',
    createdAt: new Date().toLocaleString('zh-CN'),
    expiryTime: expiryTime,
    hashCode: addPlatformForm.value.hashCode,
    systemName: addPlatformForm.value.systemName
  });
  
  // 创建初始超级管理员
  users.value.push({
    username: addPlatformForm.value.adminUsername,
    roleId: '1', // 管理员角色
    roleName: '超级管理员',
    platformId: platformId,
    status: 'active',
    statusText: '启用',
    createdAt: new Date().toLocaleString('zh-CN')
  });
  
  showAddPlatformModalVisible.value = false;
  showNotification(`平台已添加，初始超级管理员用户名: ${addPlatformForm.value.adminUsername}`, 'success');
};

// 更新平台
const updatePlatform = () => {
  if (!editPlatformForm.value.name) {
    showNotification('请填写平台名称', 'error');
    return;
  }
  
  if (!editPlatformForm.value.expiryTime) {
    showNotification('请选择到期时间', 'error');
    return;
  }
  
  if (!editPlatformForm.value.hashCode) {
    showNotification('请生成哈希码', 'error');
    return;
  }
  
  if (!editPlatformForm.value.adminUsername) {
    showNotification('请填写初始超级管理员用户名', 'error');
    return;
  }
  
  const index = platforms.value.findIndex(p => p.id === editPlatformForm.value.id);
  if (index !== -1) {
    // 更新平台信息
    platforms.value[index] = {
      ...platforms.value[index],
      name: editPlatformForm.value.name,
      expiryTime: new Date(editPlatformForm.value.expiryTime).toISOString(),
      hashCode: editPlatformForm.value.hashCode,
      systemName: editPlatformForm.value.systemName
    };
    
    // 更新初始超级管理员信息
    const adminUserIndex = users.value.findIndex(user => user.platformId === editPlatformForm.value.id && user.roleName === '超级管理员');
    if (adminUserIndex !== -1) {
      users.value[adminUserIndex] = {
        ...users.value[adminUserIndex],
        username: editPlatformForm.value.adminUsername
      };
      
      // 如果填写了密码，则更新密码
      if (editPlatformForm.value.adminPassword) {
        // 实际项目中这里应该更新密码
      }
    }
    
    showEditPlatformModalVisible.value = false;
    showNotification('平台信息已更新', 'success');
  }
};

// 切换平台状态
const togglePlatformStatus = (platform: Platform) => {
  const index = platforms.value.findIndex(p => p.id === platform.id);
  if (index !== -1) {
    const newStatus = platform.status === 'active' ? 'inactive' : 'active';
    platforms.value[index] = {
      ...platform,
      status: newStatus,
      statusText: newStatus === 'active' ? '启用' : '禁用'
    };
    const message = `平台已${newStatus === 'active' ? '启用' : '禁用'}`;
    const type = newStatus === 'active' ? 'success' : 'warning';
    showNotification(message, type);
  }
};

// 显示更改密码模态框
const showChangePasswordModal = (user: User) => {
  changePasswordForm.value = {
    username: user.username,
    newPassword: '',
    confirmPassword: ''
  };
  showChangePasswordModalVisible.value = true;
};

// 更改密码
const changePassword = () => {
  // 验证是否是修改自己的密码
  const currentUsername = localStorage.getItem('username');
  if (changePasswordForm.value.username !== currentUsername) {
    showNotification('只能修改自己账号的密码', 'error');
    return;
  }
  
  if (!changePasswordForm.value.newPassword) {
    showNotification('请输入新密码', 'error');
    return;
  }
  
  if (changePasswordForm.value.newPassword.length < 6) {
    showNotification('密码长度不能少于6位', 'error');
    return;
  }
  
  if (!changePasswordForm.value.confirmPassword) {
    showNotification('请输入确认密码', 'error');
    return;
  }
  
  if (changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword) {
    showNotification('两次输入的密码不一致', 'error');
    return;
  }
  
  const index = users.value.findIndex(u => u.username === changePasswordForm.value.username);
  if (index !== -1) {
    // 这里应该调用 API 更新密码，现在只是模拟
    users.value[index] = {
      ...users.value[index],
      password: changePasswordForm.value.newPassword // 实际应用中应该加密
    };
    showChangePasswordModalVisible.value = false;
    showNotification('密码已更改', 'success');
  } else {
    showNotification('用户不存在', 'error');
  }
};

// 续约平台
const renewPlatform = () => {
  if (!renewPlatformForm.value.expiryTime && !renewPlatformForm.value.isPermanent) {
    showNotification('请选择到期时间或选择永久', 'error');
    return;
  }
  
  if (!renewPlatformForm.value.hashCode) {
    showNotification('请生成哈希码', 'error');
    return;
  }
  
  const index = platforms.value.findIndex(p => p.id === renewPlatformForm.value.id);
  if (index !== -1) {
    // 设置到期时间
    let expiryTime = '';
    if (renewPlatformForm.value.isPermanent) {
      expiryTime = '9999-12-31T23:59:59.999Z';
    } else {
      expiryTime = new Date(renewPlatformForm.value.expiryTime).toISOString();
    }
    
    platforms.value[index] = {
      ...platforms.value[index],
      expiryTime: expiryTime,
      hashCode: renewPlatformForm.value.hashCode
    };
    
    showRenewPlatformModalVisible.value = false;
    showNotification('平台已续约', 'success');
  }
};

// 获取平台的初始管理员账号
const getPlatformAdmin = (platformId: string) => {
  const adminUser = users.value.find(user => user.platformId === platformId && user.roleName === '超级管理员');
  return adminUser?.username || '';
};

export {
  // 状态
  tabs,
  activeTab,
  currentUserRole,
  currentUserPermissions,
  currentPlatformId,
  platforms,
  users,
  roles,
  pages,
  showAddUserModalVisible,
  showEditUserModalVisible,
  showAddRoleModalVisible,
  showEditRoleModalVisible,
  showAddPageModalVisible,
  showEditPageModalVisible,
  showAddPlatformModalVisible,
  showEditPlatformModalVisible,
  showRenewPlatformModalVisible,
  addUserForm,
  editUserForm,
  addRoleForm,
  editRoleForm,
  addPageForm,
  editPageForm,
  addPlatformForm,
  editPlatformForm,
  renewPlatformForm,
  showChangePasswordModalVisible,
  changePasswordForm,
  notificationVisible,
  notificationMessage,
  notificationType,
  
  // 计算属性
  isPlatformAdmin,
  isSuperAdmin,
  visibleUsers,
  visiblePages,
  
  // 方法
  canOperateUser,
  canToggleUserStatus,
  initCurrentUserInfo,
  showNotification,
  closeNotification,
  showAddUserModal,
  showEditUserModal,
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  showAddRoleModal,
  showEditRoleModal,
  addRole,
  updateRole,
  toggleRoleStatus,
  deleteRole,
  showAddPageModal,
  showEditPageModal,
  addFunction,
  removeFunction,
  addEditFunction,
  removeEditFunction,
  addPage,
  updatePage,
  deletePage,
  showAddPlatformModal,
  showEditPlatformModal,
  showRenewPlatformModal,
  generateHashCode,
  addPlatform,
  updatePlatform,
  renewPlatform,
  togglePlatformStatus,
  showChangePasswordModal,
  changePassword,
  getPlatformAdmin
};
