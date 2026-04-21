<template>
  <div class="account-manage-container">
    <div class="page-header">
      <h2 class="page-title">账号管理</h2>
      <div class="page-subtitle">Account Management</div>
    </div>
    
    <div class="content-area">
      <!-- 标签页导航 -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- 平台管理 -->
      <div v-show="activeTab === 'platform'" class="tab-content">
        <div class="section-header">
          <h3>平台管理</h3>
          <button class="action-btn primary" @click="showAddPlatformModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增平台
          </button>
        </div>
        
        <div class="platform-table-container">
          <div class="table-wrapper">
            <table class="platform-table">
              <thead>
                <tr>
                  <th>平台ID</th>
                  <th>平台名称</th>
                  <th>状态</th>
                  <th>到期时间</th>
                  <th>哈希码</th>
                  <th>创建时间</th>
                  <th>初始账号</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>
            <div class="table-body">
              <table class="platform-table">
                <tbody>
                  <tr v-for="(platform, index) in platforms" :key="index">
                    <td>{{ platform.id }}</td>
                    <td>{{ platform.name }}</td>
                    <td>
                      <span class="status-badge" :class="platform.status">
                        {{ platform.statusText }}
                      </span>
                    </td>
                    <td>{{ new Date(platform.expiryTime).toLocaleString('zh-CN') }}</td>
                    <td>{{ platform.hashCode }}</td>
                    <td>{{ platform.createdAt }}</td>
                    <td>{{ getPlatformAdmin(platform.id) }}</td>
                    <td>
                      <button class="table-btn" @click="togglePlatformStatus(platform)">
                        {{ platform.status === 'active' ? '禁用' : '启用' }}
                      </button>
                      <button class="table-btn" @click="showEditPlatformModal(platform)">编辑</button>
                      <button class="table-btn" @click="showRenewPlatformModal(platform)">续约</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户管理 -->
      <div v-show="activeTab === 'user'" class="tab-content">
        <div class="section-header">
          <h3>用户管理</h3>
          <button v-if="isPlatformAdmin || isSuperAdmin" class="action-btn primary" @click="showAddUserModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增用户
          </button>
        </div>
        
        <div class="user-table-container">
          <div class="table-wrapper">
            <table class="user-table">
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>角色</th>
                  <th v-if="isPlatformAdmin">平台</th>
                  <th>创建时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>
            <div class="table-body">
              <table class="user-table">
                <tbody>
                  <tr v-for="(user, index) in visibleUsers" :key="index">
                    <td>{{ user.username }}</td>
                    <td>{{ user.roleName }}</td>
                    <td v-if="isPlatformAdmin">{{ user.platformId }}</td>
                    <td>{{ user.createdAt }}</td>
                    <td>
                      <span class="status-badge" :class="user.status">
                        {{ user.statusText }}
                      </span>
                    </td>
                    <td>
                      <button v-if="canOperateUser(user)" class="table-btn" @click="showEditUserModal(user)">编辑</button>
                      <button v-if="canOperateUser(user)" class="table-btn" @click="deleteUser(user.username)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        删除
                      </button>
                      <button v-if="canToggleUserStatus(user)" class="table-btn" @click="toggleUserStatus(user)">
                        {{ user.status === 'active' ? '禁用' : '启用' }}
                      </button>
                      <button class="table-btn" @click="showChangePasswordModal(user)">更改密码</button>
                      <span v-if="!canOperateUser(user) && user.username !== currentUsername" class="no-permission">无权限</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 角色管理 -->
      <div v-show="activeTab === 'role'" class="tab-content">
        <div class="section-header">
          <h3>角色管理</h3>
          <button class="action-btn primary" @click="showAddRoleModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增角色
          </button>
        </div>
        
        <div class="role-table-container">
          <div class="table-wrapper">
            <table class="role-table">
              <thead>
                <tr>
                  <th>角色名称</th>
                  <th>权限数量</th>
                  <th>创建时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>
            <div class="table-body">
              <table class="role-table">
                <tbody>
                  <tr v-for="(role, index) in roles" :key="index">
                    <td>{{ role.name }}</td>
                    <td>{{ role.permissions.length }}</td>
                    <td>{{ role.createdAt }}</td>
                    <td>
                      <span class="status-badge" :class="role.status">
                        {{ role.statusText }}
                      </span>
                    </td>
                    <td>
                      <button class="table-btn" @click="showEditRoleModal(role)">编辑</button>
                      <button class="table-btn" @click="toggleRoleStatus(role)">
                        {{ role.status === 'active' ? '禁用' : '启用' }}
                      </button>
                      <button class="table-btn" @click="deleteRole(role.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 页面管理 -->
      <div v-show="activeTab === 'page'" class="tab-content">
        <div class="section-header">
          <h3>页面管理</h3>
          <button class="action-btn primary" @click="showAddPageModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增页面
          </button>
        </div>
        
        <div class="page-table-container">
          <div class="table-wrapper">
            <table class="page-table">
              <thead>
                <tr>
                  <th>页面名称</th>
                  <th>路径</th>
                  <th>功能数量</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>
            <div class="table-body">
              <table class="page-table">
                <tbody>
                  <tr v-for="(page, index) in pages" :key="index">
                    <td>{{ page.name }}</td>
                    <td>{{ page.path }}</td>
                    <td>{{ page.functions.length }}</td>
                    <td>
                      <button class="table-btn" @click="showEditPageModal(page)">编辑</button>
                      <button class="table-btn" @click="deletePage(page.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新增用户模态框 -->
    <div v-if="showAddUserModalVisible" class="modal-overlay" @click="showAddUserModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增用户</h3>
          <button class="modal-close" @click="showAddUserModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="addUserForm.username" />
            </div>
            <div class="form-item">
              <label>密码</label>
              <input type="password" v-model="addUserForm.password" />
            </div>
            <div class="form-item full-width">
              <label>选择角色</label>
              <select v-model="addUserForm.roleId" class="form-select">
                <option value="" disabled>请选择角色</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showAddUserModalVisible = false">取消</button>
          <button class="btn primary" @click="addUser">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑用户模态框 -->
    <div v-if="showEditUserModalVisible" class="modal-overlay" @click="showEditUserModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑用户</h3>
          <button class="modal-close" @click="showEditUserModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="editUserForm.username" readonly />
            </div>
            <div class="form-item">
              <label>密码</label>
              <input type="password" v-model="editUserForm.password" placeholder="留空表示不修改" />
            </div>
            <div class="form-item">
              <label>选择角色</label>
              <select v-model="editUserForm.roleId" class="form-select">
                <option value="" disabled>请选择角色</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>选择平台</label>
              <select v-model="editUserForm.platformId" :disabled="!isPlatformAdmin" class="form-select">
                <option value="" disabled>请选择平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">{{ platform.name }}</option>
              </select>
            </div>
            <div class="form-item full-width">
              <label>状态</label>
              <select v-model="editUserForm.status" class="form-select">
                <option value="" disabled>请选择状态</option>
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showEditUserModalVisible = false">取消</button>
          <button class="btn primary" @click="updateUser">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 新增角色模态框 -->
    <div v-if="showAddRoleModalVisible" class="modal-overlay" @click="showAddRoleModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增角色</h3>
          <button class="modal-close" @click="showAddRoleModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>角色名称</label>
              <input type="text" v-model="addRoleForm.name" />
            </div>
            <div class="form-item full-width">
              <label>可访问页面</label>
              <div class="permission-list">
                <div v-for="page in visiblePages" :key="page.id" class="permission-item">
                  <input type="checkbox" :id="`page-${page.id}`" v-model="addRoleForm.pagePermissions[page.id]" />
                  <label :for="`page-${page.id}`">{{ page.name }}</label>
                  <div class="function-permissions">
                    <div v-for="func in page.functions" :key="func.id" class="function-item">
                      <input 
                        type="checkbox" 
                        :id="`func-${page.id}-${func.id}`" 
                        v-model="addRoleForm.functionPermissions[`${page.id}-${func.id}`]"
                        :disabled="!addRoleForm.pagePermissions[page.id]"
                      />
                      <label :for="`func-${page.id}-${func.id}`">{{ func.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showAddRoleModalVisible = false">取消</button>
          <button class="btn primary" @click="addRole">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑角色模态框 -->
    <div v-if="showEditRoleModalVisible" class="modal-overlay" @click="showEditRoleModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑角色</h3>
          <button class="modal-close" @click="showEditRoleModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>角色名称</label>
              <input type="text" v-model="editRoleForm.name" />
            </div>
            <div class="form-item full-width">
              <label>可访问页面</label>
              <div class="permission-list">
                <div v-for="page in visiblePages" :key="page.id" class="permission-item">
                  <input type="checkbox" :id="`edit-page-${page.id}`" v-model="editRoleForm.pagePermissions[page.id]" />
                  <label :for="`edit-page-${page.id}`">{{ page.name }}</label>
                  <div class="function-permissions">
                    <div v-for="func in page.functions" :key="func.id" class="function-item">
                      <input 
                        type="checkbox" 
                        :id="`edit-func-${page.id}-${func.id}`" 
                        v-model="editRoleForm.functionPermissions[`${page.id}-${func.id}`]"
                        :disabled="!editRoleForm.pagePermissions[page.id]"
                      />
                      <label :for="`edit-func-${page.id}-${func.id}`">{{ func.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showEditRoleModalVisible = false">取消</button>
          <button class="btn primary" @click="updateRole">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 新增页面模态框 -->
    <div v-if="showAddPageModalVisible" class="modal-overlay" @click="showAddPageModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增页面</h3>
          <button class="modal-close" @click="showAddPageModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>页面名称</label>
              <input type="text" v-model="addPageForm.name" />
            </div>
            <div class="form-item">
              <label>页面路径</label>
              <input type="text" v-model="addPageForm.path" />
            </div>
            <div class="form-item full-width">
              <label>页面功能</label>
              <div class="function-list">
                <div v-for="(func, index) in addPageForm.functions" :key="index" class="function-input">
                  <input type="text" v-model="func.name" placeholder="功能名称" />
                  <input type="text" v-model="func.code" placeholder="功能代码" />
                  <button class="remove-btn" @click="removeFunction(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <button class="add-function-btn" @click="addFunction">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  添加功能
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showAddPageModalVisible = false">取消</button>
          <button class="btn primary" @click="addPage">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑页面模态框 -->
    <div v-if="showEditPageModalVisible" class="modal-overlay" @click="showEditPageModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑页面</h3>
          <button class="modal-close" @click="showEditPageModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>页面名称</label>
              <input type="text" v-model="editPageForm.name" />
            </div>
            <div class="form-item">
              <label>页面路径</label>
              <input type="text" v-model="editPageForm.path" />
            </div>
            <div class="form-item full-width">
              <label>页面功能</label>
              <div class="function-list">
                <div v-for="(func, index) in editPageForm.functions" :key="index" class="function-input">
                  <input type="text" v-model="func.name" placeholder="功能名称" />
                  <input type="text" v-model="func.code" placeholder="功能代码" />
                  <button class="remove-btn" @click="removeEditFunction(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <button class="add-function-btn" @click="addEditFunction">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  添加功能
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showEditPageModalVisible = false">取消</button>
          <button class="btn primary" @click="updatePage">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 新增平台模态框 -->
    <div v-if="showAddPlatformModalVisible" class="modal-overlay" @click="showAddPlatformModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增平台</h3>
          <button class="modal-close" @click="showAddPlatformModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>平台名称</label>
              <input type="text" v-model="addPlatformForm.name" />
            </div>
            <div class="form-item full-width">
              <label>系统名称</label>
              <input type="text" v-model="addPlatformForm.systemName" placeholder="请输入系统名称" />
            </div>
            <div class="form-item full-width">
              <label>到期时间</label>
              <div class="expiry-time-container">
                <el-date-picker
                  v-model="addPlatformForm.expiryTime"
                  type="datetime"
                  placeholder="请选择到期时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :disabled="addPlatformForm.isPermanent"
                  class="custom-date-picker"
                />
                <div class="permanent-checkbox">
                  <el-checkbox v-model="addPlatformForm.isPermanent" label="永久" />
                </div>
              </div>
            </div>
            <div class="form-item full-width">
              <label>哈希码</label>
              <div class="hash-code-container">
                <input type="text" v-model="addPlatformForm.hashCode" readonly />
                <button class="btn primary generate-btn" @click="generateHashCode(addPlatformForm)">生成</button>
              </div>
            </div>
            <div class="form-item full-width">
              <label>初始超级管理员信息</label>
              <div class="admin-info-section">
                <div class="form-item">
                  <label>用户名</label>
                  <input type="text" v-model="addPlatformForm.adminUsername" placeholder="请输入超级管理员用户名" />
                </div>
                <div class="form-item">
                  <label>密码</label>
                  <input type="password" v-model="addPlatformForm.adminPassword" placeholder="请输入超级管理员密码" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showAddPlatformModalVisible = false">取消</button>
          <button class="btn primary" @click="addPlatform">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑平台模态框 -->
    <div v-if="showEditPlatformModalVisible" class="modal-overlay" @click="showEditPlatformModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑平台</h3>
          <button class="modal-close" @click="showEditPlatformModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>平台名称</label>
              <input type="text" v-model="editPlatformForm.name" />
            </div>
            <div class="form-item full-width">
              <label>系统名称</label>
              <input type="text" v-model="editPlatformForm.systemName" placeholder="请输入系统名称" />
            </div>
            <div class="form-item full-width">
              <label>初始超级管理员信息</label>
              <div class="admin-info-section">
                <div class="form-item">
                  <label>用户名</label>
                  <input type="text" v-model="editPlatformForm.adminUsername" placeholder="请输入超级管理员用户名" />
                </div>
                <div class="form-item">
                  <label>密码</label>
                  <input type="password" v-model="editPlatformForm.adminPassword" placeholder="留空表示不修改" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showEditPlatformModalVisible = false">取消</button>
          <button class="btn primary" @click="updatePlatform">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 续约平台模态框 -->
    <div v-if="showRenewPlatformModalVisible" class="modal-overlay" @click="showRenewPlatformModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>平台续约</h3>
          <button class="modal-close" @click="showRenewPlatformModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>到期时间</label>
              <div class="expiry-time-container">
                <el-date-picker
                  v-model="renewPlatformForm.expiryTime"
                  type="datetime"
                  placeholder="请选择到期时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :disabled="renewPlatformForm.isPermanent"
                  class="custom-date-picker"
                />
                <div class="permanent-checkbox">
                  <el-checkbox v-model="renewPlatformForm.isPermanent" label="永久" />
                </div>
              </div>
            </div>
            <div class="form-item full-width">
              <label>哈希码</label>
              <div class="hash-code-container">
                <input type="text" v-model="renewPlatformForm.hashCode" readonly />
                <button class="btn primary generate-btn" @click="generateHashCode(renewPlatformForm)">生成</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showRenewPlatformModalVisible = false">取消</button>
          <button class="btn primary" @click="renewPlatform">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 更改密码模态框 -->
    <div v-if="showChangePasswordModalVisible" class="modal-overlay" @click="showChangePasswordModalVisible = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>更改密码</h3>
          <button class="modal-close" @click="showChangePasswordModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item full-width">
              <label>用户名</label>
              <input type="text" v-model="changePasswordForm.username" readonly />
            </div>
            <div class="form-item full-width">
              <label>新密码 <span class="required">*</span></label>
              <input type="password" v-model="changePasswordForm.newPassword" placeholder="请输入新密码（至少6位）" />
            </div>
            <div class="form-item full-width">
              <label>确认密码 <span class="required">*</span></label>
              <input type="password" v-model="changePasswordForm.confirmPassword" placeholder="请再次输入新密码" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="showChangePasswordModalVisible = false">取消</button>
          <button class="btn primary" @click="changePassword">保存</button>
        </div>
      </div>
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

<script setup lang="ts">
import { onMounted } from 'vue'
import Notification from '../components/Notification.vue'
import { ElDatePicker, ElCheckbox } from 'element-plus'
import {
  // 状态
  tabs,
  activeTab,
  platforms,
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
  showChangePasswordModalVisible,
  addUserForm,
  editUserForm,
  addRoleForm,
  editRoleForm,
  addPageForm,
  editPageForm,
  addPlatformForm,
  editPlatformForm,
  renewPlatformForm,
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
} from '../stores/accountStore'

// 计算最小到期时间（当前时间）
const minExpiryTime = new Date().toISOString().slice(0, 16)

// 当前用户名
const currentUsername = localStorage.getItem('username') || ''

// 初始化当前用户信息
onMounted(() => {
  initCurrentUserInfo()
})
</script>

<style scoped lang="less">
.account-manage-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  
  .page-header {
    margin-bottom: 25px;
    
    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 5px 0;
      background: linear-gradient(135deg, #00e5ff 0%, #00bfff 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .page-subtitle {
      font-size: 14px;
      color: rgba(0, 229, 255, 0.6);
      letter-spacing: 1px;
    }
  }
  
  .content-area {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  // 标签页
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    .tab-button {
      padding: 10px 20px;
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 6px;
      background: rgba(0, 229, 255, 0.05);
      color: rgba(0, 229, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      
      &:hover {
        background: rgba(0, 229, 255, 0.1);
        border-color: #00e5ff;
      }
      
      &.active {
        background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
        color: #0a1929;
        border-color: #00e5ff;
        font-weight: 600;
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
      }
    }
  }
  
  // 标签内容
  .tab-content {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #00e5ff;
        margin: 0;
      }
      
      .action-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 6px;
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.3);
        color: #00e5ff;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(0, 229, 255, 0.2);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
        }
        
        &.primary {
          background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
          color: #0a1929;
          font-weight: 600;
          
          &:hover {
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
          }
        }
      }
    }
  }
  
  // 表格容器
  .user-table-container,
  .role-table-container,
  .page-table-container,
  .platform-table-container {
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 12px;
    padding: 20px;
    max-height: calc(100vh - 320px);
    min-height: 200px;
    
    .table-wrapper {
      width: 100%;
      
      table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid rgba(0, 229, 255, 0.1);
        }
        
        th {
          font-weight: 600;
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        td {
          color: rgba(255, 255, 255, 0.8);
        }
        
        tr:hover {
          background: rgba(0, 229, 255, 0.05);
        }
      }
      
      .table-body {
        max-height: calc(100vh - 400px);
        min-height: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        
        &::-webkit-scrollbar {
          width: 8px;
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
    }
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    
    &.active {
      background: rgba(0, 230, 118, 0.2);
      color: #00e676;
    }
    
    &.inactive {
      background: rgba(120, 144, 156, 0.2);
      color: #78909c;
    }
  }
  
  .table-btn {
    padding: 4px 12px;
    margin-right: 8px;
    border-radius: 4px;
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    color: #00e5ff;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    
    &:hover {
      background: rgba(0, 229, 255, 0.2);
    }
  }
  
  .no-permission {
    color: rgba(0, 229, 255, 0.5);
    font-size: 12px;
    font-style: italic;
  }
  
  td:last-child {
    white-space: nowrap;
  }
  
  // 模态框样式
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
    display: flex;
    flex-direction: column;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-shrink: 0;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #00e5ff;
        margin: 0;
      }
      
      .modal-close {
        background: none;
        border: none;
        color: rgba(0, 229, 255, 0.6);
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: all 0.3s ease;
        
        &:hover {
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.1);
        }
      }
    }
    
    .modal-body {
      margin-bottom: 20px;
      flex: 1;
      overflow-y: auto;
      max-height: calc(80vh - 140px);
      
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(0, 229, 255, 0.05);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 229, 255, 0.3);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 229, 255, 0.5);
      }
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex-shrink: 0;
    }
  }
  
  // 表单网格
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    
    .form-item {
      display: flex;
      flex-direction: column;
      
      &.full-width {
        grid-column: 1 / -1;
      }
      
      label {
        font-size: 14px;
        color: rgba(0, 229, 255, 0.7);
        margin-bottom: 5px;
      }
      
      input,
      select,
      textarea {
        padding: 10px;
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 6px;
        background: rgba(0, 229, 255, 0.05);
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: #00e5ff;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
        }
        
        &:read-only {
          background: rgba(0, 229, 255, 0.03);
          cursor: not-allowed;
        }
      }
      
      select,
      .form-select {
        /* 下拉选项区域的背景 */
        background: rgba(0, 229, 255, 0.05) !important;
        /* 去掉默认箭头，自己画 */
        appearance: none;
        background-image: linear-gradient(45deg, transparent 50%, rgba(0, 229, 255, 0.5) 50%),
                          linear-gradient(135deg, rgba(0, 229, 255, 0.5) 50%, transparent 50%);
        background-position: calc(100% - 20px) calc(1em + 2px),
                          calc(100% - 15px) calc(1em + 2px);
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
        padding-right: 30px;
        cursor: pointer;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #00e5ff;
          background-color: rgba(0, 229, 255, 0.08);
        }
        
        &:focus {
          z-index: 2;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
        }
        
        /* 下拉里每个选项的背景 */
        option {
          background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 12px 16px;
          font-size: 14px;
          border: none;
          outline: none;
        }

        /* 下拉里每个选项的悬停背景 */
        option:hover {
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 128, 255, 0.15) 100%) !important;
          color: #00e5ff !important;
        }

        /* 选中那一项的背景 */
        option:checked {
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(0, 128, 255, 0.25) 100%) !important;
          color: #00e5ff !important;
          font-weight: 600;
        }

        /* 禁用选项的背景 */
        option:disabled {
          background: rgba(0, 229, 255, 0.03) !important;
          color: rgba(0, 229, 255, 0.3) !important;
          cursor: not-allowed;
          opacity: 0.6;
        }
      }
      
      textarea {
        resize: vertical;
      }
      
      .hash-code-container {
        display: flex;
        gap: 10px;
        
        input {
          flex: 1;
        }
        
        .generate-btn {
          padding: 10px 16px;
          white-space: nowrap;
        }
      }
      
      .expiry-time-container {
        display: flex;
        align-items: center;
        gap: 15px;
        
        input {
          flex: 1;
        }
        
        .permanent-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          
          label {
            margin-left: 0;
            cursor: pointer;
          }
          
          input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
            accent-color: #00e5ff;
          }
        }
      }
      
      .admin-info-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 10px;
        padding: 15px;
        background: rgba(0, 229, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(0, 229, 255, 0.2);
        
        .form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  
  // 按钮样式
  .btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    
    &.primary {
      background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
      color: #0a1929;
      font-weight: 600;
      
      &:hover {
        box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
      }
    }
    
    &.secondary {
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.3);
      color: #00e5ff;
      
      &:hover {
        background: rgba(0, 229, 255, 0.2);
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
      }
    }
  }
  
  // 权限列表
  .permission-list {
    .permission-item {
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 6px;
      background: rgba(0, 229, 255, 0.05);
      
      label {
        margin-left: 8px;
        font-weight: 500;
        cursor: pointer;
      }
      
      input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
        accent-color: #00e5ff;
      }
      
      .function-permissions {
        margin-top: 10px;
        margin-left: 25px;
        
        .function-item {
          margin-bottom: 5px;
          
          label {
            margin-left: 8px;
            font-weight: normal;
            font-size: 13px;
            cursor: pointer;
          }
          
          input:disabled + label {
            color: rgba(0, 229, 255, 0.4);
            cursor: not-allowed;
          }
          
          input[type="checkbox"] {
            cursor: pointer;
            width: 14px;
            height: 14px;
            accent-color: #00e5ff;
          }
          
          input:disabled {
            cursor: not-allowed;
          }
        }
      }
    }
  }
  
  // 功能列表
  .function-list {
    .function-input {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      
      input {
        flex: 1;
      }
      
      .remove-btn {
        background: rgba(255, 77, 79, 0.1);
        border: 1px solid rgba(255, 77, 79, 0.3);
        color: #ff4d4f;
        padding: 0 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 77, 79, 0.2);
          border-color: #ff4d4f;
        }
      }
    }
  }
  
  .add-function-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    background: rgba(0, 229, 255, 0.1);
    border: 1px solid rgba(0, 229, 255, 0.3);
    color: #00e5ff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
    
    &:hover {
      background: rgba(0, 229, 255, 0.2);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
    }
  }
}
</style>
