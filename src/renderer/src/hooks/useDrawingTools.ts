import { ref, computed } from 'vue'
import * as Cesium from 'cesium'
import { useCesiumStore } from '@renderer/stores/cesiumStore'

export function useDrawingTools() {
  const cesiumStore = useCesiumStore()
  const isDrawing = ref(false)
  const currentDrawingType = ref<string | null>(null)

  // 开始绘制
  const startDraw = (type: string, callback: any) => {
    if (!cesiumStore.getViewer) {
      console.error('Viewer not initialized')
      return
    }

    cancelDraw()
    isDrawing.value = true
    currentDrawingType.value = type

    const Cesium = cesiumStore.getCesium
    if (!Cesium) {
      console.error('Cesium is not available')
      return
    }

    let handler: any

    switch (type) {
      case 'point':
        handler = new Cesium.ScreenSpaceEventHandler(cesiumStore.getViewer.canvas)
        handler.setInputAction((event: any) => {
          const position = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
          if (position) {
            const cartographic = Cesium.Cartographic.fromCartesian(position)
            const coordinates = {
              longitude: Cesium.Math.toDegrees(cartographic.longitude),
              latitude: Cesium.Math.toDegrees(cartographic.latitude),
              height: cartographic.height
            }

            const entity = cesiumStore.getViewer.entities.add({
              position: position,
              point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
              }
            })

            cesiumStore.drawingEntities.push(entity)

            if (callback) {
              callback({
                type: 'point',
                positions: [coordinates],
                entity: entity
              })
            }

            cancelDraw()
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        break

      case 'line':
        let linePositions: any[] = []
        let lineEntity: any = null
        let tempPosition: any = null

        handler = new Cesium.ScreenSpaceEventHandler(cesiumStore.getViewer.canvas)

        // 处理鼠标移动，显示实时预览
        handler.setInputAction((event: any) => {
          if (linePositions.length > 0) {
            tempPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
            if (tempPosition && lineEntity) {
              cesiumStore.getViewer.entities.remove(lineEntity)
              const tempPositions = [...linePositions, tempPosition]
              lineEntity = cesiumStore.getViewer.entities.add({
                polyline: {
                  positions: tempPositions,
                  width: 3,
                  material: Cesium.Color.YELLOW
                }
              })
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction((event: any) => {
          const position = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
          if (position) {
            linePositions.push(position)

            if (linePositions.length === 1) {
              lineEntity = cesiumStore.getViewer.entities.add({
                polyline: {
                  positions: [...linePositions, tempPosition || position],
                  width: 3,
                  material: Cesium.Color.YELLOW
                }
              })
            } else if (lineEntity) {
              cesiumStore.getViewer.entities.remove(lineEntity)
              lineEntity = cesiumStore.getViewer.entities.add({
                polyline: {
                  positions: [...linePositions, tempPosition || position],
                  width: 3,
                  material: Cesium.Color.YELLOW
                }
              })
            }

            if (callback) {
              callback({
                type: 'line',
                positions: linePositions.map(pos => {
                  const cart = Cesium.Cartographic.fromCartesian(pos)
                  return {
                    longitude: Cesium.Math.toDegrees(cart.longitude),
                    latitude: Cesium.Math.toDegrees(cart.latitude),
                    height: cart.height
                  }
                }),
                entity: lineEntity
              })
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction(() => {
          if (lineEntity && linePositions.length >= 2) {
            cesiumStore.getViewer.entities.remove(lineEntity)
            lineEntity = cesiumStore.getViewer.entities.add({
              polyline: {
                positions: linePositions,
                width: 3,
                material: Cesium.Color.YELLOW
              }
            })
            cesiumStore.drawingEntities.push(lineEntity)

            if (callback) {
              callback({
                type: 'line',
                positions: linePositions.map(pos => {
                  const cart = Cesium.Cartographic.fromCartesian(pos)
                  return {
                    longitude: Cesium.Math.toDegrees(cart.longitude),
                    latitude: Cesium.Math.toDegrees(cart.latitude),
                    height: cart.height
                  }
                }),
                entity: lineEntity
              })
            }
          }
          cancelDraw()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        break

      case 'polygon':
        let polygonPositions: any[] = []
        let polygonEntity: any = null
        let polygonTempPosition: any = null

        handler = new Cesium.ScreenSpaceEventHandler(cesiumStore.getViewer.canvas)

        // 处理鼠标移动，显示实时预览
        handler.setInputAction((event: any) => {
          if (polygonPositions.length > 0) {
            polygonTempPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
            if (polygonTempPosition && polygonEntity) {
              cesiumStore.getViewer.entities.remove(polygonEntity)
              const tempPositions = [...polygonPositions, polygonTempPosition]
              polygonEntity = cesiumStore.getViewer.entities.add({
                polygon: {
                  hierarchy: new Cesium.PolygonHierarchy(tempPositions),
                  material: Cesium.Color.YELLOW.withAlpha(0.3),
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.YELLOW
                }
              })
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction((event: any) => {
          const position = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
          if (position) {
            polygonPositions.push(position)

            if (polygonPositions.length >= 2) {
              if (polygonEntity) {
                cesiumStore.getViewer.entities.remove(polygonEntity)
              }

              const tempPositions = [...polygonPositions, polygonTempPosition || position]
              polygonEntity = cesiumStore.getViewer.entities.add({
                polygon: {
                  hierarchy: new Cesium.PolygonHierarchy(tempPositions),
                  material: Cesium.Color.YELLOW.withAlpha(0.3),
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.YELLOW
                }
              })
            }

            if (callback) {
              callback({
                type: 'polygon',
                positions: polygonPositions.map(pos => {
                  const cart = Cesium.Cartographic.fromCartesian(pos)
                  return {
                    longitude: Cesium.Math.toDegrees(cart.longitude),
                    latitude: Cesium.Math.toDegrees(cart.latitude),
                    height: cart.height
                  }
                }),
                entity: polygonEntity
              })
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction(() => {
          if (polygonEntity) {
            cesiumStore.getViewer.entities.remove(polygonEntity)
            if (polygonPositions.length >= 3) {
              // 绘制最终多边形
              polygonEntity = cesiumStore.getViewer.entities.add({
                polygon: {
                  hierarchy: new Cesium.PolygonHierarchy(polygonPositions),
                  material: Cesium.Color.YELLOW.withAlpha(0.3),
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.YELLOW
                }
              })
              cesiumStore.drawingEntities.push(polygonEntity)

              if (callback) {
                callback({
                  type: 'polygon',
                  positions: polygonPositions.map(pos => {
                    const cart = Cesium.Cartographic.fromCartesian(pos)
                    return {
                      longitude: Cesium.Math.toDegrees(cart.longitude),
                      latitude: Cesium.Math.toDegrees(cart.latitude),
                      height: cart.height
                    }
                  }),
                  entity: polygonEntity
                })
              }
            }
          }
          cancelDraw()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        break

      case 'rectangle':
        let startPosition: any = null
        let rectangleEntity: any = null

        handler = new Cesium.ScreenSpaceEventHandler(cesiumStore.getViewer.canvas)

        handler.setInputAction((event: any) => {
          startPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

        handler.setInputAction((event: any) => {
          if (startPosition) {
            const endPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
            if (endPosition) {
              if (rectangleEntity) {
                cesiumStore.getViewer.entities.remove(rectangleEntity)
              }

              const startCartographic = Cesium.Cartographic.fromCartesian(startPosition)
              const endCartographic = Cesium.Cartographic.fromCartesian(endPosition)

              const west = Math.min(Cesium.Math.toDegrees(startCartographic.longitude), Cesium.Math.toDegrees(endCartographic.longitude))
              const east = Math.max(Cesium.Math.toDegrees(startCartographic.longitude), Cesium.Math.toDegrees(endCartographic.longitude))
              const south = Math.min(Cesium.Math.toDegrees(startCartographic.latitude), Cesium.Math.toDegrees(endCartographic.latitude))
              const north = Math.max(Cesium.Math.toDegrees(startCartographic.latitude), Cesium.Math.toDegrees(endCartographic.latitude))

              rectangleEntity = cesiumStore.getViewer.entities.add({
                rectangle: {
                  coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
                  material: Cesium.Color.YELLOW.withAlpha(0.3),
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.YELLOW
                }
              })
              cesiumStore.drawingEntities.push(rectangleEntity)

              if (callback) {
                callback({
                  type: 'rectangle',
                  positions: [
                    { longitude: west, latitude: south },
                    { longitude: east, latitude: south },
                    { longitude: east, latitude: north },
                    { longitude: west, latitude: north }
                  ],
                  entity: rectangleEntity
                })
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction(() => {
          cancelDraw()
        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        break

      case 'circle':
        let centerPosition: any = null
        let circleEntity: any = null

        handler = new Cesium.ScreenSpaceEventHandler(cesiumStore.getViewer.canvas)

        handler.setInputAction((event: any) => {
          centerPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

        handler.setInputAction((event: any) => {
          if (centerPosition) {
            const endPosition = cesiumStore.getViewer.camera.pickEllipsoid(event.position, cesiumStore.getViewer.scene.globe.ellipsoid)
            if (endPosition) {
              const distance = Cesium.Cartesian3.distance(centerPosition, endPosition)

              if (circleEntity) {
                cesiumStore.getViewer.entities.remove(circleEntity)
              }

              circleEntity = cesiumStore.getViewer.entities.add({
                position: centerPosition,
                ellipse: {
                  semiMajorAxis: distance,
                  semiMinorAxis: distance,
                  material: Cesium.Color.YELLOW.withAlpha(0.3),
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.YELLOW
                }
              })
              cesiumStore.drawingEntities.push(circleEntity)

              if (callback) {
                const cartographic = Cesium.Cartographic.fromCartesian(centerPosition)
                callback({
                  type: 'circle',
                  center: {
                    longitude: Cesium.Math.toDegrees(cartographic.longitude),
                    latitude: Cesium.Math.toDegrees(cartographic.latitude),
                    height: cartographic.height
                  },
                  radius: distance,
                  entity: circleEntity
                })
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        handler.setInputAction(() => {
          cancelDraw()
        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        break
    }

    cesiumStore.drawingHandler = handler
  }

  // 取消当前绘制
  const cancelDraw = () => {
    if (cesiumStore.drawingHandler) {
      cesiumStore.drawingHandler.destroy()
      cesiumStore.drawingHandler = null
    }
    isDrawing.value = false
    currentDrawingType.value = null
    cesiumStore.drawingType = null
    cesiumStore.drawCallback = null
  }

  // 清除所有绘制
  const clearAll = () => {
    cesiumStore.drawingEntities.forEach(entity => {
      if (cesiumStore.getViewer) {
        cesiumStore.getViewer.entities.remove(entity)
      }
    })
    cesiumStore.drawingEntities = []
    cancelDraw()
  }

  // 获取绘制状态
  const getIsDrawing = computed(() => isDrawing.value)
  const getCurrentDrawingType = computed(() => currentDrawingType.value)
  const getDrawingEntities = computed(() => cesiumStore.drawingEntities)

  return {
    startDraw,
    cancelDraw,
    clearAll,
    getIsDrawing,
    getCurrentDrawingType,
    getDrawingEntities
  }
}
