import { ref, computed, onMounted } from 'vue';
import type { Platform } from '../types';
import { mockPlatforms } from '../mock';

// 模拟平台数据
const platforms = ref<Platform[]>([...mockPlatforms]);

// 模拟设备数据（添加platformId字段）
const deviceList = ref([
  { code: 'DEV001', name: '热力监测站A01', type: '监测站', area: '市南区', platformId: '1', status: 'online', statusText: '在线', lastOnline: '2024-01-15 14:30:25', description: '主要监测市南区域热力管道压力和温度', location: '市南区中山路123号' },
  { code: 'DEV002', name: '热力监测站A02', type: '监测站', area: '市南区', platformId: '1', status: 'online', statusText: '在线', lastOnline: '2024-01-15 14:28:18', description: '辅助监测站，负责备份数据', location: '市南区香港路456号' },
  { code: 'DEV003', name: '管道传感器B01', type: '传感器', area: '市北区', platformId: '1', status: 'warning', statusText: '告警', lastOnline: '2024-01-15 13:45:33', description: '监测管道流量异常', location: '市北区辽宁路789号' },
  { code: 'DEV004', name: '管道传感器B02', type: '传感器', area: '市北区', platformId: '2', status: 'online', statusText: '在线', lastOnline: '2024-01-15 14:29:45', description: '监测管道压力', location: '市北区人民路321号' },
  { code: 'DEV005', name: '热力监测站C01', type: '监测站', area: '李沧区', platformId: '2', status: 'offline', statusText: '离线', lastOnline: '2024-01-14 22:15:10', description: '李沧区主监测站', location: '李沧区李村路654号' },
  { code: 'DEV006', name: '控制阀门D01', type: '控制阀', area: '崂山区', platformId: '3', status: 'online', statusText: '在线', lastOnline: '2024-01-15 14:27:52', description: '控制崂山区域热力流量', location: '崂山区崂山路987号' },
  { code: 'DEV007', name: '控制阀门D02', type: '控制阀', area: '崂山区', platformId: '3', status: 'online', statusText: '在线', lastOnline: '2024-01-15 14:30:01', description: '备用控制阀门', location: '崂山区沙子口路654号' },
  { code: 'DEV008', name: '管道传感器E01', type: '传感器', area: '城阳区', platformId: '3', status: 'offline', statusText: '离线', lastOnline: '2024-01-14 18:30:45', description: '监测城阳区域管道温度', location: '城阳区正阳路321号' },
]);

// 模态框状态
const showDetailModal = ref(false);
const showEditModal = ref(false);
const showAddModal = ref(false);
const showStatsModal = ref(false);

// 选中的设备
const selectedDevice = ref<any>(null);

// 编辑表单
const editForm = ref({
  code: '',
  name: '',
  type: '',
  area: '',
  platformId: '',
  description: '',
  location: ''
});

// 新增表单
const addForm = ref({
  code: '',
  name: '',
  type: '监测站',
  area: '',
  platformId: '',
  description: '',
  location: ''
});

// 统计详情
const statsModalTitle = ref('');
const statsModalContent = ref('');
const currentStatsType = ref('');

// 平台筛选
const selectedPlatform = ref('');

// 用户角色和平台信息
const userInfo = ref<any>(null);
const platformInfo = ref<any>(null);

// 计算属性：用户角色
const isPlatformAdmin = computed(() => {
  return localStorage.getItem('userRole') === 'platform';
});

// 计算属性：当前平台名称
const currentPlatformName = computed(() => {
  if (!platformInfo.value) return '';
  const platform = platforms.value.find(p => p.id === platformInfo.value.id);
  return platform?.name || '';
});

// 计算属性：过滤后的设备列表
const filteredDeviceList = computed(() => {
  if (isPlatformAdmin.value) {
    // 平台管理员可以根据选择的平台筛选
    if (selectedPlatform.value) {
      return deviceList.value.filter(device => device.platformId === selectedPlatform.value);
    }
    return deviceList.value;
  } else {
    // 超级管理员只能看到当前平台的设备
    if (platformInfo.value) {
      return deviceList.value.filter(device => device.platformId === platformInfo.value.id);
    }
    return [];
  }
});

// 计算属性：设备统计
const totalDevices = computed(() => {
  return filteredDeviceList.value.length;
});

const onlineDevices = computed(() => {
  return filteredDeviceList.value.filter(device => device.status === 'online').length;
});

const offlineDevices = computed(() => {
  return filteredDeviceList.value.filter(device => device.status === 'offline').length;
});

const warningDevices = computed(() => {
  return filteredDeviceList.value.filter(device => device.status === 'warning').length;
});

// 过滤后的设备列表（用于统计详情）
const filteredDevices = computed(() => {
  if (!currentStatsType.value) return [];
  
  let devices = filteredDeviceList.value;
  
  if (currentStatsType.value !== 'total') {
    devices = devices.filter(device => device.status === currentStatsType.value);
  }
  
  return devices;
});

// 获取平台名称
const getPlatformName = (platformId: string) => {
  const platform = platforms.value.find(p => p.id === platformId);
  return platform?.name || '';
};

// 过滤设备
const filterDevices = () => {
  // 筛选逻辑已在computed属性中处理
};

// 显示设备详情
const showDeviceDetail = (device: any) => {
  selectedDevice.value = device;
  showDetailModal.value = true;
};

// 关闭详情模态框
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedDevice.value = null;
};

