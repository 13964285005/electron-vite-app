<template>
  <div class="stat-card" :class="[type, { 'stat-card-clickable': clickable }]" @click="handleClick">
    <div class="stat-icon">
      <slot name="icon">
        <svg v-if="defaultIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </slot>
    </div>
    <div class="stat-info">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
      <div v-if="trend" class="stat-trend" :class="trend.type">
        <svg v-if="trend.type === 'up'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <svg v-else-if="trend.type === 'down'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 3 9 21 6 12 2 12"></polyline>
        </svg>
        <span>{{ trend.value }}</span>
      </div>
    </div>
    <div class="stat-action">
      <slot name="action">
        <svg v-if="clickable" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Trend {
  type: 'up' | 'down' | 'neutral';
  value: string;
}

const props = defineProps<{
  value: string | number;
  label: string;
  type?: 'default' | 'online' | 'offline' | 'warning' | 'success' | 'danger';
  trend?: Trend;
  clickable?: boolean;
  defaultIcon?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'click'): void;
}>();

// Methods
const handleClick = () => {
  if (props.clickable) {
    emit('click');
  }
};
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.stat-card {
  .card();
  .flex(row, space-between, center);
  transition: all @transition-normal;
  
  &.stat-card-clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }
  }
  
  .stat-icon {
    font-size: @font-size-xxl;
    color: @primary-color;
    margin-right: @spacing-lg;
    flex-shrink: 0;
  }
  
  .stat-info {
    flex: 1;
    
    .stat-value {
      font-size: @font-size-xxl;
      font-weight: @font-weight-bold;
      color: @text-primary;
      line-height: 1;
    }
    
    .stat-label {
      font-size: @font-size-sm;
      color: @text-tertiary;
      margin-top: @spacing-xs;
    }
    
    .stat-trend {
      .flex(row, flex-start, center);
      gap: @spacing-xs;
      font-size: @font-size-xs;
      margin-top: @spacing-xs;
      
      &.up {
        color: @success-color;
      }
      
      &.down {
        color: @warning-color;
      }
      
      &.neutral {
        color: @text-tertiary;
      }
    }
  }
  
  .stat-action {
    font-size: @font-size-sm;
    color: @text-tertiary;
    flex-shrink: 0;
  }
  
  &.online .stat-icon {
    color: @success-color;
  }
  
  &.offline .stat-icon {
    color: @text-tertiary;
  }
  
  &.warning .stat-icon {
    color: @warning-color;
  }
  
  &.success .stat-icon {
    color: @success-color;
  }
  
  &.danger .stat-icon {
    color: @error-color;
  }
}

// 响应式设计
@media (max-width: @breakpoint-md) {
  .stat-card {
    .stat-icon {
      font-size: @font-size-xl;
      margin-right: @spacing-md;
    }
    
    .stat-info {
      .stat-value {
        font-size: @font-size-xl;
      }
    }
  }
}
</style>