// 维修记录类型定义
export interface RepairRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  platformId: string;
  platformName: string;
  repairDate: string;
  repairType: string; // 维修类型：维护、故障修复、更换零件等
  description: string; // 维修描述
  partsReplaced: string[]; // 更换的零件
  repairCost: number; // 维修费用
  technician: string; // 维修人员
  status: 'completed' | 'pending' | 'in_progress'; // 维修状态
  createdAt: string;
  updatedAt: string;
}

// 维修记录表单类型
export interface RepairForm {
  deviceId: string;
  repairType: string;
  description: string;
  partsReplaced: string[];
  repairCost: number;
  technician: string;
  status: 'completed' | 'pending' | 'in_progress';
}
