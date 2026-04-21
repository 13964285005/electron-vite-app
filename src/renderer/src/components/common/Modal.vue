<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div v-if="showHeader" class="modal-header">
        <h4>{{ title }}</h4>
        <button v-if="showClose" class="close-btn" @click="handleClose">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- 模态框内容 -->
      <div class="modal-body">
        <slot></slot>
      </div>
      
      <!-- 模态框底部 -->
      <div v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <button v-if="showCancel" class="action-btn secondary" @click="handleCancel">
            取消
          </button>
          <button v-if="showConfirm" class="action-btn primary" @click="handleConfirm">
            确认
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  visible: boolean;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showClose?: boolean;
  showCancel?: boolean;
  showConfirm?: boolean;
  width?: string;
  maxHeight?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

// Methods
const handleClose = () => {
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};

const handleOverlayClick = () => {
  emit('close');
};
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.modal-overlay {
  .fixed(0, 0, 0, 0);
  background: rgba(0, 0, 0, 0.5);
  .center();
  z-index: @z-index-modal;
  backdrop-filter: blur(2px);
  
  .modal-content {
    .modal-base();
    width: v-bind(width) || '90%';
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    
    .modal-header {
      .flex(row, space-between, center);
      padding: @spacing-lg @spacing-xl;
      border-bottom: 1px solid @border-light;
      
      h4 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @primary-color;
        margin: 0;
      }
      
      .close-btn {
        background: none;
        border: none;
        color: @text-tertiary;
        font-size: @font-size-xl;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        .center();
        
        &:hover {
          color: @primary-color;
        }
      }
    }
    
    .modal-body {
      padding: @spacing-xl;
      max-height: v-bind(maxHeight) || '60vh';
      overflow-y: auto;
      .scrollbar();
    }
    
    .modal-footer {
      .flex(row, flex-end, center);
      gap: @spacing-sm;
      padding: @spacing-lg @spacing-xl;
      border-top: 1px solid @border-light;
      background: @bg-secondary;
    }
  }
}

// 响应式设计
@media (max-width: @breakpoint-md) {
  .modal-overlay {
    .modal-content {
      width: 95%;
      max-width: none;
      
      .modal-body {
        padding: @spacing-lg;
      }
      
      .modal-footer {
        padding: @spacing-md @spacing-lg;
      }
    }
  }
}
</style>