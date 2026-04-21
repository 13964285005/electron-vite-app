import { ref, computed } from 'vue'
import type { RepairRecord, RepairForm } from '../types/repair'
import { repairRecords as mockRepairRecords } from '../mock/index'

// 维修记录store
const useRepairStore = () => {
  // 维修记录列表
  const repairRecords = ref<RepairRecord[]>(mockRepairRecords)
  
  // 加载状态
  const loading = ref(false)
  
  // 按平台ID获取维修记录
  const getRepairsByPlatform = (platformId: string) => {
    return repairRecords.value.filter(record => record.platformId === platformId)
  }
  
  // 按设备ID获取维修记录
  const getRepairsByDevice = (deviceId: string) => {
    return repairRecords.value.filter(record => record.deviceId === deviceId)
  }
  
  // 获取单个维修记录
  const getRepairById = (id: string) => {
    return repairRecords.value.find(record => record.id === id)
  }
  
  // 添加维修记录
  const addRepair = (form: RepairForm, deviceName: string, platformId: string, platformName: string) => {
    const newRepair: RepairRecord = {
      id: `repair_${Date.now()}`,
      deviceId: form.deviceId,
      deviceName,
      platformId,
      platformName,
      repairDate: new Date().toISOString(),
      repairType: form.repairType,
      description: form.description,
      partsReplaced: form.partsReplaced,
      repairCost: form.repairCost,
      technician: form.technician,
      status: form.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    repairRecords.value.unshift(newRepair)
    return newRepair
  }
  
  // 更新维修记录
  const updateRepair = (id: string, form: Partial<RepairForm>) => {
    const index = repairRecords.value.findIndex(record => record.id === id)
    if (index !== -1) {
      repairRecords.value[index] = {
        ...repairRecords.value[index],
        ...form,
        updatedAt: new Date().toISOString()
      }
      return repairRecords.value[index]
    }
    return null
  }
  
  // 删除维修记录
  const deleteRepair = (id: string) => {
    const index = repairRecords.value.findIndex(record => record.id === id)
    if (index !== -1) {
      repairRecords.value.splice(index, 1)
      return true
    }
    return false
  }
  
  // 加载维修记录
  const loadRepairs = () => {
    loading.value = true
    // 模拟异步加载
    setTimeout(() => {
      repairRecords.value = mockRepairRecords
      loading.value = false
    }, 300)
  }
  
  return {
    repairRecords,
    loading,
    getRepairsByPlatform,
    getRepairsByDevice,
    getRepairById,
    addRepair,
    updateRepair,
    deleteRepair,
    loadRepairs
  }
}

export default useRepairStore
