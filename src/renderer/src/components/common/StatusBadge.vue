<template>
  <span class="status-badge" :class="[type, { 'status-badge-pulse': pulse }]">
    <span v-if="icon" class="status-icon">
      <slot name="icon"></slot>
    </span>
    <span class="status-text">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  type?: 'success' | 'warning' | 'error' | 'info' | 'online' | 'offline' | 'active' | 'inactive';
  text?: string;
  pulse?: boolean;
  icon?: boolean;
}>();
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: @spacing-xs;
  padding: @spacing-xs @spacing-sm;
  border-radius: @border-radius-full;
  font-size: @font-size-xs;
  font-weight: @font-weight-medium;
  color: #0a1929;
  transition: all @transition-normal;
  
  &.status-badge-pulse {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: currentColor;
      border-radius: inherit;
      opacity: 0.3;
      animation: pulse 2s infinite;
    }
  }
  
  .status-icon {
    display: flex;
    align-items: center;
  }
  
  .status-text {
    display: flex;
    align-items: center;
  }
  
  &.success {
    background: @success-color;
  }
  
  &.warning {
    background: #ffc107;
  }
  
  &.error {
    background: @error-color;
  }
  
  &.info {
    background: @info-color;
  }
  
  &.online {
    background: @success-color;
  }
  
  &.offline {
    background: @text-tertiary;
  }
  
  &.active {
    background: @success-color;
  }
  
  &.inactive {
    background: @text-tertiary;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
  }
}
</style>