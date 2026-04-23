<template>
  <div class="map-toolbar">
    <div class="toolbar-content" :class="{ 'compact': compact }">
      <button 
        v-for="tool in activeTools" 
        :key="tool.id"
        :class="['tool-button', { 'active': activeTool === tool.id }]"
        @click="toggleTool(tool.id)"
        :title="tool.name"
      >
        <div class="icon-container">
          <svg class="tool-icon" :class="'icon-' + tool.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle v-if="tool.id === 'point'" cx="12" cy="12" r="4"></circle>
            <line v-else-if="tool.id === 'polyline'" x1="2" y1="12" x2="22" y2="12"></line>
            <polygon v-else-if="tool.id === 'polygon'" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            <circle v-else-if="tool.id === 'circle'" cx="12" cy="12" r="10"></circle>
            <rect v-else-if="tool.id === 'rectangle'" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </div>
        <span v-if="!compact" class="tool-name">{{ tool.name }}</span>
      </button>
      <button 
        class="tool-button"
        @click="clearAll"
        title="清除所有"
      >
        <div class="icon-container">
          <svg class="tool-icon icon-clear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
        <span v-if="!compact" class="tool-name">清除</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCesiumStore } from '@renderer/stores/cesiumStore'
import { useDrawingTools } from '@renderer/hooks/useDrawingTools'

// 定义工具类型
interface Tool {
  id: string
  name: string
}

// 定义工具绘制信息
interface DrawInfo {
  type: string
  coordinates: any[]
  area?: number
  length?: number
  center?: any
  radius?: number
}

// Props
const props = defineProps<{
  tools?: string[]
  compact?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'draw-complete', info: DrawInfo): void
  (e: 'tool-change', toolId: string | null): void
}>()

// 所有可用工具
const allTools: Tool[] = [
  { id: 'point', name: '点' },
  { id: 'polyline', name: '线' },
  { id: 'polygon', name: '面' },
  { id: 'circle', name: '圆' },
  { id: 'rectangle', name: '矩形' }
]

// 激活的工具
const activeTool = ref<string | null>(null)
const cesiumStore = useCesiumStore()
const { startDraw, cancelDraw, clearAll: clearDrawing } = useDrawingTools()

// 计算当前显示的工具
const activeTools = computed(() => {
  if (props.tools && props.tools.length > 0) {
    return allTools.filter(tool => props.tools?.includes(tool.id))
  }
  return allTools
})

// 切换工具
const toggleTool = (toolId: string) => {
  if (activeTool.value === toolId) {
    // 取消当前工具
    stopCurrentTool()
    activeTool.value = null
    emit('tool-change', null)
  } else {
    // 先停止当前工具
    stopCurrentTool()
    
    // 激活新工具
    activeTool.value = toolId
    startTool(toolId)
    emit('tool-change', toolId)
  }
}

// 启动工具
const startTool = (toolId: string) => {
  // 开始绘制
  let drawType: string
  switch (toolId) {
    case 'point':
      drawType = 'point'
      break
    case 'polyline':
      drawType = 'line'
      break
    case 'polygon':
      drawType = 'polygon'
      break
    case 'circle':
      drawType = 'circle'
      break
    case 'rectangle':
      drawType = 'rectangle'
      break
    default:
      return
  }
  
  // 开始绘制并设置回调
  startDraw(drawType, (result: any) => {
    console.log('绘制完成:', result)
    const drawInfo: DrawInfo = {
      type: toolId,
      coordinates: result.positions || [],
      center: result.center,
      radius: result.radius
    }
    emit('draw-complete', drawInfo)
    activeTool.value = null
    emit('tool-change', null)
    
    // 恢复鼠标样式
    const viewer = cesiumStore.getViewer
    if (viewer) {
      const canvas = viewer.canvas
      if (canvas) {
        canvas.style.cursor = 'default'
      }
    }
  })
  
  // 更改鼠标样式
  const viewer = cesiumStore.getViewer
  if (viewer) {
    const canvas = viewer.canvas
    if (canvas) {
      canvas.style.cursor = 'crosshair'
    }
  }
}

// 停止当前工具
const stopCurrentTool = () => {
  cancelDraw()
  clearDrawing()
  // 恢复鼠标样式
  const viewer = cesiumStore.getViewer
  if (viewer) {
    const canvas = viewer.canvas
    if (canvas) {
      canvas.style.cursor = 'default'
    }
  }
}

// 清除所有
const clearAll = () => {
  clearDrawing()
  activeTool.value = null
  emit('tool-change', null)
  // 恢复鼠标样式
  const viewer = cesiumStore.getViewer
  if (viewer) {
    const canvas = viewer.canvas
    if (canvas) {
      canvas.style.cursor = 'default'
    }
  }
}

// 生命周期
onMounted(() => {
  // 不需要初始化测量工具，直接使用cesiumStore的方法
})

onUnmounted(() => {
  // 清理工作由cesiumStore统一管理
})

// 监听cesiumStore变化
watch(() => cesiumStore.getIsInitialized, (isInitialized) => {
  // 不需要初始化测量工具
}, { immediate: true })
</script>

<style scoped lang="scss">
.map-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  
  .toolbar-content {
    display: flex;
    background: rgba(10, 25, 41, 0.45);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 16px;
    padding: 6px;
    box-shadow: 0 4px 20px rgba(0, 229, 255, 0.15);
    
    &.compact {
      padding: 4px;
    }
  }
  
  .tool-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: 1px solid transparent;
    color: #00e5ff;
    padding: 6px 10px;
    margin: 0 2px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
    
    &:hover {
      background: rgba(0, 229, 255, 0.15);
      border-color: rgba(0, 229, 255, 0.4);
      transform: translateY(-1px);
    }
    
    &.active {
      background: rgba(0, 229, 255, 0.25);
      border-color: #00e5ff;
      box-shadow: 0 2px 8px rgba(0, 229, 255, 0.3);
    }
    
    &:last-child {
      color: rgba(255, 100, 100, 0.8);
      
      &:hover {
        background: rgba(255, 100, 100, 0.15);
        border-color: rgba(255, 100, 100, 0.4);
      }
      
      &.active {
        background: rgba(255, 100, 100, 0.25);
        border-color: rgba(255, 100, 100, 0.6);
        box-shadow: 0 2px 8px rgba(255, 100, 100, 0.3);
      }
    }
    
    .icon-container {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .tool-icon {
      width: 16px;
      height: 16px;
      color: inherit;
    }
    
    .tool-name {
      font-size: 11px;
      white-space: nowrap;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .map-toolbar {
    .toolbar-content {
      .tool-button {
        padding: 6px 8px;
        
        .tool-name {
          display: none;
        }
      }
    }
  }
}
</style>