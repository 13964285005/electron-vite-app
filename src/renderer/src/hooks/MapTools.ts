import { ref } from 'vue'
import { useCesiumStore } from '@renderer/stores/cesiumStore'

// 类型定义
type Viewer = any

export class MapTools {
  private viewer: Viewer
  private clickHandlers: ((position: any, cartographic: any) => void)[] = []
  private measureHandler: any = null
  private measureEntities: any[] = []
  private Cesium: any

  constructor(viewer: Viewer) {
    this.viewer = viewer
    const cesiumStore = useCesiumStore()
    this.Cesium = cesiumStore.getCesium
    this.initClickEvents()
  }

  // 初始化点击事件
  private initClickEvents() {
    this.viewer.screenSpaceEventHandler.setInputAction((event: any) => {
      const position = this.viewer.scene.pickPosition(event.position)
      if (position) {
        const cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
        const longitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.longitude)
        const latitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.latitude)
        const height = cartographic.height
        
        // 触发所有点击回调
        this.clickHandlers.forEach(handler => {
          handler({ longitude, latitude, height }, cartographic)
        })
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // 添加点击事件监听
  onMapClick(handler: (position: { longitude: number; latitude: number; height: number }, cartographic: any) => void) {
    this.clickHandlers.push(handler)
    return () => {
      this.clickHandlers = this.clickHandlers.filter(h => h !== handler)
    }
  }

  // 点位拾取
  pickPosition(screenPosition: { x: number; y: number }) {
    const position = this.viewer.scene.pickPosition(screenPosition)
    if (position) {
      const cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
      const longitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.longitude)
      const latitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.latitude)
      const height = cartographic.height
      return { longitude, latitude, height, cartesian: position }
    }
    return null
  }

