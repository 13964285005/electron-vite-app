import { ref, onMounted, onUnmounted } from 'vue';
import type { Sensor, SensorData, SensorDataPoint } from '../types';
import { mockSensors } from '../mock';

const useSensorStore = () => {
  const sensors = ref<Sensor[]>([...mockSensors]);

  const sensorDataMap = ref<Record<string, SensorDataPoint[]>>({});

  const currentSensorData = ref<Record<string, SensorData>>({});

  let updateInterval: ReturnType<typeof setInterval> | null = null;

  const MAX_DATA_POINTS = 20;

  const generateRandomData = (sensorId: string): SensorData => {
    const basePressure = 0.5 + Math.random() * 0.3;
    const baseTemp = 45 + Math.random() * 15;
    const baseFlow = 80 + Math.random() * 40;
    const baseVelocity = 1.2 + Math.random() * 0.6;

    return {
      timestamp: Date.now(),
      pressure: parseFloat(basePressure.toFixed(2)),
      temperature: parseFloat(baseTemp.toFixed(1)),
      flow: parseFloat(baseFlow.toFixed(1)),
      flowVelocity: parseFloat(baseVelocity.toFixed(2))
    };
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const updateSensorData = () => {
    sensors.value.forEach(sensor => {
      if (sensor.status === 'offline') return;

      const newData = generateRandomData(sensor.id);

      currentSensorData.value[sensor.id] = {
        timestamp: newData.timestamp,
        pressure: newData.pressure,
        temperature: newData.temperature,
        flow: newData.flow,
        flowVelocity: newData.flowVelocity
      };

      if (!sensorDataMap.value[sensor.id]) {
        sensorDataMap.value[sensor.id] = [];
      }

      const dataPoint: SensorDataPoint = {
        time: formatTime(newData.timestamp),
        pressure: newData.pressure,
        temperature: newData.temperature,
        flow: newData.flow,
        flowVelocity: newData.flowVelocity
      };

      sensorDataMap.value[sensor.id].push(dataPoint);

      if (sensorDataMap.value[sensor.id].length > MAX_DATA_POINTS) {
        sensorDataMap.value[sensor.id].shift();
      }
    });
  };

  const initSensorData = () => {
    sensors.value.forEach(sensor => {
      sensorDataMap.value[sensor.id] = [];

      if (sensor.status !== 'offline') {
        currentSensorData.value[sensor.id] = {
          timestamp: Date.now(),
          pressure: 0,
          temperature: 0,
          flow: 0,
          flowVelocity: 0
        };
      }
    });
  };

  const startRealTimeUpdate = () => {
    if (updateInterval) return;

    updateInterval = setInterval(() => {
      updateSensorData();
    }, 2000);
  };

  const stopRealTimeUpdate = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };

  onMounted(() => {
    initSensorData();
    startRealTimeUpdate();
  });

  onUnmounted(() => {
    stopRealTimeUpdate();
  });

  return {
    sensors,
    sensorDataMap,
    currentSensorData,
    startRealTimeUpdate,
    stopRealTimeUpdate
  };
};

export default useSensorStore;