<template>
  <div class="warning-container">
    <div class="warning-header">
      <h2>预警信息管理</h2>
      <div class="header-actions">
        <button class="action-btn refresh" @click="refreshWarnings">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          刷新
        </button>
      </div>
    </div>

    <div class="warning-filters">
      <div class="filter-item">
        <label>预警级别：</label>
        <select v-model="filterLevel" class="form-select">
          <option value="">全部</option>
          <option value="critical">紧急</option>
          <option value="warning">警告</option>
          <option value="info">通知</option>
        </select>
      </div>
      <div class="filter-item">
        <label>处理状态：</label>
        <select v-model="filterStatus" class="form-select">
          <option value="">全部</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="resolved">已处理</option>
        </select>
      </div>
      <div class="filter-item">
        <label>时间范围：</label>
        <select v-model="filterTimeRange" class="form-select">
          <option value="today">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="all">全部</option>
        </select>
      </div>
    </div>

    <div class="warning-stats">
      <div class="stat-card critical" @click="filterLevel = 'critical'">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ warningStats.critical }}</span>
          <span class="stat-label">紧急预警</span>
        </div>
      </div>
      <div class="stat-card warning" @click="filterLevel = 'warning'">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ warningStats.warning }}</span>
          <span class="stat-label">警告预警</span>
        </div>
      </div>
      <div class="stat-card info" @click="filterLevel = 'info'">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ warningStats.info }}</span>
          <span class="stat-label">通知信息</span>
        </div>
      </div>
      <div class="stat-card total" @click="showAllWarnings">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ warningStats.total }}</span>
          <span class="stat-label">预警总数</span>
        </div>
      </div>
    </div>

    <div class="warning-table">
      <div class="table-wrapper">
        <div class="table-header">
          <table>
            <thead>
              <tr>
                <th>预警级别</th>
                <th>预警内容</th>
                <th>设备名称</th>
                <th>发生时间</th>
                <th>处理状态</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body">
          <table>
            <tbody>
              <tr v-for="warning in filteredWarnings" :key="warning.id" :class="warning.level">
                <td>
                  <span class="level-badge" :class="warning.level">
                    {{ getLevelText(warning.level) }}
                  </span>
                </td>
                <td class="content-cell">{{ warning.content }}</td>
                <td>{{ warning.deviceName }}</td>
                <td>{{ formatTime(warning.createTime) }}</td>
                <td>
                  <span class="status-badge" :class="warning.status">
                    {{ getStatusText(warning.status) }}
                  </span>
                </td>
                <td class="action-cell">
                  <button v-if="warning.status === 'pending'" class="op-btn handle" @click="handleWarning(warning)">
                    处理
                  </button>
                  <button v-if="warning.status === 'processing'" class="op-btn resolve" @click="resolveWarning(warning)">
                    完成
                  </button>
                  <button class="op-btn detail" @click="showDetail(warning)">
                    详情
                  </button>
                </td>
              </tr>
              <tr v-if="filteredWarnings.length === 0">
                <td colspan="6" style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <p>暂无预警信息</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetail">
      <div class="modal-content">
        <div class="modal-header">
          <h3>预警详情</h3>
          <button class="close-btn" @click="closeDetail">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">预警级别：</span>
            <span class="level-badge" :class="currentWarning?.level">
              {{ getLevelText(currentWarning?.level) }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">预警内容：</span>
            <span class="detail-value">{{ currentWarning?.content }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">设备名称：</span>
            <span class="detail-value">{{ currentWarning?.deviceName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">发生时间：</span>
            <span class="detail-value">{{ formatTime(currentWarning?.createTime) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">处理状态：</span>
            <span class="status-badge" :class="currentWarning?.status">
              {{ getStatusText(currentWarning?.status) }}
            </span>
          </div>
          <div v-if="currentWarning?.handler" class="detail-row">
            <span class="detail-label">处理人：</span>
            <span class="detail-value">{{ currentWarning.handler }}</span>
          </div>
          <div v-if="currentWarning?.handleTime" class="detail-row">
            <span class="detail-label">处理时间：</span>
            <span class="detail-value">{{ formatTime(currentWarning.handleTime) }}</span>
          </div>
          <div v-if="currentWarning?.remark" class="detail-row">
            <span class="detail-label">处理备注：</span>
            <span class="detail-value">{{ currentWarning.remark }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="currentWarning?.status === 'pending'" class="modal-btn primary" @click="handleWarning(currentWarning!)">
            立即处理
          </button>
          <button v-if="currentWarning?.status === 'processing'" class="modal-btn success" @click="resolveWarning(currentWarning!)">
            完成处理
          </button>
          <button class="modal-btn" @click="closeDetail">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useWarningStore from '../stores/warningStore'

interface Warning {
  id: string
  level: 'critical' | 'warning' | 'info'
  content: string
  deviceName: string
  createTime: string
  status: 'pending' | 'processing' | 'resolved'
  handler?: string
  handleTime?: string
  remark?: string
}

const route = useRoute()

// 使用预警 store
const { warnings, unreadCount, recentWarnings, loadWarnings, handleWarning, resolveWarning } = useWarningStore()

const filterLevel = ref('')
const filterStatus = ref('')
const filterTimeRange = ref('all')
const showDetailModal = ref(false)
const currentWarning = ref<Warning | null>(null)

const warningStats = computed(() => {
  return {
    critical: warnings.value.filter(w => w.level === 'critical').length,
    warning: warnings.value.filter(w => w.level === 'warning').length,
    info: warnings.value.filter(w => w.level === 'info').length,
    total: warnings.value.length
  }
})

const filteredWarnings = computed(() => {
  return warnings.value.filter(warning => {
    if (filterLevel.value && warning.level !== filterLevel.value) return false
    if (filterStatus.value && warning.status !== filterStatus.value) return false
    return true
  })
})

const getLevelText = (level?: string) => {
  const map: Record<string, string> = {
    critical: '紧急',
    warning: '警告',
    info: '通知'
  }
  return level ? map[level] || level : ''
}

const getStatusText = (status?: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已处理'
  }
  return status ? map[status] || status : ''
}

const formatTime = (time?: string) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refreshWarnings = () => {
  loadWarnings()
}

const showDetail = (warning: Warning) => {
  currentWarning.value = warning
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  currentWarning.value = null
}

const showAllWarnings = () => {
  filterLevel.value = ''
  filterStatus.value = ''
  filterTimeRange.value = 'all'
}

onMounted(() => {
  loadWarnings()
  
  // 检查URL参数，打开对应的预警详情
  const warningId = route.query.warningId as string
  if (warningId) {
    setTimeout(() => {
      const warning = warnings.value.find(w => w.id === warningId)
      if (warning) {
        showDetail(warning)
      }
    }, 100)
  }
})
</script>

<style scoped lang="less">
.warning-container {
  padding: 20px;
  height: calc(100vh - 130px);
  overflow-y: hidden;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #00e5ff;
    margin: 0;
  }

  .header-actions {
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
        border-color: #00e5ff;
      }
    }
  }
}

.warning-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 229, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.2);

  .filter-item {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }

    select,
    .form-select {
      padding: 6px 12px;
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 6px;
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

      option {
        background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%) !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }
    }
  }
}

