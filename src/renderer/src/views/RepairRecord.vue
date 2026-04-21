<template>
  <div class="repair-container">
    <div class="repair-header">
      <h1>维修记录管理</h1>
      <button class="add-button" @click="showAddModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        新增维修记录
      </button>
    </div>
    
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-item">
        <label>设备筛选：</label>
        <select v-model="selectedDevice" class="form-select">
          <option value="">全部设备</option>
          <option v-for="device in platformDevices" :key="device.id" :value="device.id">{{ device.name }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>维修状态：</label>
        <select v-model="selectedStatus" class="form-select">
          <option value="">全部状态</option>
          <option value="completed">已完成</option>
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
        </select>
      </div>
      <div class="filter-item">
        <label>维修类型：</label>
        <select v-model="selectedType" class="form-select">
          <option value="">全部类型</option>
          <option value="维护">维护</option>
          <option value="故障修复">故障修复</option>
          <option value="更换零件">更换零件</option>
          <option value="其他">其他</option>
        </select>
      </div>
    </div>
    
    <!-- 维修记录列表 -->
    <div class="repair-list">
      <div class="repair-table">
        <div class="table-header">
          <div class="table-cell">设备名称</div>
          <div class="table-cell">维修日期</div>
          <div class="table-cell">维修类型</div>
          <div class="table-cell">维修状态</div>
          <div class="table-cell">维修费用</div>
          <div class="table-cell">维修人员</div>
          <div class="table-cell">操作</div>
        </div>
        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-else-if="filteredRepairs.length === 0" class="empty">
          暂无维修记录
        </div>
        <div v-else class="table-body">
          <div v-for="repair in filteredRepairs" :key="repair.id" class="table-row">
            <div class="table-cell">{{ repair.deviceName }}</div>
            <div class="table-cell">{{ formatDate(repair.repairDate) }}</div>
            <div class="table-cell">{{ repair.repairType }}</div>
            <div class="table-cell">
              <span :class="['status-badge', repair.status]">
                {{ statusText[repair.status] }}
              </span>
            </div>
            <div class="table-cell">¥{{ repair.repairCost.toFixed(2) }}</div>
            <div class="table-cell">{{ repair.technician }}</div>
            <div class="table-cell">
              <button class="table-btn view-btn" @click="viewRepair(repair)">
                查看
              </button>
              <button class="table-btn edit-btn" @click="editRepair(repair)">
                编辑
              </button>
              <button class="table-btn delete-btn" @click="handleDeleteRepair(repair.id)">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新增/编辑维修记录弹窗 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? '编辑维修记录' : '新增维修记录' }}</h2>
          <button class="modal-close" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>设备</label>
            <select v-model="repairForm.deviceId" class="form-select" :disabled="showEditModal">
              <option value="" disabled>请选择设备</option>
              <option v-for="device in platformDevices" :key="device.id" :value="device.id">{{ device.name }}</option>
            </select>
          </div>
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
            <label>维修描述</label>
            <textarea v-model="repairForm.description" class="form-textarea" placeholder="请输入维修描述"></textarea>
          </div>
          <div class="form-item">
            <label>更换零件</label>
            <input v-model="partsInput" class="form-input" placeholder="请输入更换的零件，多个用逗号分隔">
          </div>
          <div class="form-item">
            <label>维修费用</label>
            <input type="number" v-model.number="repairForm.repairCost" class="form-input" placeholder="请输入维修费用">
          </div>
          <div class="form-item">
            <label>维修人员</label>
            <input v-model="repairForm.technician" class="form-input" placeholder="请输入维修人员">
          </div>
          <div class="form-item">
            <label>维修状态</label>
            <select v-model="repairForm.status" class="form-select">
              <option value="pending">待处理</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="confirm-btn" @click="saveRepair">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 维修记录详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content detail-modal" @click.stop>
        <div class="modal-header">
          <h2>维修记录详情</h2>
          <button class="modal-close" @click="closeDetailModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div v-if="currentRepair" class="modal-body">
          <div class="detail-item">
            <span class="detail-label">设备名称：</span>
            <span class="detail-value">{{ currentRepair.deviceName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">平台：</span>
            <span class="detail-value">{{ currentRepair.platformName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修日期：</span>
            <span class="detail-value">{{ formatDate(currentRepair.repairDate) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修类型：</span>
            <span class="detail-value">{{ currentRepair.repairType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修状态：</span>
            <span :class="['status-badge', currentRepair.status]">
              {{ statusText[currentRepair.status] }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修描述：</span>
            <span class="detail-value">{{ currentRepair.description }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更换零件：</span>
            <span class="detail-value">{{ currentRepair.partsReplaced.join('，') }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修费用：</span>
            <span class="detail-value">¥{{ currentRepair.repairCost.toFixed(2) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修人员：</span>
            <span class="detail-value">{{ currentRepair.technician }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间：</span>
            <span class="detail-value">{{ formatDate(currentRepair.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">更新时间：</span>
            <span class="detail-value">{{ formatDate(currentRepair.updatedAt) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useRepairStore from '../stores/repairStore'
import useDeviceStore from '../stores/deviceStore'
import { ElMessage } from 'element-plus'
import type { RepairRecord, RepairForm } from '../types/repair'


const route = useRoute()
const { repairRecords, loading, getRepairsByPlatform, addRepair, updateRepair, deleteRepair: deleteRepairStore, loadRepairs } = useRepairStore()
const { deviceList: devices, loadDevices } = useDeviceStore()

// 平台信息
const platformId = ref(localStorage.getItem('platformId') || '')
const platformName = ref(localStorage.getItem('platformName') || '')

// 筛选条件
const selectedDevice = ref('')
const selectedStatus = ref('')
const selectedType = ref('')

// 弹窗状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)

// 当前维修记录
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

// 当前平台的设备
const platformDevices = computed(() => {
  return devices.value.filter(device => device.platformId === platformId.value)
})

// 过滤后的维修记录
const filteredRepairs = computed(() => {
  let result = getRepairsByPlatform(platformId.value)
  
  if (selectedDevice.value) {
    result = result.filter(repair => repair.deviceId === selectedDevice.value)
  }
  
  if (selectedStatus.value) {
    result = result.filter(repair => repair.status === selectedStatus.value)
  }
  
  if (selectedType.value) {
    result = result.filter(repair => repair.repairType === selectedType.value)
  }
  
  return result
})

// 加载数据
onMounted(() => {
  loadDevices()
  loadRepairs()
})

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

// 查看维修记录详情
const viewRepair = (repair: RepairRecord) => {
  currentRepair.value = repair
  showDetailModal.value = true
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
  showEditModal.value = true
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
    }
  }
}

// 保存维修记录
const saveRepair = () => {
  if (!repairForm.value.deviceId || !repairForm.value.repairType || !repairForm.value.description) {
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
  
  if (showEditModal.value && currentRepair.value) {
    // 更新维修记录
    const updated = updateRepair(currentRepair.value.id, repairForm.value)
    if (updated) {
      ElMessage({
        message: '更新成功',
        type: 'success',
        duration: 3000
      })
      closeModal()
    }
  } else {
    // 新增维修记录
    const device = platformDevices.value.find(d => d.id === repairForm.value.deviceId)
    if (device) {
      addRepair(repairForm.value, device.name, platformId.value, platformName.value)
      ElMessage({
        message: '添加成功',
        type: 'success',
        duration: 3000
      })
      closeModal()
    }
  }
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
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

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  currentRepair.value = null
}
</script>

<style scoped lang="less">
.repair-container {
  padding: 20px;
  background: rgba(10, 25, 41, 0.8);
  min-height: calc(100vh - 70px);
  
  .repair-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #00e5ff;
      margin: 0;
    }
    
    .add-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
      color: #0a1929;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
      }
    }
  }
  
  .filter-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    
    .filter-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      label {
        color: #00e5ff;
        font-size: 14px;
        white-space: nowrap;
      }
      
      .form-select {
        padding: 8px 12px;
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.05);
        color: #00e5ff;
        font-size: 14px;
        
        &:focus {
          outline: none;
          border-color: #00e5ff;
          box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
        }
      }
    }
  }
  
  .repair-list {
    .repair-table {
      width: 100%;
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 8px;
      overflow: hidden;
      
      .table-header {
        display: grid;
        grid-template-columns: 1fr 150px 120px 100px 100px 120px 150px;
        background: rgba(0, 229, 255, 0.1);
        padding: 12px 20px;
        
        .table-cell {
          font-weight: 600;
          color: #00e5ff;
          text-align: left;
        }
      }
      
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
        
        .table-row {
          display: grid;
          grid-template-columns: 1fr 150px 120px 100px 100px 120px 150px;
          padding: 12px 20px;
          border-top: 1px solid rgba(0, 229, 255, 0.1);
          transition: background 0.3s ease;
          
          &:hover {
            background: rgba(0, 229, 255, 0.05);
          }
          
          .table-cell {
            color: rgba(255, 255, 255, 0.8);
            text-align: left;
            align-self: center;
            
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              
              &.completed {
                background: rgba(0, 230, 118, 0.2);
                color: #00e676;
              }
              
              &.pending {
                background: rgba(255, 177, 0, 0.2);
                color: #ffb100;
              }
              
              &.in_progress {
                background: rgba(0, 229, 255, 0.2);
                color: #00e5ff;
              }
            }
          }
          
          .table-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-right: 8px;
            transition: all 0.3s ease;
            
            &.view-btn {
              background: rgba(0, 229, 255, 0.2);
              color: #00e5ff;
              
              &:hover {
                background: rgba(0, 229, 255, 0.3);
              }
            }
            
            &.edit-btn {
              background: rgba(255, 177, 0, 0.2);
              color: #ffb100;
              
              &:hover {
                background: rgba(255, 177, 0, 0.3);
              }
            }
            
            &.delete-btn {
              background: rgba(255, 77, 79, 0.2);
              color: #ff4d4f;
              
              &:hover {
                background: rgba(255, 77, 79, 0.3);
              }
            }
          }
        }
      }
      
      .loading,
      .empty {
        padding: 60px 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  
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
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    
    &.detail-modal {
      width: 600px;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 229, 255, 0.2);
      
      h2 {
        color: #00e5ff;
        font-size: 18px;
        margin: 0;
      }
      
      .modal-close {
        background: none;
        border: none;
        color: #00e5ff;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(0, 229, 255, 0.1);
        }
      }
    }
    
    .modal-body {
      padding: 20px;
      
      .form-item {
        margin-bottom: 16px;
        
        label {
          display: block;
          color: #00e5ff;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .form-select,
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: #00e5ff;
          font-size: 14px;
          
          &:focus {
            outline: none;
            border-color: #00e5ff;
            box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
          }
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
      }
      
      .detail-item {
        display: flex;
        margin-bottom: 12px;
        
        .detail-label {
          width: 120px;
          color: #00e5ff;
          font-size: 14px;
          font-weight: 500;
        }
        
        .detail-value {
          flex: 1;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }
      }
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid rgba(0, 229, 255, 0.2);
      
      .cancel-btn,
      .confirm-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        }
        
        &.confirm-btn {
          background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
          color: #0a1929;
          font-weight: 500;
          
          &:hover {
            box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
          }
        }
      }
    }
  }
}
</style>
