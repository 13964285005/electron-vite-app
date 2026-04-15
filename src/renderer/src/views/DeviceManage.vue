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
              <select v-model="selectedPlatform" @change="filterDevices">
                <option value="">全部平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
                  {{ platform.name }}
                </option>
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
          <tbody>
            <tr v-for="(device, index) in filteredDeviceList" :key="index">
              <td>{{ device.code }}</td>
              <td>{{ device.name }}</td>
              <td>{{ device.type }}</td>
              <td>{{ device.area }}</td>
              <td v-if="isPlatformAdmin">{{ getPlatformName(device.platformId) }}</td>
              <td>
                <span class="status-badge" :class="device.status">
                  {{ device.statusText }}
                </span>
              </td>
              <td>{{ device.lastOnline }}</td>
              <td>
                <button class="table-btn" @click="showDeviceDetail(device)">查看</button>
                <button class="table-btn" @click="showEditDeviceModal(device)">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
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
              <select v-model="editForm.type">
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
              <select v-model="editForm.platformId">
                <option value="">请选择平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
                  {{ platform.name }}
                </option>
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
              <select v-model="addForm.type">
                <option value="监测站">监测站</option>
                <option value="传感器">传感器</option>
                <option value="控制阀">控制阀</option>
              </select>
            </div>
            <div class="form-item">
              <label>所属区域</label>
              <input type="text" v-model="addForm.area" />
            </div>
            <div class="form-item" v-if="isPlatformAdmin">
              <label>所属平台</label>
              <select v-model="addForm.platformId">
                <option value="">请选择平台</option>
                <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
                  {{ platform.name }}
                </option>
              </select>
            </div>
            <div class="form-item" v-else>
              <label>所属平台</label>
              <input type="text" v-model="currentPlatformName" readonly />
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
  </div>
</template>

<script setup lang="ts">
import {
  // 状态
  platforms,
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
} from '../stores/deviceStore'
</script>

<style scoped lang="less">
.device-manage-container {
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
            
            select {
              padding: 6px 12px;
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
              
              option {
                background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
                color: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
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
      
      select {
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
        
        option {
          background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
          color: rgba(255, 255, 255, 0.9);
          padding: 12px 16px;
          font-size: 14px;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(0, 229, 255, 0.1);
          border-radius: 4px;
          margin: 4px 0;
        }
        
        option:hover {
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 128, 255, 0.15) 100%);
          color: #00e5ff;
          transform: translateX(4px);
        }
        
        option:checked {
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(0, 128, 255, 0.25) 100%);
          color: #00e5ff;
          font-weight: 600;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        
        option:disabled {
          background: rgba(0, 229, 255, 0.03);
          color: rgba(0, 229, 255, 0.3);
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
}
</style>