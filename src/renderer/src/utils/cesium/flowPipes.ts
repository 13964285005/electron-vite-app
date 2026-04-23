// 流动管线和管点生成工具

// 管线数据类型
export interface PipeData {
  name: string
  color: any
  positions: any[]
}

// 存储所有创建的实体，方便后续管理
const pipeEntities: any[] = []

// 生成流动管线和管点
export function generateFlowPipes(viewer: any) {
  try {
    console.log('开始生成流动管线和管点...')

    // 检查Cesium是否可用
    if (!(window as any).Cesium) {
      console.error('Cesium对象不可用')
      return
    }

    const Cesium = (window as any).Cesium

    // 清除已存在的管线实体
    clearPipeEntities(viewer)

    // 定义管线数据 - 模拟青岛地区的热力管道（长度不低于5公里）
    const pipeDataList: PipeData[] = [
      {
        name: '主管道1',
        color: Cesium.Color.fromCssColorString('#ff4444'),
        positions: Cesium.Cartesian3.fromDegreesArray([120.3, 36.0, 120.34, 36.02, 120.38, 36.05])
      },
      {
        name: '主管道2',
        color: Cesium.Color.fromCssColorString('#44ff44'),
        positions: Cesium.Cartesian3.fromDegreesArray([120.32, 36.02, 120.36, 36.04, 120.4, 36.07])
      },
      {
        name: '支管道1',
        color: Cesium.Color.fromCssColorString('#ffff44'),
        positions: Cesium.Cartesian3.fromDegreesArray([120.35, 36.04, 120.38, 36.03, 120.42, 36.03])
      },
      {
        name: '支管道2',
        color: Cesium.Color.fromCssColorString('#4444ff'),
        positions: Cesium.Cartesian3.fromDegreesArray([120.37, 36.06, 120.41, 36.07, 120.45, 36.08])
      }
    ]

    console.log('管线数据定义成功:', pipeDataList.length, '条管线')

    // 逐个添加管线
    pipeDataList.forEach((pipeData) => {
      addSinglePipe(viewer, pipeData)
    })

    console.log('流动管线和管点生成完成')
  } catch (error) {
    console.error('生成流动管线失败:', error)
  }
}

// 添加单条管线
function addSinglePipe(viewer: any, pipeData: PipeData) {
  const Cesium = (window as any).Cesium
  console.log('添加管线', Cesium, viewer)

  try {
    // 1. 添加基础管线（半透明背景线）
    const baseLineEntity = new Cesium.Entity({
      name: pipeData.name + '_base',
      polyline: {
        positions: pipeData.positions,
        width: 6,
        material: Cesium.Color.fromAlpha(pipeData.color, 0.3),
        clampToGround: false
      }
    })
    viewer.entities.add(baseLineEntity)
    pipeEntities.push(baseLineEntity)
    viewer.zoomTo(baseLineEntity)
    // 2. 添加发光主管线
    const glowMaterial = new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.4,
      color: pipeData.color
    })
    const glowLineEntity = viewer.entities.add({
      name: pipeData.name + '_glow',
      polyline: {
        positions: pipeData.positions,
        width: 10,
        material: glowMaterial,
        clampToGround: false
      }
    })
    pipeEntities.push(glowLineEntity)

    // 3. 添加动态流动点效果
    addFlowPoints(viewer, pipeData)

    // 4. 添加管点（起点、终点和中间点）
    addPipeNodes(viewer, pipeData)

    console.log('管线', pipeData.name, '添加成功')
  } catch (error) {
    console.error('添加管线', pipeData.name, '失败:', error)
  }
}

// 添加流动点效果
function addFlowPoints(viewer: any, pipeData: PipeData) {
  const Cesium = (window as any).Cesium
  const positions = pipeData.positions
  const pointCount = 8

  for (let i = 0; i < pointCount; i++) {
    const pointEntity = viewer.entities.add({
      name: pipeData.name + '_flow_point_' + i,
      position: new Cesium.CallbackProperty(() => {
        const totalTime = (Date.now() / 1000 + i * 0.5) % 5 // 每5秒循环一次
        const t = totalTime / 5 // 0到1之间

        // 计算当前位置（沿路径前进）
        if (positions.length === 2) {
          // 只有两点，简单线性插值
          return Cesium.Cartesian3.lerp(positions[0], positions[1], t, new Cesium.Cartesian3())
        } else {
          // 多个点，分段插值
          const segmentCount = positions.length - 1
          const segmentT = t * segmentCount
          const segmentIndex = Math.floor(segmentT)
          const localT = segmentT - segmentIndex

          const startIndex = Math.min(segmentIndex, positions.length - 2)
          const endIndex = startIndex + 1

          return Cesium.Cartesian3.lerp(
            positions[startIndex],
            positions[endIndex],
            localT,
            new Cesium.Cartesian3()
          )
        }
      }, false),
      point: {
        pixelSize: 12,
        color: pipeData.color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    })
    pipeEntities.push(pointEntity)
  }
}

// 添加管点（起点、终点和中间节点）
function addPipeNodes(viewer: any, pipeData: PipeData) {
  const Cesium = (window as any).Cesium
  const positions = pipeData.positions

  // 添加起点
  const startNode = viewer.entities.add({
    name: pipeData.name + '_起点',
    position: positions[0],
    point: {
      pixelSize: 24,
      color: pipeData.color,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3
    },
    label: {
      text: pipeData.name + '起点',
      font: '14px Microsoft YaHei',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      pixelOffset: new Cesium.Cartesian2(0, -35),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  })
  pipeEntities.push(startNode)

  // 添加终点
  const endNode = viewer.entities.add({
    name: pipeData.name + '_终点',
    position: positions[positions.length - 1],
    point: {
      pixelSize: 24,
      color: pipeData.color,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3
    },
    label: {
      text: pipeData.name + '终点',
      font: '14px Microsoft YaHei',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      pixelOffset: new Cesium.Cartesian2(0, -35),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  })
  pipeEntities.push(endNode)

  // 添加中间节点
  for (let i = 1; i < positions.length - 1; i++) {
    const middleNode = viewer.entities.add({
      name: pipeData.name + '_节点' + i,
      position: positions[i],
      point: {
        pixelSize: 18,
        color: pipeData.color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      },
      label: {
        text: '节点' + i,
        font: '12px Microsoft YaHei',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, -30),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    pipeEntities.push(middleNode)
  }
}

// 清除所有管线实体
function clearPipeEntities(viewer: any) {
  pipeEntities.forEach((entity) => {
    try {
      if (viewer.entities.contains(entity)) {
        viewer.entities.remove(entity)
      }
    } catch (e) {
      // 忽略删除错误
    }
  })
  pipeEntities.length = 0
}

// 相机视角动画移动
export function flyToPipeArea(viewer: any, duration: number = 4) {
  const Cesium = (window as any).Cesium

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(120.37, 36.04, 20000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-50),
      roll: 0
    },
    duration: duration,
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
  })
}
