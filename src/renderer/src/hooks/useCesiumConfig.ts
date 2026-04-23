import { ref, computed } from 'vue'
import { useCesiumStore } from '@renderer/stores/cesiumStore'

export function useCesiumConfig() {
  const cesiumStore = useCesiumStore()
  const isInitializing = ref(false)
  const initializationError = ref<Error | null>(null)

  // 初始化Cesium Viewer
  const initViewer = (containerId: string, options: any = {}) => {
    // debugger
    isInitializing.value = true
    initializationError.value = null

    try {
      const defaultOptions = {
        imageryProvider: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        timeline: false,
        animation: false,
        geocoder: false,
        sceneModePicker: false,
        scene3DOnly: true,
        terrainProvider: false,
        shouldAnimate: false,
        useDefaultRenderLoop: true
      }
      
      const viewer = cesiumStore.initViewer(containerId, {
        ...defaultOptions,
        ...options
      })
      if (viewer) {
        // 禁用太阳和月亮的位置计算，避免网络请求
        viewer.scene.sun.show = false
        viewer.scene.moon.show = false
      }

      return viewer
    } catch (error) {
      initializationError.value = error as Error
      console.error('Failed to initialize Cesium Viewer:', error)
      return null
    } finally {
      isInitializing.value = false
    }
  }

  // 销毁Cesium实例
  const destroyViewer = () => {
    cesiumStore.destroy()
  }

  // 获取Cesium实例
  const getCesium = computed(() => {
    return cesiumStore.getCesium
  })

  // 获取Viewer实例
  const getViewer = computed(() => {
    return cesiumStore.getViewer
  })

  // 获取初始化状态
  const isInitialized = computed(() => {
    return cesiumStore.getIsInitialized
  })

  return {
    initViewer,
    destroyViewer,
    getCesium,
    getViewer,
    isInitialized,
    isInitializing,
    initializationError
  }
}
