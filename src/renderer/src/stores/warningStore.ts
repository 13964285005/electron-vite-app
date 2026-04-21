import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Mock from 'mockjs';

const Random = Mock.Random;

// 预警类型定义
export interface Warning {
  id: string;
  level: 'critical' | 'warning' | 'info';
  content: string;
  deviceName: string;
  createTime: string;
  status: 'pending' | 'processing' | 'resolved';
  handler?: string;
  handleTime?: string;
  remark?: string;
}

// 预警内容列表
const warningContents = [
  '设备温度异常，超过安全阈值 85°C',
  '设备压力波动较大，建议检查',
  '设备例行巡检完成，运行正常',
  '管道泄漏检测到，明显泄漏迹象',
  '流量异常，可能存在堵塞',
  '设备离线，无法通信',
  '传感器数据异常，需要校准',
  '设备电压异常，建议检查电源',
  '设备运行时间过长，建议维护',
  '管道压力过低，可能存在泄漏'
];

const levels: ('critical' | 'warning' | 'info')[] = ['critical', 'warning', 'info'];
const statuses: ('pending' | 'processing' | 'resolved')[] = ['pending', 'processing', 'resolved'];

// 模拟预警数据
const generateWarnings = (): Warning[] => {
  const count = Math.floor(Math.random() * 11) + 10; // 10-20条
  const warnings: Warning[] = [];
  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const now = Date.now();
    const pastTime = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // 过去7天内

    warnings.push({
      id: String(i + 1),
      level: level,
      content: warningContents[Math.floor(Math.random() * warningContents.length)],
      deviceName: '热力管道监测点' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      createTime: new Date(now - pastTime).toISOString(),
      status: status,
      handler: status !== 'pending' ? Random.cname() : undefined,
      handleTime: status !== 'pending' ? new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString() : undefined,
      remark: status === 'resolved' ? Random.sentence(10, 20) : undefined
    });
  }
  return warnings;
};

const mockWarnings: Warning[] = generateWarnings();

// 预警数据
const warnings = ref<Warning[]>([...mockWarnings]);

// 计算属性：未读预警数量
const unreadCount = computed(() => {
  return warnings.value.filter(w => w.status === 'pending').length;
});

// 计算属性：最近的预警
const recentWarnings = computed(() => {
  return warnings.value.slice(0, 5);
});

// 加载预警数据
const loadWarnings = () => {
  // 实际应用中应该从 API 获取数据
  warnings.value = [...mockWarnings];
};

// 处理预警
const handleWarning = (warning: Warning) => {
  const index = warnings.value.findIndex(w => w.id === warning.id);
  if (index !== -1) {
    warnings.value[index] = {
      ...warnings.value[index],
      status: 'processing',
      handler: localStorage.getItem('username') || '未知',
      handleTime: new Date().toISOString()
    };
    ElMessage({
      message: '预警已开始处理',
      type: 'success',
      duration: 3000
    });
  }
};

// 完成预警处理
const resolveWarning = (warning: Warning) => {
  const index = warnings.value.findIndex(w => w.id === warning.id);
  if (index !== -1) {
    warnings.value[index] = {
      ...warnings.value[index],
      status: 'resolved',
      handleTime: new Date().toISOString()
    };
    ElMessage({
      message: '预警已处理完成',
      type: 'success',
      duration: 3000
    });
  }
};

// 导出
const useWarningStore = () => {
  return {
    // 状态
    warnings,
    unreadCount,
    recentWarnings,
    
    // 方法
    loadWarnings,
    handleWarning,
    resolveWarning
  };
};

export default useWarningStore;