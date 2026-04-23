<template>
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { createMapTools } from '@renderer/hooks/MapTools'
import { useCesiumConfig } from '@renderer/hooks/useCesiumConfig'
import { useFlowPipes } from '@renderer/hooks/useFlowPipes'

// 使用hooks
const { initViewer, destroyViewer, getViewer, getCesium } = useCesiumConfig()
const { generateFlowPipes, flyToPipeArea } = useFlowPipes()

// 暴露viewer实例
defineExpose({
  getViewer: () => getViewer.value
})

const initMapCesium = () => {
  try {
    console.log('开始初始化Cesium地图...')
    
    // 初始化Cesium Viewer
    const viewer = initViewer('cesiumContainer')
    console.log('viewer', viewer)
    if (!viewer) {
      console.error('Failed to initialize Cesium Viewer')
      return
    }

    // 添加天地图底图
    try {
      const Cesium = getCesium.value
      // 天地图 API 密钥
      const tianDiTuKey = '9c1aadc6e9cbdb38554d7f1ff6b782cf'
      
      // 天地图卫星底图（默认显示）
      const imgImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/img_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        maximumLevel: 18
      })
      
      // 天地图矢量底图（默认隐藏）
      const vecImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/vec_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
        layer: 'vec',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        maximumLevel: 18
      })
      
      // 添加底图到图层集合
      viewer.imageryLayers.addImageryProvider(vecImageryProvider)
      viewer.imageryLayers.addImageryProvider(imgImageryProvider)
      
      console.log('天地图底图加载成功')
    } catch (error) {
      console.warn('添加天地图底图失败:', error)
      // 失败时添加OpenStreetMap作为备选
      if (viewer) {
        const Cesium = getCesium.value
        viewer.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: 'abc',
            maximumLevel: 19
          })
        )
        console.log('已添加OpenStreetMap作为备选底图')
      }
    }
    
    // 隐藏左下角的Cesium logo
    const cesiumLogo = document.querySelector('.cesium-viewer-bottom .cesium-logoContainer')
    if (cesiumLogo) {
      (cesiumLogo as HTMLElement).style.display = 'none'
    }

    // 隐藏cesium的icon
    viewer.cesiumWidget.creditContainer.style.display = "none";
    console.log('Cesium地图初始化成功')
    
    // 生成并添加流动管线和管点
    generateFlowPipes(viewer)
    
    // 等待底图加载后，动画移动到管线区域
    setTimeout(() => {
      console.log('开始动画移动相机到管线区域...')
      flyToPipeArea(viewer, 1.5)
    }, 1000)
    
    // 创建MapTools实例
    createMapTools(viewer)
  } catch (error) {
    console.error('Cesium地图初始化失败:', error)
  }
}

onMounted(() => {
  initMapCesium()
})

onUnmounted(() => {
  destroyViewer()
  console.log('地图组件已销毁')
})
</script>

<style lang="scss" scoped>
#cesiumContainer {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>