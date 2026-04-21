<template>
  <div class="device-manage-container">
    <div class="page-header">
      <h2 class="page-title">设备管理</h2>
      <div class="page-subtitle">Device Management</div>
    </div>
    
    <div class="content-area">
      <div class="stats-cards">
        <div class="stat-card" @click="showStatsDetail('total')">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ totalDevices }}</div>
            <div class="stat-label">设备总数</div>
          </div>
          <div class="stat-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </div>
        
        <div class="stat-card online" @click="showStatsDetail('online')">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ onlineDevices }}</div>
            <div class="stat-label">在线设备</div>
          </div>
          <div class="stat-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </div>
        
        <div class="stat-card offline" @click="showStatsDetail('offline')">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ offlineDevices }}</div>
            <div class="stat-label">离线设备</div>
          </div>
          <div class="stat-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </div>
        
        <div class="stat-card warning" @click="showStatsDetail('warning')">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ warningDevices }}</div>
            <div class="stat-label">告警设备</div>
          </div>
          <div class="stat-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="device-table-container">
        <div class="table-header">
          <div class="header-left">
            <h3>设备列表</h3>
            <div v-if="isPlatformAdmin" class="platform-filter">
              <label>平台筛选：</label>
              <select v-model="selectedPlatform" @change="filterDevices" class="form-select">
                <option value="">全部平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">{{ platform.name }}</option>
              </select>
            </div>
          </div>
          <div class="table-actions">
            <button class="action-btn primary" @click="showAddDeviceModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新增设备
            </button>
            <button class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              导出
            </button>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="device-table">
            <thead>
              <tr>
                <th>设备编号</th>
                <th>设备名称</th>
                <th>设备类型</th>
                <th>所属区域</th>
                <th v-if="isPlatformAdmin">所属平台</th>
                <th>运行状态</th>
                <th>最后在线时间</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>
          <div class="table-body">
            <table class="device-table">
              <tbody>
                <tr v-for="(device, index) in filteredDeviceList" :key="index">
                  <td>{{ device.code }}</td>
                  <td>{{ device.name }}</td>
                  <td>{{ device.type }}</td>
                  <td>{{ device.location }}</td>
                  <td v-if="isPlatformAdmin">{{ getPlatformName(device.platformId) }}</td>
                  <td>
                    <span class="status-badge" :class="device.status">
                      {{ device.statusText }}
                    </span>
                  </td>
                  <td>{{ device.createdAt }}</td>
                  <td>
                    <button class="table-btn" @click="showDeviceDetail(device)">查看</button>
                    <button class="table-btn" @click="showEditDeviceModal(device)">编辑</button>
                    <button class="table-btn" @click="showDeviceRepairs(device)">维修记录</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设备详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>设备详情</h3>
          <button class="modal-close" @click="closeDetailModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>设备编号</label>
              <span>{{ selectedDevice?.code }}</span>
            </div>
            <div class="detail-item">
              <label>设备名称</label>
              <span>{{ selectedDevice?.name }}</span>
            </div>
            <div class="detail-item">
              <label>设备类型</label>
              <span>{{ selectedDevice?.type }}</span>
            </div>
            <div class="detail-item">
              <label>所属区域</label>
              <span>{{ selectedDevice?.area }}</span>
            </div>
            <div class="detail-item">
              <label>所属平台</label>
              <span>{{ selectedDevice?.platformId ? getPlatformName(selectedDevice.platformId) : '未知平台' }}</span>
            </div>
            <div class="detail-item">
              <label>运行状态</label>
              <span class="status-badge" :class="selectedDevice?.status">
                {{ selectedDevice?.statusText }}
              </span>
            </div>
            <div class="detail-item">
              <label>最后在线时间</label>
              <span>{{ selectedDevice?.lastOnline }}</span>
            </div>
            <div class="detail-item full-width">
              <label>设备描述</label>
              <span>{{ selectedDevice?.description || '暂无描述' }}</span>
            </div>
            <div class="detail-item full-width">
              <label>设备位置</label>
              <span>{{ selectedDevice?.location || '暂无位置信息' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑设备模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑设备</h3>
          <button class="modal-close" @click="closeEditModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>设备编号</label>
              <input type="text" v-model="editForm.code" readonly />
            </div>
            <div class="form-item">
              <label>设备名称</label>
              <input type="text" v-model="editForm.name" />
            </div>
            <div class="form-item">
              <label>设备类型</label>
              <select v-model="editForm.type" class="form-select">
                <option value="" disabled>请选择设备类型</option>
                <option value="监测站">监测站</option>
                <option value="传感器">传感器</option>
                <option value="控制阀">控制阀</option>
              </select>
            </div>
            <div class="form-item">
              <label>所属区域</label>
              <input type="text" v-model="editForm.area" />
            </div>
            <div class="form-item" v-if="isPlatformAdmin">
              <label>所属平台</label>
              <select v-model="editForm.platformId" class="form-select">
                <option value="" disabled>请选择平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">{{ platform.name }}</option>
              </select>
            </div>
            <div class="form-item" v-else>
              <label>所属平台</label>
              <input type="text" v-model="currentPlatformName" readonly />
            </div>
            <div class="form-item full-width">
              <label>设备描述</label>
              <textarea v-model="editForm.description" rows="3"></textarea>
            </div>
            <div class="form-item full-width">
              <label>设备位置</label>
              <input type="text" v-model="editForm.location" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeEditModal">取消</button>
          <button class="btn primary" @click="saveDevice">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 新增设备模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增设备</h3>
          <button class="modal-close" @click="closeAddModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>设备编号</label>
              <input type="text" v-model="addForm.code" />
            </div>
            <div class="form-item">
              <label>设备名称</label>
              <input type="text" v-model="addForm.name" />
            </div>
            <div class="form-item">
              <label>设备类型</label>
              <select v-model="addForm.type" class="form-select">
                <option value="" disabled>请选择设备类型</option>
                <option value="监测站">监测站</option>
                <option value="传感器">传感器</option>
                <option value="控制阀">控制阀</option>
              </select>
            </div>
            <div class="form-item">
              <label>所属区域</label>
              <input type="text" v-model="addForm.area" />
            </div>
            <div class="form-item full-width">
              <label>设备描述</label>
              <textarea v-model="addForm.description" rows="3"></textarea>
            </div>
            <div class="form-item full-width">
              <label>设备位置</label>
              <input type="text" v-model="addForm.location" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeAddModal">取消</button>
          <button class="btn primary" @click="addDevice">添加</button>
        </div>
      </div>
    </div>
    
    <!-- 统计详情模态框 -->
    <div v-if="showStatsModal" class="modal-overlay" @click="closeStatsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ statsModalTitle }}</h3>
          <button class="modal-close" @click="closeStatsModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="stats-detail">
            <p>{{ statsModalContent }}</p>
            <div class="stats-list">
              <div v-for="(device, index) in filteredDevices" :key="index" class="stats-item">
                <span class="device-code">{{ device.code }}</span>
                <span class="device-name">{{ device.name }}</span>
                <span class="status-badge" :class="device.status">
                  {{ device.statusText }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeStatsModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 设备维修记录模态框 -->
    <div v-if="showRepairModal" class="modal-overlay" @click="closeRepairModal">
      <div class="modal-content repair-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDevice?.name }} - 维修记录</h3>
          <div class="modal-actions">
            <button class="btn secondary" @click="openAddRepairModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新增维修记录
            </button>
            <button class="modal-close" @click="closeRepairModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div v-if="loadingRepairs" class="loading">
            加载中...
          </div>
          <div v-else-if="deviceRepairs.length === 0" class="empty">
            暂无维修记录
          </div>
          <div v-else class="repair-list">
            <div class="repair-item" v-for="repair in deviceRepairs" :key="repair.id">
              <div class="repair-header">
                <div class="repair-type">{{ repair.repairType }}</div>
                <span class="status-badge" :class="repair.status">
                  {{ statusText[repair.status] }}
                </span>
              </div>
              <div class="repair-content">
                <div class="repair-date">{{ formatDate(repair.repairDate) }}</div>
                <div class="repair-description">{{ repair.description }}</div>
                <div class="repair-meta">
                  <span>维修人员：{{ repair.technician }}</span>
                  <span>维修费用：¥{{ repair.repairCost.toFixed(2) }}</span>
                </div>
                <div v-if="repair.partsReplaced.length > 0" class="repair-parts">
                  <span>更换零件：</span>
                  <span>{{ repair.partsReplaced.join('，') }}</span>
                </div>
              </div>
              <div class="repair-actions">
                <button class="table-btn" @click="editRepair(repair)">编辑</button>
                <button class="table-btn delete-btn" @click="handleDeleteRepair(repair.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeRepairModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 新增/编辑维修记录模态框 -->
    <div v-if="showAddRepairModal || showEditRepairModal" class="modal-overlay" @click="closeRepairFormModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditRepairModal ? '编辑维修记录' : '新增维修记录' }}</h3>
          <button class="modal-close" @click="closeRepairFormModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>维修类型</label>
              <select v-model="repairForm.repairType" class="form-select">
                <option value="" disabled>请选择维修类型</option>
                <option value="维护">维护</option>
                <option value="故障修复">故障修复</option>
                <option value="更换零件">更换零件</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="form-item">
              <label>维修状态</label>
              <select v-model="repairForm.status" class="form-select">
                <option value="pending">待处理</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div class="form-item full-width">
              <label>维修描述</label>
              <textarea v-model="repairForm.description" rows="3" class="form-textarea"></textarea>
            </div>
            <div class="form-item">
              <label>维修费用</label>
              <input type="number" v-model.number="repairForm.repairCost" class="form-input" placeholder="请输入维修费用">
            </div>
            <div class="form-item">
              <label>维修人员</label>
              <input type="text" v-model="repairForm.technician" class="form-input" placeholder="请输入维修人员">
            </div>
            <div class="form-item full-width">
              <label>更换零件</label>
              <input type="text" v-model="partsInput" class="form-input" placeholder="请输入更换的零件，多个用逗号分隔">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeRepairFormModal">取消</button>
          <button class="btn primary" @click="saveRepair">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useDeviceStore from '../stores/deviceStore'

const {
  platforms,
  deviceList,
  showDetailModal,
  showEditModal,
  showAddModal,
  showStatsModal,
  selectedDevice,
  editForm,
  addForm,
  statsModalTitle,
  statsModalContent,
  selectedPlatform,
  
  // 计算属性
  isPlatformAdmin,
  currentPlatformName,
  filteredDeviceList,
  totalDevices,
  onlineDevices,
  offlineDevices,
  warningDevices,
  filteredDevices,
  
  // 方法
  getPlatformName,
  filterDevices,
  showDeviceDetail,
  closeDetailModal,
  showEditDeviceModal,
  closeEditModal,
  saveDevice,
  showAddDeviceModal,
  closeAddModal,
  addDevice,
  showStatsDetail,
  closeStatsModal
} = useDeviceStore()
import useRepairStore from '../stores/repairStore'
import { ElMessage } from 'element-plus'
import type { RepairRecord, RepairForm } from '../types/repair'

// 维修记录相关状态
const { getRepairsByDevice, addRepair, updateRepair, deleteRepair: deleteRepairStore } = useRepairStore()

const showRepairModal = ref(false)
const showAddRepairModal = ref(false)
const showEditRepairModal = ref(false)
const loadingRepairs = ref(false)
const deviceRepairs = ref<RepairRecord[]>([])
const currentRepair = ref<RepairRecord | null>(null)

// 维修记录表单
const repairForm = ref<RepairForm>({
  deviceId: '',
  repairType: '',
  description: '',
  partsReplaced: [],
  repairCost: 0,
  technician: '',
  status: 'pending'
})

// 零件输入
const partsInput = ref('')

// 状态文本
const statusText = {
  completed: '已完成',
  pending: '待处理',
  in_progress: '进行中'
}

// 查看设备维修记录
const showDeviceRepairs = (device: any) => {
  selectedDevice.value = device
  loadingRepairs.value = true
  
  // 模拟异步加载
  setTimeout(() => {
    deviceRepairs.value = getRepairsByDevice(device.id)
    loadingRepairs.value = false
  }, 300)
  
  showRepairModal.value = true
}

// 关闭维修记录模态框
const closeRepairModal = () => {
  showRepairModal.value = false
  deviceRepairs.value = []
}

// 显示新增维修记录模态框
const openAddRepairModal = () => {
  if (selectedDevice.value) {
    repairForm.value = {
      deviceId: selectedDevice.value.id,
      repairType: '',
      description: '',
      partsReplaced: [],
      repairCost: 0,
      technician: '',
      status: 'pending'
    }
    partsInput.value = ''
    showAddRepairModal.value = true
  }
}

// 编辑维修记录
const editRepair = (repair: RepairRecord) => {
  currentRepair.value = repair
  repairForm.value = {
    deviceId: repair.deviceId,
    repairType: repair.repairType,
    description: repair.description,
    partsReplaced: repair.partsReplaced,
    repairCost: repair.repairCost,
    technician: repair.technician,
    status: repair.status
  }
  partsInput.value = repair.partsReplaced.join(',')
  showEditRepairModal.value = true
}

// 关闭维修记录表单模态框
const closeRepairFormModal = () => {
  showAddRepairModal.value = false
  showEditRepairModal.value = false
  currentRepair.value = null
  repairForm.value = {
    deviceId: '',
    repairType: '',
    description: '',
    partsReplaced: [],
    repairCost: 0,
    technician: '',
    status: 'pending'
  }
  partsInput.value = ''
}

// 保存维修记录
const saveRepair = () => {
  if (!repairForm.value.repairType || !repairForm.value.description) {
    ElMessage({
      message: '请填写必要信息',
      type: 'warning',
      duration: 3000
    })
    return
  }
  
  // 处理零件输入
  repairForm.value.partsReplaced = partsInput.value
    .split(',')
    .map(part => part.trim())
    .filter(part => part)
  
  if (selectedDevice.value) {
    if (showEditRepairModal.value && currentRepair.value) {
      // 更新维修记录
      const updated = updateRepair(currentRepair.value.id, repairForm.value)
      if (updated) {
        ElMessage({
          message: '更新成功',
          type: 'success',
          duration: 3000
        })
        closeRepairFormModal()
        // 重新加载维修记录
        deviceRepairs.value = getRepairsByDevice(selectedDevice.value.id)
      }
    } else {
      // 新增维修记录
      addRepair(
        repairForm.value,
        selectedDevice.value.name,
        selectedDevice.value.platformId,
        selectedDevice.value.platformName || getPlatformName(selectedDevice.value.platformId)
      )
      ElMessage({
        message: '添加成功',
        type: 'success',
        duration: 3000
      })
      closeRepairFormModal()
      // 重新加载维修记录
      deviceRepairs.value = getRepairsByDevice(selectedDevice.value.id)
    }
  }
}

// 删除维修记录
const handleDeleteRepair = (id: string) => {
  if (confirm('确定要删除这条维修记录吗？')) {
    const success = deleteRepairStore(id)
    if (success) {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 3000
      })
      // 重新加载维修记录
      if (selectedDevice.value) {
        deviceRepairs.value = getRepairsByDevice(selectedDevice.value.id)
      }
    }
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="less">
.device-manage-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: hidden;
  
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
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .stat-card {
      background: rgba(0, 229, 255, 0.05);
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      
      &:hover {
        background: rgba(0, 229, 255, 0.1);
        box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
        transform: translateY(-2px);
      }
      
      .stat-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
        border-radius: 10px;
        color: #0a1929;
      }
      
      .stat-info {
        flex: 1;
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #00e5ff;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: rgba(0, 229, 255, 0.7);
        }
      }
      
      .stat-action {
        color: rgba(0, 229, 255, 0.6);
        transition: all 0.3s ease;
        
        &:hover {
          color: #00e5ff;
          transform: translateX(5px);
        }
      }
      
      &.online .stat-icon {
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
      }
      
      &.offline .stat-icon {
        background: linear-gradient(135deg, #78909c 0%, #546e7a 100%);
      }
      
      &.warning .stat-icon {
        background: linear-gradient(135deg, #ff9100 0%, #ff6d00 100%);
      }
    }
  }
  
  .device-table-container {
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 12px;
    padding: 20px;
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        gap: 20px;
        
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
          
          h3 {
            font-size: 18px;
            font-weight: 600;
            color: #00e5ff;
            margin: 0;
          }
          
          .platform-filter {
            display: flex;
            align-items: center;
            gap: 10px;
            
            label {
              font-size: 14px;
              color: rgba(0, 229, 255, 0.7);
            }
            
            select,
            .form-select {
              padding: 6px 12px;
              border: 1px solid rgba(0, 229, 255, 0.3);
              border-radius: 6px;
              /* 下拉选项区域的背景 */
              background: rgba(0, 229, 255, 0.05) !important;
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
              
              &:focus {
                outline: none;
                border-color: #00e5ff;
                box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
              }
              
              /* 下拉里每个选项的背景 */
              option {
                background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%) !important;
                color: rgba(255, 255, 255, 0.9) !important;
                padding: 8px 12px;
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
          }
          
          .current-platform {
            font-size: 14px;
            color: rgba(0, 229, 255, 0.8);
            font-weight: 500;
          }
        }
        
        .table-actions {
          display: flex;
          gap: 10px;
          
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
    
    .device-table {
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
      }
      
      td {
        color: rgba(255, 255, 255, 0.8);
      }
      
      tbody tr:hover {
        background: rgba(0, 229, 255, 0.05);
      }
      
      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        
        &.online {
          background: rgba(0, 230, 118, 0.2);
          color: #00e676;
        }
        
        &.offline {
          background: rgba(120, 144, 156, 0.2);
          color: #78909c;
        }
        
        &.warning {
          background: rgba(255, 145, 0, 0.2);
          color: #ff9100;
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
        
        &:hover {
          background: rgba(0, 229, 255, 0.2);
        }
      }
    }
  }

  // 表格滚动容器
  .table-wrapper {
    width: 100%;
    overflow: hidden;
    
    .device-table {
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
      }
    }
  }

  // 表格内容滚动区域
  .table-body {
    max-height: calc(100vh - 320px);
    min-height: 200px;
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
    
    .device-table {
      width: 100%;
      border-collapse: collapse;
      
      td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid rgba(0, 229, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
      }
      
      tbody tr:hover {
        background: rgba(0, 229, 255, 0.05);
      }
    }
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
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
    
    .modal-header {
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
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
  
  // 详情网格
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    
    .detail-item {
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
      
      span {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
      }
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
  
  // 统计详情
  .stats-detail {
    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    .stats-list {
      .stats-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 8px;
        margin-bottom: 10px;
        background: rgba(0, 229, 255, 0.05);
        
        .device-code {
          font-weight: 600;
          color: #00e5ff;
          min-width: 80px;
        }
        
        .device-name {
          flex: 1;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }
  
  // 维修记录相关样式
  .repair-modal {
    width: 90%;
    max-width: 800px;
  }
  
  .modal-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .repair-list {
    .repair-item {
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      background: rgba(0, 229, 255, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(0, 229, 255, 0.1);
        box-shadow: 0 2px 8px rgba(0, 229, 255, 0.15);
      }
      
      .repair-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .repair-type {
          font-weight: 600;
          color: #00e5ff;
          font-size: 16px;
        }
      }
      
      .repair-content {
        margin-bottom: 12px;
        
        .repair-date {
          font-size: 12px;
          color: rgba(0, 229, 255, 0.6);
          margin-bottom: 8px;
        }
        
        .repair-description {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          margin-bottom: 8px;
        }
        
        .repair-meta {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        
        .repair-parts {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          
          span:first-child {
            font-weight: 500;
            color: #00e5ff;
          }
        }
      }
      
      .repair-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        
        .table-btn {
          &.delete-btn {
            background: rgba(255, 77, 79, 0.1);
            border: 1px solid rgba(255, 77, 79, 0.3);
            color: #ff4d4f;
            
            &:hover {
              background: rgba(255, 77, 79, 0.2);
            }
          }
        }
      }
    }
  }
  
  .loading,
  .empty {
    padding: 40px 20px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  // 自定义 Element UI 组件样式
  
  
  .custom-date-picker {
    width: 100%;
    background: rgba(0, 229, 255, 0.05) !important;
    border: 1px solid rgba(0, 229, 255, 0.3) !important;
    border-radius: 6px !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    
    :deep(.el-input__wrapper) {
      background: rgba(0, 229, 255, 0.05) !important;
      border: 1px solid rgba(0, 229, 255, 0.3) !important;
      border-radius: 6px !important;
      box-shadow: none !important;
      
      &:hover {
        border-color: #00e5ff !important;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.3) !important;
      }
      
      &.is-focus {
        border-color: #00e5ff !important;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.3) !important;
      }
    }
    
    :deep(.el-input__inner) {
      color: rgba(255, 255, 255, 0.9) !important;
    }
    
    :deep(.el-input__placeholder) {
      color: rgba(0, 229, 255, 0.5) !important;
    }
    
    :deep(.el-date-picker__panel) {
      background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%) !important;
      border: 1px solid rgba(0, 229, 255, 0.3) !important;
      border-radius: 6px !important;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.3) !important;
      
      .el-date-picker__header {
        border-bottom: 1px solid rgba(0, 229, 255, 0.2) !important;
        
        .el-date-picker__header-label {
          color: #00e5ff !important;
          font-weight: 600 !important;
        }
        
        .el-date-picker__prev-btn, .el-date-picker__next-btn {
          color: rgba(0, 229, 255, 0.7) !important;
          
          &:hover {
            color: #00e5ff !important;
          }
        }
      }
      
      .el-date-picker__body {
        .el-date-table {
          th {
            color: rgba(0, 229, 255, 0.7) !important;
          }
          
          td {
            .el-date-table__cell {
              color: rgba(255, 255, 255, 0.9) !important;
              
              &:hover {
                background: rgba(0, 229, 255, 0.1) !important;
              }
              
              &.current {
                color: #00e5ff !important;
                
                .el-date-table__cell-inner {
                  background: rgba(0, 229, 255, 0.2) !important;
                  border-color: #00e5ff !important;
                }
              }
              
              &.today {
                .el-date-table__cell-inner {
                  color: #00e5ff !important;
                  border-color: #00e5ff !important;
                }
              }
            }
          }
        }
      }
      
      .el-time-panel {
        background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%) !important;
        border-top: 1px solid rgba(0, 229, 255, 0.2) !important;
        
        .el-time-panel__content {
          .el-time-spinner {
            .el-time-spinner__item {
              color: rgba(255, 255, 255, 0.9) !important;
              
              &:hover {
                color: #00e5ff !important;
                background: rgba(0, 229, 255, 0.1) !important;
              }
              
              &.active {
                color: #00e5ff !important;
                background: rgba(0, 229, 255, 0.2) !important;
              }
            }
          }
        }
        
        .el-time-panel__footer {
          border-top: 1px solid rgba(0, 229, 255, 0.2) !important;
          
          button {
            color: #00e5ff !important;
            
            &:hover {
              color: #00e5ff !important;
              background: rgba(0, 229, 255, 0.1) !important;
            }
          }
        }
      }
    }
  }
  
  :deep(.el-checkbox) {
    .el-checkbox__inner {
      background: rgba(0, 229, 255, 0.05) !important;
      border: 1px solid rgba(0, 229, 255, 0.3) !important;
      
      &:hover {
        border-color: #00e5ff !important;
      }
      
      &.is-checked {
        background: #00e5ff !important;
        border-color: #00e5ff !important;
        
        .el-checkbox__inner::after {
          border-color: #0a1929 !important;
        }
      }
    }
    
    .el-checkbox__label {
      color: rgba(0, 229, 255, 0.7) !important;
      
      &:hover {
        color: #00e5ff !important;
      }
    }
  }
}
</style>