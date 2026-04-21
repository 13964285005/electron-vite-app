import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { Platform, Device } from '../types';
import { mockPlatforms, mockDevices } from '../mock';

const useDeviceStore = () => {

// 模拟平台数据
const platforms = ref<Platform[]>([...mockPlatforms]);

// 模拟设备数据
const deviceList = ref<Device[]>([...mockDevices]);

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
    const platform = platforms.value.find(p => p.id === editForm.value.platformId);
    deviceList.value[index] = {
      ...deviceList.value[index],
      name: editForm.value.name,
      type: editForm.value.type,
      platformId: editForm.value.platformId,
      platformName: platform?.name || deviceList.value[index].platformName,
      location: editForm.value.location
    };
  }
  closeEditModal();
  ElMessage({
    message: '设备信息已更新',
    type: 'success',
    duration: 3000
  });
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
    ElMessage({
      message: '请填写设备编号和名称',
      type: 'warning',
      duration: 3000
    });
    return;
  }
  
  // 自动使用用户所属平台ID
  let platformId = '';
  if (platformInfo.value) {
    platformId = platformInfo.value.id;
  } else if (isPlatformAdmin.value) {
    // 平台管理员默认使用第一个平台（或其他逻辑）
    if (platforms.value.length > 0) {
      platformId = platforms.value[0].id;
    }
  }
  
  // 如果仍无法获取平台ID，使用默认值
  if (!platformId) {
    platformId = '1'; // 使用默认平台ID
  }
  
  const platform = platforms.value.find(p => p.id === platformId);
  
  const newDevice = {
    id: String(deviceList.value.length + 1),
    code: addForm.value.code,
    name: addForm.value.name,
    type: addForm.value.type,
    platformId: platformId,
    platformName: platform?.name || '平台1',
    status: 'offline',
    statusText: '离线',
    location: addForm.value.location,
    ip: '',
    mac: '',
    createdAt: new Date().toISOString()
  };
  
  deviceList.value.push(newDevice);
  closeAddModal();
  ElMessage({
    message: '设备已添加',
    type: 'success',
    duration: 3000
  });
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
  } else {
    // 如果没有平台信息，尝试从userRole和platformId获取
    const userRole = localStorage.getItem('userRole');
    const platformId = localStorage.getItem('platformId');
    
    if (userRole === 'admin' && platformId) {
      // 超级管理员，获取平台信息
      const platform = platforms.value.find(p => p.id === platformId);
      if (platform) {
        platformInfo.value = platform;
      }
    }
  }
};

// 初始化数据
onMounted(() => {
  initDeviceData();
  
  // 监听localStorage变化，当用户角色或平台信息变化时重新初始化数据
  window.addEventListener('storage', handleStorageChange);
});

// 处理storage变化
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'userRole' || event.key === 'platformId' || event.key === 'platformInfo') {
    initDeviceData();
  }
};

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

// 加载设备数据
const loadDevices = () => {
  // 实际应用中应该从 API 获取数据
  deviceList.value = [...mockDevices];
  initDeviceData();
};

return {
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
  initDeviceData,
  loadDevices
};
};

export default useDeviceStore;
