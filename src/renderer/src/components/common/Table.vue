<template>
  <div class="table-container">
    <div v-if="showHeader" class="table-header">
      <div class="header-left">
        <h3 v-if="title">{{ title }}</h3>
        <slot name="header-left"></slot>
      </div>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div class="table-wrapper">
      <!-- 表头 -->
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :width="column.width">
              <div class="th-content">
                {{ column.title }}
                <span v-if="column.sortable" class="sort-icon" @click="handleSort(column.key)">
                  <svg v-if="sortKey === column.key && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                  <svg v-else-if="sortKey === column.key && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
            </th>
            <th v-if="showActions" width="120">操作</th>
          </tr>
        </thead>
      </table>
      
      <!-- 表体 -->
      <div class="table-body" :style="{ maxHeight: maxHeight || '400px' }">
        <table class="table">
          <tbody>
            <tr v-for="(row, index) in data" :key="row.id || index">
              <td v-for="column in columns" :key="column.key">
                <template v-if="column.render">
                  {{ column.render(row, index) }}
                </template>
                <template v-else>
                  {{ row[column.key] }}
                </template>
              </td>
              <td v-if="showActions" class="actions">
                <slot name="actions" :row="row" :index="index"></slot>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td :colspan="columns.length + (showActions ? 1 : 0)" class="empty-cell">
                <div class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <div class="empty-text">{{ emptyText || '暂无数据' }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="showPagination && total > pageSize" class="pagination">
      <div class="pagination-info">
        共 {{ total }} 条记录
      </div>
      <div class="pagination-buttons">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="handlePageChange(1)"
        >
          首页
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </button>
        <span class="pagination-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="handlePageChange(totalPages)"
        >
          末页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
interface Column {
  key: string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (row: any, index: number) => any;
}

const props = defineProps<{
  data: any[];
  columns: Column[];
  title?: string;
  showHeader?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  total?: number;
  pageSize?: number;
  currentPage?: number;
  maxHeight?: string;
  emptyText?: string;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
}>();

// Emits
const emit = defineEmits<{
  (e: 'sort', key: string, order: 'asc' | 'desc'): void;
  (e: 'page-change', page: number): void;
}>();

// Computed
const totalPages = computed(() => {
  if (!props.total || !props.pageSize) return 1;
  return Math.ceil(props.total / props.pageSize);
});

// Methods
const handleSort = (key: string) => {
  let order: 'asc' | 'desc' = 'asc';
  if (props.sortKey === key && props.sortOrder === 'asc') {
    order = 'desc';
  }
  emit('sort', key, order);
};

const handlePageChange = (page: number) => {
  if (page < 1) page = 1;
  if (page > totalPages.value) page = totalPages.value;
  emit('page-change', page);
};
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.table-container {
  width: 100%;
  
  .table-header {
    .flex(row, space-between, center);
    margin-bottom: @spacing-lg;
    
    .header-left {
      .flex(row, flex-start, center);
      gap: @spacing-lg;
      
      h3 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @text-primary;
        margin: 0;
      }
    }
    
    .table-actions {
      .flex(row, flex-end, center);
      gap: @spacing-sm;
    }
  }
  
  .table-wrapper {
    border: 1px solid @border-color;
    border-radius: @border-radius-md;
    overflow: hidden;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: @spacing-sm @spacing-md;
      text-align: left;
      border-bottom: 1px solid @border-light;
    }
    
    th {
      background: @bg-secondary;
      color: @text-secondary;
      font-weight: @font-weight-semibold;
      font-size: @font-size-sm;
      white-space: nowrap;
      
      .th-content {
        .flex(row, space-between, center);
        
        .sort-icon {
          color: @text-tertiary;
          cursor: pointer;
          margin-left: @spacing-sm;
          
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
    
    td {
      color: @text-primary;
      font-size: @font-size-sm;
      
      &.actions {
        .flex(row, flex-start, center);
        gap: @spacing-xs;
      }
      
      &.empty-cell {
        padding: @spacing-xxxl;
        text-align: center;
        
        .empty-state {
          .center();
          flex-direction: column;
          gap: @spacing-lg;
          
          svg {
            color: @text-tertiary;
          }
          
          .empty-text {
            font-size: @font-size-base;
            color: @text-tertiary;
          }
        }
      }
    }
    
    tr:hover {
      background: rgba(0, 229, 255, 0.05);
    }
  }
  
  .table-body {
    max-height: 400px;
    overflow-y: auto;
    .scrollbar();
  }
  
  .pagination {
    .flex(row, space-between, center);
    margin-top: @spacing-lg;
    padding: @spacing-lg;
    background: @bg-secondary;
    border: 1px solid @border-color;
    border-radius: @border-radius-md;
    
    .pagination-info {
      font-size: @font-size-sm;
      color: @text-secondary;
    }
    
    .pagination-buttons {
      .flex(row, center, center);
      gap: @spacing-sm;
      
      .pagination-btn {
        .button-base(@bg-tertiary, @text-secondary, @border-color);
        padding: @spacing-xs @spacing-sm;
        font-size: @font-size-sm;
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>