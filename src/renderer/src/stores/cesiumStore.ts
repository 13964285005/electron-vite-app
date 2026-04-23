// Cesium 管理存储
import { defineStore } from 'pinia'
// 导入Cesium
import * as Cesium from 'cesium'


export const useCesiumStore = defineStore('cesium', {
  state: () => ({
    // 公共数据属性
    viewer: null as any,
    isInitialized: false,
    drawingHandler: null as any,
    drawingType: null as string | null,
    drawingEntities: [] as any[],
    drawCallback: null as any
  }),
  
  getters: {
    // 获取Viewer实例
    getViewer: (state) => state.viewer,
    // 获取Cesium实例
    getCesium: () => Cesium,
    // 获取初始化状态
    getIsInitialized: (state) => state.isInitialized
  },
  
  actions: {
    // 初始化Cesium Viewer
    initViewer(containerId: string, options: any = {}) {
      const Cesium = this.getCesium
      if (!Cesium) {
        console.error('Cesium is not available')
        return null
      }
      
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
        
        this.viewer = new Cesium.Viewer(containerId, {
          ...defaultOptions,
          ...options
        })
        
        // 禁用太阳和月亮的位置计算，避免网络请求
        this.viewer.scene.sun.show = false
        this.viewer.scene.moon.show = false
        
        this.isInitialized = true
        console.log('Cesium Viewer initialized successfully')
        return this.viewer
      } catch (error) {
        console.error('Failed to initialize Cesium Viewer:', error)
        return null
      }
    },
    
    // 销毁Cesium实例
    destroy() {
      // 清除绘制实体
      this.drawingEntities.forEach(entity => {
        if (this.viewer) {
          this.viewer.entities.remove(entity)
        }
      })
      this.drawingEntities = []
      
      // 销毁绘制处理器
      if (this.drawingHandler) {
        this.drawingHandler.destroy()
        this.drawingHandler = null
      }
      
      // 销毁Viewer实例
      if (this.viewer) {
        this.viewer.destroy()
        this.viewer = null
      }
      
      this.isInitialized = false
      this.drawingType = null
      this.drawCallback = null
      console.log('Cesium resources released')
    }
  }
})
