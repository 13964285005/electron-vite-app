/// <reference types="vite/client" />

// Cesium类型声明
declare global {
  interface Window {
    CESIUM_BASE_URL?: string
    Cesium?: any
  }
}

export {}
