import Mock from 'mockjs';
import type { Platform, User, Role, Page, Device, Sensor } from '../types';
import type { RepairRecord } from '../types/repair';

const Random = Mock.Random;

// 模拟平台数据
const generatePlatforms = (): Platform[] => {
  const count = Math.floor(Math.random() * 3) + 3; // 3-5个平台
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const platforms: Platform[] = [];
  for (let i = 0; i < count; i++) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const name = '平台' + letter;
    platforms.push({
      id: String(i + 1),
      name: name,
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      statusText: Math.random() > 0.5 ? '启用' : '禁用',
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      expiryTime: '2026-12-31 23:59:59',
      hashCode: 'PLATFORM_' + name.toUpperCase() + '_20261231_' + (i + 1),
      systemName: name + '热力管网系统'
    });
  }
  return platforms;
};

export const mockPlatforms: Platform[] = generatePlatforms();

// 模拟用户数据
const generateUsers = (): User[] => {
  const count = Math.floor(Math.random() * 5) + 4; // 4-8个用户
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const roleId = i === 0 ? '1' : (Math.random() > 0.5 ? '1' : '2');
    const platformId = String(Math.floor(Math.random() * 3) + 1);
    users.push({
      username: (roleId === '1' ? 'admin' : 'user') + platformId + i,
      roleId: roleId,
      roleName: roleId === '1' ? '超级管理员' : '普通用户',
      platformId: platformId,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      statusText: Math.random() > 0.3 ? '启用' : '禁用',
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }
  return users;
};

export const mockUsers: User[] = generateUsers();

// 模拟角色数据
export const mockRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    permissions: ['page:home', 'page:device', 'page:account', 'device:add', 'device:edit', 'device:delete', 'user:add', 'user:edit', 'user:delete', 'role:add', 'role:edit', 'role:delete', 'page:add', 'page:edit', 'page:delete'],
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    name: '普通用户',
    permissions: ['page:home', 'page:device'],
    status: 'active',
    statusText: '启用',
    createdAt: '2024-01-01 09:30:00'
  }
];

// 模拟页面数据
export const mockPages: Page[] = [
  {
    id: '1',
    name: '首页',
    path: '/',
    functions: []
  },
  {
    id: '2',
    name: '设备管理',
    path: '/device',
    functions: [
      { id: '1', name: '查看设备', code: 'device:view' },
      { id: '2', name: '新增设备', code: 'device:add' },
      { id: '3', name: '编辑设备', code: 'device:edit' },
      { id: '4', name: '删除设备', code: 'device:delete' }
    ]
  },
  {
    id: '3',
    name: '账号管理',
    path: '/account',
    functions: [
      { id: '1', name: '查看用户', code: 'user:view' },
      { id: '2', name: '新增用户', code: 'user:add' },
      { id: '3', name: '编辑用户', code: 'user:edit' },
      { id: '4', name: '删除用户', code: 'user:delete' },
      { id: '5', name: '查看角色', code: 'role:view' },
      { id: '6', name: '新增角色', code: 'role:add' },
      { id: '7', name: '编辑角色', code: 'role:edit' },
      { id: '8', name: '删除角色', code: 'role:delete' },
      { id: '9', name: '查看平台', code: 'platform:view' },
      { id: '10', name: '新增平台', code: 'platform:add' },
      { id: '11', name: '编辑平台', code: 'platform:edit' },
      { id: '12', name: '禁用平台', code: 'platform:toggle' },
      { id: '13', name: '平台续约', code: 'platform:renew' }
    ]
  },
  {
    id: '4',
    name: '预警管理',
    path: '/warning',
    functions: [
      { id: '1', name: '查看预警', code: 'warning:view' },
      { id: '2', name: '处理预警', code: 'warning:handle' },
      { id: '3', name: '完成预警', code: 'warning:resolve' },
      { id: '4', name: '筛选预警', code: 'warning:filter' }
    ]
  },
  {
    id: '5',
    name: '维修记录',
    path: '/repair',
    functions: [
      { id: '1', name: '查看维修记录', code: 'repair:view' },
      { id: '2', name: '新增维修记录', code: 'repair:add' },
      { id: '3', name: '编辑维修记录', code: 'repair:edit' },
      { id: '4', name: '删除维修记录', code: 'repair:delete' }
    ]
  }
];

