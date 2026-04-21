<template>
  <div class="page-header">
    <div class="header-left">
      <h2 class="page-title">{{ title }}</h2>
      <div v-if="subtitle" class="page-subtitle">{{ subtitle }}</div>
    </div>
    <div class="header-right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<style scoped lang="less">
@import '../../assets/styles/variables.less';
@import '../../assets/styles/mixins.less';

.page-header {
  .flex(row, space-between, flex-start);
  margin-bottom: @spacing-xxxl;
  padding-bottom: @spacing-xl;
  border-bottom: 1px solid @border-light;
  
  .header-left {
    
    .page-title {
      font-size: @font-size-xxxl;
      font-weight: @font-weight-bold;
      color: @text-primary;
      margin: 0 0 @spacing-xs 0;
    }
    
    .page-subtitle {
      font-size: @font-size-sm;
      color: @text-tertiary;
      margin: 0;
    }
  }
  
  .header-right {
    .flex(row, flex-end, center);
    gap: @spacing-sm;
  }
}

// 响应式设计
@media (max-width: @breakpoint-md) {
  .page-header {
    .flex(column, flex-start, flex-start);
    gap: @spacing-lg;
    
    .header-right {
      .flex(row, flex-start, center);
      width: 100%;
    }
  }
}
</style>