  // 开始距离测量
  startDistanceMeasurement() {
    this.clearMeasurement()
    
    const points: any[] = []
    let polyline: any = null
    let label: any = null

    this.measureHandler = this.viewer.screenSpaceEventHandler.setInputAction((event: any) => {
      const position = this.viewer.scene.pickPosition(event.position)
      if (position) {
        points.push(position)
        
        // 添加点
        const point = this.viewer.entities.add({
          position: position,
          point: {
            pixelSize: 5,
            color: this.Cesium.Color.RED,
            outlineColor: this.Cesium.Color.WHITE,
            outlineWidth: 2
          }
        })
        this.measureEntities.push(point)

        // 更新或创建折线
        if (points.length > 1) {
          if (polyline) {
            this.viewer.entities.remove(polyline)
          }
          
          polyline = this.viewer.entities.add({
            polyline: {
              positions: points,
              width: 2,
              material: new this.Cesium.PolylineDashMaterialProperty({
                color: this.Cesium.Color.RED
              })
            }
          })
          this.measureEntities.push(polyline)

          // 计算距离
          const distance = this.calculateDistance(points)
          const lastPoint = points[points.length - 1]
          
          if (label) {
            this.viewer.entities.remove(label)
          }
          
          label = this.viewer.entities.add({
            position: lastPoint,
            label: {
              text: `距离: ${distance.toFixed(2)} 米`,
              font: '14px sans-serif',
              fillColor: this.Cesium.Color.WHITE,
              outlineColor: this.Cesium.Color.BLACK,
              outlineWidth: 2,
              verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new this.Cesium.Cartesian2(0, -10)
            }
          })
          this.measureEntities.push(label)
        }
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // 开始面积测量
  startAreaMeasurement() {
    this.clearMeasurement()
    
    const points: any[] = []
    let polygon: any = null
    let label: any = null

    this.measureHandler = this.viewer.screenSpaceEventHandler.setInputAction((event: any) => {
      const position = this.viewer.scene.pickPosition(event.position)
      if (position) {
        points.push(position)
        
        // 添加点
        const point = this.viewer.entities.add({
          position: position,
          point: {
            pixelSize: 5,
            color: this.Cesium.Color.GREEN,
            outlineColor: this.Cesium.Color.WHITE,
            outlineWidth: 2
          }
        })
        this.measureEntities.push(point)

        // 更新或创建多边形
        if (points.length > 2) {
          if (polygon) {
            this.viewer.entities.remove(polygon)
          }
          
          polygon = this.viewer.entities.add({
            polygon: {
              hierarchy: points,
              material: new this.Cesium.ColorMaterialProperty(
                this.Cesium.Color.GREEN.withAlpha(0.2)
              ),
              outline: true,
              outlineColor: this.Cesium.Color.GREEN,
              outlineWidth: 2
            }
          })
          this.measureEntities.push(polygon)

          // 计算面积
          const area = this.calculateArea(points)
          const center = this.calculateCenter(points)
          
          if (label) {
            this.viewer.entities.remove(label)
          }
          
          label = this.viewer.entities.add({
            position: center,
            label: {
              text: `面积: ${(area / 1000000).toFixed(2)} 平方公里`,
              font: '14px sans-serif',
              fillColor: this.Cesium.Color.WHITE,
              outlineColor: this.Cesium.Color.BLACK,
              outlineWidth: 2,
              verticalOrigin: this.Cesium.VerticalOrigin.CENTER
            }
          })
          this.measureEntities.push(label)
        }
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // 清除测量
  clearMeasurement() {
    if (this.measureHandler) {
      this.viewer.screenSpaceEventHandler.removeInputAction(this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.measureHandler = null
    }
    
    this.measureEntities.forEach(entity => {
      this.viewer.entities.remove(entity)
    })
    this.measureEntities = []
  }

  // 计算两点间距离
  calculateDistance(points: any[]): number {
    let distance = 0
    for (let i = 0; i < points.length - 1; i++) {
      distance += this.Cesium.Cartesian3.distance(points[i], points[i + 1])
    }
    return distance
  }

  // 计算多边形面积
  calculateArea(points: any[]): number {
    const polygonHierarchy = new this.Cesium.PolygonHierarchy(points)
    return this.Cesium.Ellipsoid.WGS84.computeArea(polygonHierarchy)
  }

  // 计算点集中心
  calculateCenter(points: any[]): any {
    let x = 0, y = 0, z = 0
    for (const point of points) {
      x += point.x
      y += point.y
      z += point.z
    }
    return new this.Cesium.Cartesian3(x / points.length, y / points.length, z / points.length)
  }

  // 飞至指定位置
  flyTo(position: { longitude: number; latitude: number; height: number }, duration: number = 3) {
    this.viewer.camera.flyTo({
      destination: this.Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.height
      ),
      duration: duration
    })
  }

  // 设置视角
  setView(position: { longitude: number; latitude: number; height: number }, orientation: { heading: number; pitch: number; roll: number }) {
    this.viewer.camera.setView({
      destination: this.Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.height
      ),
      orientation: {
        heading: this.Cesium.Math.toRadians(orientation.heading),
        pitch: this.Cesium.Math.toRadians(orientation.pitch),
        roll: orientation.roll
      }
    })
  }

  // 添加标记点
  addMarker(position: { longitude: number; latitude: number; height: number }, options: {
    name?: string
    color?: any
    size?: number
  } = {}) {
    const marker = this.viewer.entities.add({
      name: options.name || 'Marker',
      position: this.Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.height
      ),
      point: {
        pixelSize: options.size || 10,
        color: options.color || this.Cesium.Color.RED,
        outlineColor: this.Cesium.Color.WHITE,
        outlineWidth: 2
      }
    })
    return marker
  }

  // 添加多边形
  addPolygon(positions: { longitude: number; latitude: number; height?: number }[], options: {
    name?: string
    color?: any
    outlineColor?: any
    outlineWidth?: number
  } = {}) {
    const cartesianPositions = positions.map(p => 
      this.Cesium.Cartesian3.fromDegrees(
        p.longitude,
        p.latitude,
        p.height || 0
      )
    )
    
    const polygon = this.viewer.entities.add({
      name: options.name || 'Polygon',
      polygon: {
        hierarchy: cartesianPositions,
        material: new this.Cesium.ColorMaterialProperty(
          options.color || this.Cesium.Color.BLUE.withAlpha(0.2)
        ),
        outline: true,
        outlineColor: options.outlineColor || this.Cesium.Color.BLUE,
        outlineWidth: options.outlineWidth || 2
      }
    })
    return polygon
  }

  // 添加折线
  addPolyline(positions: { longitude: number; latitude: number; height?: number }[], options: {
    name?: string
    color?: any
    width?: number
  } = {}) {
    const cartesianPositions = positions.map(p => 
      this.Cesium.Cartesian3.fromDegrees(
        p.longitude,
        p.latitude,
        p.height || 0
      )
    )
    
    const polyline = this.viewer.entities.add({
      name: options.name || 'Polyline',
      polyline: {
        positions: cartesianPositions,
        width: options.width || 3,
        material: new this.Cesium.PolylineColorMaterialProperty(
          options.color || this.Cesium.Color.RED
        )
      }
    })
    return polyline
  }

  // 移除实体
  removeEntity(entity: any) {
    if (entity) {
      this.viewer.entities.remove(entity)
    }
  }

  // 清除所有实体
  clearEntities() {
    this.viewer.entities.removeAll()
  }

  // 获取当前视角
  getCurrentView() {
    const position = this.viewer.camera.position
    const cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
    const longitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.longitude)
    const latitude = this.viewer.scene.globe.ellipsoid.toDegrees(cartographic.latitude)
    const height = cartographic.height
    
    const heading = this.viewer.camera.heading
    const pitch = this.viewer.camera.pitch
    const roll = this.viewer.camera.roll
    
    return {
      position: { longitude, latitude, height },
      orientation: {
        heading: this.Cesium.Math.toDegrees(heading),
        pitch: this.Cesium.Math.toDegrees(pitch),
        roll: this.Cesium.Math.toDegrees(roll)
      }
    }
  }
}

// 全局 MapTools 实例
let mapToolsInstance: MapTools | null = null

// 创建 MapTools 实例
export function createMapTools(viewer: Viewer) {
  mapToolsInstance = new MapTools(viewer)
  return mapToolsInstance
}

// 获取 MapTools 实例
export function useMapTools() {
  if (!mapToolsInstance) {
    throw new Error('MapTools 实例未初始化，请先调用 createMapTools')
  }
  return mapToolsInstance
}