// 模拟设备数据
const deviceTypes = ['温度传感器', '压力传感器', '流量传感器', '液位传感器'];
const locations = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const statusList = ['online', 'offline', 'warning'];
const statusTextMap: Record<string, string> = { 'online': '在线', 'offline': '离线', 'warning': '告警' };

const generateDevices = (): Device[] => {
  const count = Math.floor(Math.random() * 11) + 10; // 10-20个设备
  const devices: Device[] = [];
  for (let i = 0; i < count; i++) {
    const platformId = String(Math.floor(Math.random() * 3) + 1);
    const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const status = statusList[Math.floor(Math.random() * statusList.length)];
    devices.push({
      id: String(i + 1),
      code: 'DEV-' + platformId + '-' + String(i + 1).padStart(3, '0'),
      name: type,
      type: type,
      platformId: platformId,
      platformName: '平台' + String.fromCharCode(64 + parseInt(platformId)),
      status: status,
      statusText: statusTextMap[status],
      location: '热力站' + locations[Math.floor(Math.random() * locations.length)],
      ip: Random.ip(),
      mac: Array.from({ length: 6 }, () => Random.string('0123456789abcdef', 2)).join(':'),
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }
  return devices;
};

export const mockDevices: Device[] = generateDevices();

// 模拟维修记录数据
const repairTypes = ['维护', '故障修复', '更换零件', '其他'];
const repairStatusList = ['completed', 'pending', 'in_progress'];
const technicianNames = ['张师傅', '李师傅', '王师傅', '赵师傅', '刘师傅'];
const descriptions = [
  '定期维护，检查传感器校准',
  '传感器离线，检查网络连接',
  '传感器探头损坏，更换新探头',
  '定期维护，清洁传感器',
  '传感器数据异常，重新校准',
  '更换传感器电池',
  '修复传感器通信模块',
  '清理传感器滤网'
];
const replaceableParts = ['网络模块', '温度探头', '压力传感器', '流量传感器', '电池', '通信模块', '滤网'];

const generateRepairRecords = (): RepairRecord[] => {
  const count = Math.floor(Math.random() * 11) + 20; // 20-30条记录
  const records: RepairRecord[] = [];
  for (let i = 0; i < count; i++) {
    const deviceId = String(Math.floor(Math.random() * mockDevices.length) + 1);
    const device = mockDevices.find(d => d.id === deviceId);
    const platformId = device ? device.platformId : '1';
    const repairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
    const status = repairStatusList[Math.floor(Math.random() * repairStatusList.length)];
    const partsReplaced = repairType === '更换零件'
      ? replaceableParts.slice(0, Math.floor(Math.random() * 3) + 1)
      : [];

    records.push({
      id: 'repair_' + String(i + 1),
      deviceId: deviceId,
      deviceName: device ? device.name : '传感器' + deviceId,
      platformId: platformId,
      platformName: device ? device.platformName : '平台' + String.fromCharCode(64 + parseInt(platformId)),
      repairDate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      repairType: repairType,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      partsReplaced: partsReplaced,
      repairCost: repairType === '维护' ? 0 : Math.floor(Math.random() * 451) + 50,
      technician: technicianNames[Math.floor(Math.random() * technicianNames.length)],
      status: status,
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    });
  }
  return records;
};

export const repairRecords: RepairRecord[] = generateRepairRecords();

// 传感器类型列表
const sensorTypeList = ['温度传感器', '压力传感器', '流量传感器'];
const sensorStatusList = ['online', 'offline', 'warning'];
const sensorStatusTextMap: Record<string, string> = { 'online': '在线', 'offline': '离线', 'warning': '告警' };
const sensorLocations = ['一次网供', '一次网回', '二次网供', '二次网回', '补水管道', '泄压管道'];

const generateSensors = (): Sensor[] => {
  const count = 8; // 固定8个传感器
  const sensors: Sensor[] = [];
  for (let i = 0; i < count; i++) {
    const platformId = String(Math.floor(i / 3) + 1);
    const type = sensorTypeList[i % sensorTypeList.length];
    const status = sensorStatusList[i % 3];
    sensors.push({
      id: String(i + 1),
      code: 'SENSOR-' + String(i + 1).padStart(3, '0'),
      name: type,
      type: type,
      platformId: platformId,
      platformName: '平台' + String.fromCharCode(64 + parseInt(platformId)),
      location: sensorLocations[i % sensorLocations.length],
      status: status,
      statusText: sensorStatusTextMap[status]
    });
  }
  return sensors;
};

export const mockSensors: Sensor[] = generateSensors();