.warning-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-radius: 8px;
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid rgba(0, 229, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
    }

    &.critical {
      border-color: rgba(255, 77, 79, 0.3);
      background: rgba(255, 77, 79, 0.05);

      .stat-icon {
        color: #ff4d4f;
      }
    }

    &.warning {
      border-color: rgba(255, 152, 0, 0.3);
      background: rgba(255, 152, 0, 0.05);

      .stat-icon {
        color: #ff9800;
      }
    }

    &.info {
      border-color: rgba(0, 229, 255, 0.3);
      background: rgba(0, 229, 255, 0.05);

      .stat-icon {
        color: #00e5ff;
      }
    }

    &.total {
      border-color: rgba(0, 229, 255, 0.5);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(0, 128, 255, 0.05) 100%);

      .stat-icon {
        color: #00e5ff;
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(0, 229, 255, 0.1);
    }

    .stat-info {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #fff;
      }

      .stat-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.warning-table {
  background: rgba(0, 229, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.2);
  overflow: hidden;

  .table-wrapper {
    width: 100%;

    .table-header {
      table {
        width: 100%;
        border-collapse: collapse;

        thead {
          background: rgba(0, 229, 255, 0.1);

          th {
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #00e5ff;
            border-bottom: 1px solid rgba(0, 229, 255, 0.2);
            position: sticky;
            top: 0;
            z-index: 10;
          }
        }
      }
    }

    .table-body {
      max-height: calc(100vh - 400px);
      overflow-y: auto;
      overflow-x: hidden;

      table {
        width: 100%;
        border-collapse: collapse;

        tbody {
          tr {
            transition: all 0.3s ease;

            &:hover {
              background: rgba(0, 229, 255, 0.05);
            }

            &.critical {
              border-left: 3px solid #ff4d4f;
            }

            &.warning {
              border-left: 3px solid #ff9800;
            }

            &.info {
              border-left: 3px solid #00e5ff;
            }

            td {
              padding: 12px 15px;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9);
              border-bottom: 1px solid rgba(0, 229, 255, 0.1);
            }

            .content-cell {
              max-width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .action-cell {
              display: flex;
              gap: 8px;
            }
          }
        }
      }

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

.level-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.critical {
    background: rgba(255, 77, 79, 0.2);
    color: #ff4d4f;
    border: 1px solid rgba(255, 77, 79, 0.3);
  }

  &.warning {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  &.info {
    background: rgba(0, 229, 255, 0.2);
    color: #00e5ff;
    border: 1px solid rgba(0, 229, 255, 0.3);
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.pending {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  &.processing {
    background: rgba(0, 229, 255, 0.2);
    color: #00e5ff;
    border: 1px solid rgba(0, 229, 255, 0.3);
  }

  &.resolved {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
}

.op-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.handle {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.3);

    &:hover {
      background: rgba(255, 152, 0, 0.3);
    }
  }

  &.resolve {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.3);

    &:hover {
      background: rgba(76, 175, 80, 0.3);
    }
  }

  &.detail {
    background: rgba(0, 229, 255, 0.1);
    color: #00e5ff;
    border: 1px solid rgba(0, 229, 255, 0.3);

    &:hover {
      background: rgba(0, 229, 255, 0.2);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);

  svg {
    margin-bottom: 15px;
    opacity: 0.5;
  }

  p {
    font-size: 16px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 500px;
  background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);

  h3 {
    margin: 0;
    font-size: 18px;
    color: #00e5ff;
  }

  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      color: #ff4d4f;
    }
  }
}

.modal-body {
  padding: 20px;

  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      width: 90px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      flex-shrink: 0;
    }

    .detail-value {
      flex: 1;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid rgba(0, 229, 255, 0.2);

  .modal-btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(0, 229, 255, 0.1);
    color: #00e5ff;
    border: 1px solid rgba(0, 229, 255, 0.3);

    &:hover {
      background: rgba(0, 229, 255, 0.2);
    }

    &.primary {
      background: rgba(255, 152, 0, 0.2);
      color: #ff9800;
      border: 1px solid rgba(255, 152, 0, 0.3);

      &:hover {
        background: rgba(255, 152, 0, 0.3);
      }
    }

    &.success {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid rgba(76, 175, 80, 0.3);

      &:hover {
        background: rgba(76, 175, 80, 0.3);
      }
    }
  }
}
</style>