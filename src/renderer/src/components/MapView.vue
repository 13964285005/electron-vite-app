<template>
  <div id="cesiumContainer"></div>
</template>
 
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { createMapTools } from '@renderer/hooks/MapTools'

// 使用全局的Cesium对象
const Cesium = (window as any).Cesium

// Cesium Viewer实例
let viewer: any = null

const initMapCesium = () => {
  // 创建Cesium Viewer实例
  viewer = new Cesium.Viewer('cesiumContainer', {
    // 禁用默认影像图层
    imageryProvider: false,
    // 禁用所有默认控件
    baseLayerPicker: false,
    fullscreenButton: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    timeline: false,
    animation: false,
    geocoder: false,
    sceneModePicker: false,
    // 仅使用3D场景
    scene3DOnly: true
  })

  // 添加天地图底图
  try {
    // 天地图 API 密钥（需要替换为真实的密钥）
    const tianDiTuKey = '9c1aadc6e9cbdb38554d7f1ff6b782cf'
    
    // 天地图卫星底图（默认显示）
    const imgImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.gov.cn/img_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
      layer: 'img',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
      show: true
    })
    
    // 天地图卫星标注
    const ciaImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.gov.cn/cia_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
      layer: 'cia',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
      show: true
    })
    
    // 天地图矢量底图（默认隐藏）
    const vecImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.gov.cn/vec_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
      layer: 'vec',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
      show: false
    })
    
    // 天地图矢量标注
    const cvaImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: 'http://t0.tianditu.gov.cn/cva_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tianDiTuKey,
      layer: 'cva',
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
      show: false
    })
    
    // 添加底图到图层集合（按从下到上的顺序）
    viewer.imageryLayers.addImageryProvider(vecImageryProvider)
    viewer.imageryLayers.addImageryProvider(imgImageryProvider)
    viewer.imageryLayers.addImageryProvider(cvaImageryProvider)
    viewer.imageryLayers.addImageryProvider(ciaImageryProvider)
    
    console.log('天地图底图加载成功')
  } catch (error) {
    console.warn('添加天地图底图失败:', error)
    // 失败时添加简单的蓝色背景作为底图
    viewer.imageryLayers.addImageryProvider(
      new Cesium.SingleTileImageryProvider({
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
      })
    )
  }
  
  
  // 隐藏左下角的Cesium logo
  const cesiumLogo = document.querySelector('.cesium-viewer-bottom .cesium-logoContainer')
  if (cesiumLogo) {
    (cesiumLogo as HTMLElement).style.display = 'none'
  }
  
  // 设置初始视角（山东青岛，俯视角度）
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(120.38, 36.06, 60000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-85),
      roll: 0
    }
  })

  // 隐藏cesium的icon
  viewer.cesiumWidget.creditContainer.style.display = "none";
  console.log('Cesium地图初始化成功')
  
  // 创建MapTools实例
  createMapTools(viewer)
}

onMounted(() => {
  initMapCesium()
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
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