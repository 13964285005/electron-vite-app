<template>
  <button
    class="btn"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      { 'btn-disabled': disabled, 'btn-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    </span>
    <span v-if="icon && !loading" class="btn-icon">
      <slot name="icon"></slot>
    </span>
    <span v-if="$slots.default && !loading" class="btn-text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  round?: boolean;
  circle?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

// Methods
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.btn {
  .button-base();
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-sm;
  font-size: @font-size-base;
  font-weight: @font-weight-medium;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  
  &.btn-block {
    display: flex;
    width: 100%;
  }
  
  &.btn-round {
    border-radius: @border-radius-full;
  }
  
  &.btn-circle {
    border-radius: 50%;
    padding: @spacing-sm;
    width: @height-md;
    height: @height-md;
  }
  
  &.btn-sm {
    padding: @spacing-xs @spacing-sm;
    font-size: @font-size-sm;
    height: @height-sm;
  }
  
  &.btn-md {
    padding: @spacing-sm @spacing-md;
    font-size: @font-size-base;
    height: @height-md;
  }
  
  &.btn-lg {
    padding: @spacing-md @spacing-lg;
    font-size: @font-size-lg;
    height: @height-lg;
  }
  
  &.btn-primary {
    .gradient-bg();
    color: @bg-primary;
    border-color: @primary-color;
  }
  
  &.btn-secondary {
    .button-base(@bg-tertiary, @text-secondary, @border-color);
  }
  
  &.btn-danger {
    .button-base(rgba(255, 77, 79, 0.1), @warning-color, rgba(255, 77, 79, 0.3));
  }
  
  &.btn-success {
    .button-base(rgba(0, 230, 118, 0.1), @success-color, rgba(0, 230, 118, 0.3));
  }
  
  &.btn-warning {
    .button-base(rgba(255, 193, 7, 0.1), #ffc107, rgba(255, 193, 7, 0.3));
  }
  
  &.btn-info {
    .button-base(rgba(33, 150, 243, 0.1), @info-color, rgba(33, 150, 243, 0.3));
  }
  
  &.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.btn-loading {
    cursor: not-allowed;
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
  }
  
  .btn-icon {
    display: flex;
    align-items: center;
  }
  
  .btn-text {
    display: flex;
    align-items: center;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>