// 显示编辑模态框
const showEditDeviceModal = (device: any) => {
  selectedDevice.value = device;
  editForm.value = {
    code: device.code,
    name: device.name,
    type: device.type,
    area: device.area,
    platformId: device.platformId,
    description: device.description || '',
    location: device.location || ''
  };
  showEditModal.value = true;
};

// 关闭编辑模态框
const closeEditModal = () => {
  showEditModal.value = false;
  selectedDevice.value = null;
  resetEditForm();
};

// 重置编辑表单
const resetEditForm = () => {
  editForm.value = {
    code: '',
    name: '',
    type: '',
    area: '',
    platformId: '',
    description: '',
    location: ''
  };
};

// 保存设备
const saveDevice = () => {
  const index = deviceList.value.findIndex(device => device.code === editForm.value.code);
  if (index !== -1) {
    deviceList.value[index] = {
      ...deviceList.value[index],
      name: editForm.value.name,
      type: editForm.value.type,
      area: editForm.value.area,
      platformId: editForm.value.platformId,
      description: editForm.value.description,
      location: editForm.value.location
    };
  }
  closeEditModal();
  alert('设备信息已更新');
};

// 显示新增设备模态框
const showAddDeviceModal = () => {
  // 如果是超级管理员，默认设置为当前平台
  if (!isPlatformAdmin.value && platformInfo.value) {
    addForm.value.platformId = platformInfo.value.id;
  }
  showAddModal.value = true;
};

// 关闭新增设备模态框
const closeAddModal = () => {
  showAddModal.value = false;
  resetAddForm();
};

// 重置新增表单
const resetAddForm = () => {
  addForm.value = {
    code: '',
    name: '',
    type: '监测站',
    area: '',
    platformId: '',
    description: '',
    location: ''
  };
};

// 添加设备
const addDevice = () => {
  if (!addForm.value.code || !addForm.value.name) {
    alert('请填写设备编号和名称');
    return;
  }
  
  // 对于超级管理员，自动使用当前平台ID
  let platformId = addForm.value.platformId;
  if (!isPlatformAdmin.value && platformInfo.value) {
    platformId = platformInfo.value.id;
  }
  
  if (!platformId) {
    alert('请选择设备所属平台');
    return;
  }
  
  const newDevice = {
    code: addForm.value.code,
    name: addForm.value.name,
    type: addForm.value.type,
    area: addForm.value.area,
    platformId: platformId,
    status: 'offline',
    statusText: '离线',
    lastOnline: '暂无',
    description: addForm.value.description,
    location: addForm.value.location
  };
  
  deviceList.value.push(newDevice);
  closeAddModal();
  alert('设备已添加');
};

// 显示统计详情
const showStatsDetail = (type: string) => {
  currentStatsType.value = type;
  
  switch (type) {
    case 'total':
      statsModalTitle.value = '设备总数详情';
      statsModalContent.value = `当前系统共有 ${filteredDeviceList.value.length} 台设备，分布在不同区域，包括监测站、传感器和控制阀等多种类型。`;
      break;
    case 'online':
      const onlineCount = filteredDeviceList.value.filter(d => d.status === 'online').length;
      statsModalTitle.value = '在线设备详情';
      statsModalContent.value = `当前有 ${onlineCount} 台设备在线运行，运行状态良好。`;
      break;
    case 'offline':
      const offlineCount = filteredDeviceList.value.filter(d => d.status === 'offline').length;
      statsModalTitle.value = '离线设备详情';
      statsModalContent.value = `当前有 ${offlineCount} 台设备处于离线状态，需要检查设备连接情况。`;
      break;
    case 'warning':
      const warningCount = filteredDeviceList.value.filter(d => d.status === 'warning').length;
      statsModalTitle.value = '告警设备详情';
      statsModalContent.value = `当前有 ${warningCount} 台设备处于告警状态，需要及时处理。`;
      break;
  }
  
  showStatsModal.value = true;
};

// 关闭统计详情模态框
const closeStatsModal = () => {
  showStatsModal.value = false;
  currentStatsType.value = '';
};

// 初始化数据
const initDeviceData = () => {
  // 从localStorage获取平台信息
  const platformInfoStr = localStorage.getItem('platformInfo');
  
  if (platformInfoStr) {
    try {
      platformInfo.value = JSON.parse(platformInfoStr);
    } catch (error) {
      console.error('解析平台信息失败:', error);
    }
  }
};

// 初始化数据
onMounted(() => {
  initDeviceData();
});

export {
  // 状态
  platforms,
  deviceList,
  showDetailModal,
  showEditModal,
  showAddModal,
  showStatsModal,
  selectedDevice,
  editForm,
  addForm,
  statsModalTitle,
  statsModalContent,
  currentStatsType,
  selectedPlatform,
  userInfo,
  platformInfo,
  
  // 计算属性
  isPlatformAdmin,
  currentPlatformName,
  filteredDeviceList,
  totalDevices,
  onlineDevices,
  offlineDevices,
  warningDevices,
  filteredDevices,
  
  // 方法
  getPlatformName,
  filterDevices,
  showDeviceDetail,
  closeDetailModal,
  showEditDeviceModal,
  closeEditModal,
  resetEditForm,
  saveDevice,
  showAddDeviceModal,
  closeAddModal,
  resetAddForm,
  addDevice,
  showStatsDetail,
  closeStatsModal,
  initDeviceData
};
