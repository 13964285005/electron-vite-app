<template>
  <div class="sensor-chart-container">
    <div class="chart-header">
      <div class="header-top">
        <h3>传感器实时监测</h3>
        <div class="selected-sensor-info">
          <span v-if="selectedSensor" class="selected-sensor-code">{{ selectedSensor.code }}</span>
          <span class="sensor-info-icon" @mouseenter="showSensorInfo = true" @mouseleave="showSensorInfo = false" title="传感器信息">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
        </div>
      </div>
      <div class="sensor-tabs">
        <button
          v-for="sensor in visibleSensors"
          :key="sensor.id"
          class="sensor-tab"
          :class="{ active: selectedSensorId === sensor.id, [sensor.status]: true }"
          @click="selectSensor(sensor.id)"
        >
          {{ sensor.code }}
        </button>
        <button v-if="sensors.length > 6" class="sensor-tab more-btn" @click="showModal = true">
          查看更多
        </button>
      </div>
    </div>

    <div class="chart-content">
      <div class="current-values">
        <div class="value-card pressure">
          <div class="value-label">压力</div>
          <div class="value-number">{{ currentData.pressure }}</div>
          <div class="value-unit">MPa</div>
        </div>
        <div class="value-card temperature">
          <div class="value-label">温度</div>
          <div class="value-number">{{ currentData.temperature }}</div>
          <div class="value-unit">℃</div>
        </div>
        <div class="value-card flow">
          <div class="value-label">流量</div>
          <div class="value-number">{{ currentData.flow }}</div>
          <div class="value-unit">m³/h</div>
        </div>
        <div class="value-card flow-velocity">
          <div class="value-label">流速</div>
          <div class="value-number">{{ currentData.flowVelocity }}</div>
          <div class="value-unit">m/s</div>
        </div>
      </div>

      <div class="chart-wrapper">
        <div ref="chartRef" class="echarts-container"></div>
      </div>
    </div>

    <!-- 传感器信息弹窗 -->
    <div v-if="showSensorInfo && selectedSensor" class="sensor-info-popup">
      <div class="info-item">
        <span class="info-label">名称：</span>
        <span class="info-value">{{ selectedSensor.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">位置：</span>
        <span class="info-value">{{ selectedSensor.location }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">状态：</span>
        <span class="info-value" :class="selectedSensor.status">{{ selectedSensor.status === 'online' ? '在线' : selectedSensor.status === 'warning' ? '告警' : '离线' }}</span>
      </div>
    </div>

    <!-- 选择传感器模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>选择传感器</h4>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="sensor-list">
            <button
              v-for="sensor in sensors"
              :key="sensor.id"
              class="sensor-item"
              :class="{ active: selectedSensorId === sensor.id, [sensor.status]: true }"
              @click="selectSensor(sensor.id); showModal = false"
            >
              <div class="sensor-item-code">{{ sensor.code }}</div>
              <div class="sensor-item-name">{{ sensor.name }}</div>
              <div class="sensor-item-status" :class="sensor.status">
                {{ sensor.status === 'online' ? '在线' : sensor.status === 'warning' ? '告警' : '离线' }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import useSensorStore from '../stores/sensorStore';
import type { Sensor } from '../types';

const sensorStore = useSensorStore();

const { sensors, sensorDataMap, currentSensorData } = sensorStore;

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const selectedSensorId = ref<string>('');
const showModal = ref(false);
const showSensorInfo = ref(false);

const selectSensor = (id: string) => {
  selectedSensorId.value = id;
};

const visibleSensors = computed(() => {
  return sensors.value.slice(0, 6);
});

const selectedSensor = computed(() => {
  if (!selectedSensorId.value) return null;
  return sensors.value.find(sensor => sensor.id === selectedSensorId.value) || null;
});

const currentData = computed(() => {
  if (!selectedSensorId.value) return { pressure: 0, temperature: 0, flow: 0, flowVelocity: 0 };
  const data = currentSensorData.value[selectedSensorId.value];
  return data || { pressure: 0, temperature: 0, flow: 0, flowVelocity: 0 };
});

const chartData = computed(() => {
  if (!selectedSensorId.value) return [];
  return sensorDataMap.value[selectedSensorId.value] || [];
});

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;

  const times = chartData.value.map(item => item.time);
  const pressureData = chartData.value.map(item => item.pressure);
  const tempData = chartData.value.map(item => item.temperature);
  const flowData = chartData.value.map(item => item.flow);
  const velocityData = chartData.value.map(item => item.flowVelocity);

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(10, 25, 41, 0.9)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
      textStyle: {
        color: '#fff',
        fontSize: 10
      }
    },
    legend: {
      data: ['压力', '温度', '流量', '流速'],
      textStyle: {
        color: 'rgba(0, 229, 255, 0.8)',
        fontSize: 9
      },
      top: 3,
      itemGap: 6
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLabel: {
        color: 'rgba(0, 229, 255, 0.6)',
        fontSize: 8,
        interval: Math.floor(times.length / 4)
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 229, 255, 0.3)'
        }
      },
      nameTextStyle: {
        fontSize: 8
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '压力/温度',
        position: 'left',
        nameTextStyle: {
          fontSize: 8
        },
        axisLabel: {
          color: 'rgba(0, 229, 255, 0.6)',
          formatter: '{value}',
          fontSize: 8
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 229, 255, 0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 229, 255, 0.1)'
          }
        }
      },
      {
        type: 'value',
        name: '流量/流速',
        position: 'right',
        nameTextStyle: {
          fontSize: 8
        },
        axisLabel: {
          color: 'rgba(0, 229, 255, 0.6)',
          formatter: '{value}',
          fontSize: 8
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0, 229, 255, 0.3)'
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '压力',
        type: 'line',
        yAxisIndex: 0,
        data: pressureData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#00e5ff',
          width: 2
        },
        itemStyle: {
          color: '#00e5ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 229, 255, 0.05)' }
          ])
        }
      },
      {
        name: '温度',
        type: 'line',
        yAxisIndex: 0,
        data: tempData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#ff6b6b',
          width: 2
        },
        itemStyle: {
          color: '#ff6b6b'
        }
      },
      {
        name: '流量',
        type: 'line',
        yAxisIndex: 1,
        data: flowData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#4ecdc4',
          width: 2
        },
        itemStyle: {
          color: '#4ecdc4'
        }
      },
      {
        name: '流速',
        type: 'line',
        yAxisIndex: 1,
        data: velocityData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#ffe66d',
          width: 2
        },
        itemStyle: {
          color: '#ffe66d'
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

const handleResize = () => {
  chartInstance?.resize();
};

watch(selectedSensorId, () => {
  updateChart();
});

watch(chartData, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  if (sensors.value.length > 0) {
    selectedSensorId.value = sensors.value[0].id;
  }

  initChart();

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});
</script>

<style scoped lang="less">
.sensor-chart-container {
  width: 100%;
  height: 100%;
  background: rgba(10, 25, 41, 0.7);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(3px);
  position: relative;

  .chart-header {
    flex-shrink: 0;
    margin-bottom: 8px;

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #00e5ff;
        margin: 0;
      }

      .selected-sensor-info {
        display: flex;
        align-items: center;
        gap: 4px;

        .selected-sensor-code {
          font-size: 10px;
          color: rgba(0, 229, 255, 0.8);
          background: rgba(0, 229, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .sensor-info-icon {
          font-size: 12px;
          color: rgba(0, 229, 255, 0.6);
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(0, 229, 255, 0.2);
            color: #00e5ff;
          }
        }
      }
    }

    .sensor-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .sensor-tab {
        padding: 3px 8px;
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 4px;
        background: rgba(0, 229, 255, 0.05);
        color: rgba(0, 229, 255, 0.7);
        font-size: 10px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 229, 255, 0.1);
          border-color: #00e5ff;
        }

        &.active {
          background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
          color: #0a1929;
          font-weight: 600;
          border-color: #00e5ff;
        }

        &.online {
          border-left: 3px solid #00e676;
        }

        &.offline {
          border-left: 3px solid #78909c;
          opacity: 0.6;
        }

        &.warning {
          border-left: 3px solid #ff4d4f;
        }

        &.more-btn {
          background: rgba(0, 229, 255, 0.1);
          border-style: dashed;

          &:hover {
            background: rgba(0, 229, 255, 0.2);
            border-style: solid;
          }
        }
      }
    }
  }

  .sensor-info-popup {
    position: absolute;
    top: 100%;
    right: 0;
    background: rgba(10, 25, 41, 0.95);
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 8px;
    padding: 8px;
    z-index: 1000;
    min-width: 150px;
    box-shadow: 0 4px 12px rgba(0, 229, 255, 0.2);

    .info-item {
      display: flex;
      margin-bottom: 4px;
      font-size: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        color: rgba(0, 229, 255, 0.6);
        margin-right: 4px;
        flex-shrink: 0;
      }

      .info-value {
        color: #fff;
        flex: 1;

        &.online {
          color: #00e676;
        }

        &.warning {
          color: #ff4d4f;
        }

        &.offline {
          color: #78909c;
        }
      }
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    pointer-events: auto;

    .modal-content {
      background: rgba(10, 25, 41, 0.95);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow: hidden;

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 229, 255, 0.2);

        h4 {
          font-size: 14px;
          font-weight: 600;
          color: #00e5ff;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(0, 229, 255, 0.6);
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            color: #00e5ff;
          }
        }
      }

      .modal-body {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;

        .sensor-list {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .sensor-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border: 1px solid rgba(0, 229, 255, 0.3);
            border-radius: 6px;
            background: rgba(0, 229, 255, 0.05);
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(0, 229, 255, 0.1);
              border-color: #00e5ff;
            }

            &.active {
              background: linear-gradient(135deg, #00e5ff 0%, #0080ff 100%);
              color: #0a1929;
              border-color: #00e5ff;
            }

            &.online {
              border-left: 3px solid #00e676;
            }

            &.offline {
              border-left: 3px solid #78909c;
              opacity: 0.6;
            }

            &.warning {
              border-left: 3px solid #ff4d4f;
            }

            .sensor-item-code {
              font-size: 12px;
              font-weight: 600;
              flex-shrink: 0;
            }

            .sensor-item-name {
              flex: 1;
              margin: 0 12px;
              font-size: 11px;
            }

            .sensor-item-status {
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 4px;
              flex-shrink: 0;

              &.online {
                background: rgba(0, 230, 118, 0.2);
                color: #00e676;
              }

              &.warning {
                background: rgba(255, 77, 79, 0.2);
                color: #ff4d4f;
              }

              &.offline {
                background: rgba(120, 144, 156, 0.2);
                color: #78909c;
              }
            }
          }
        }
      }
    }
  }

  .chart-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .current-values {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 6px;
      flex-shrink: 0;

      .value-card {
        background: rgba(0, 229, 255, 0.05);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        padding: 4px 6px;
        text-align: center;

        .value-label {
          font-size: 9px;
          color: rgba(0, 229, 255, 0.6);
          margin-bottom: 1px;
        }

        .value-number {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }

        .value-unit {
          font-size: 8px;
          color: rgba(0, 229, 255, 0.5);
          margin-top: 1px;
        }

        &.pressure .value-number {
          color: #00e5ff;
        }

        &.temperature .value-number {
          color: #ff6b6b;
        }

        &.flow .value-number {
          color: #4ecdc4;
        }

        &.flow-velocity .value-number {
          color: #ffe66d;
        }
      }
    }

    .chart-wrapper {
      flex: 1;
      min-height: 150px;

      .echarts-container {
        width: 100%;
        height: 100%;
        min-height: 150px;
      }
    }
  }
}
</style>