// 生成哈希码
export const generateHashCode = (name: string, expiryTime: string, platformId: string): string => {
  const expiryDate = new Date(expiryTime);
  const formattedExpiry = expiryDate.toISOString().slice(0, 10).replace(/-/g, '');
  return `${name.toUpperCase().replace(/\s+/g, '_')}_${formattedExpiry}_${platformId}`;
};

// 格式化日期时间
export const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('zh-CN');
};

// 计算最小到期时间（当前时间）
export const getMinExpiryTime = (): string => {
  return new Date().toISOString().slice(0, 16);
};

// 生成默认到期时间（当前日期的后一年）
export const getDefaultExpiryTime = (): string => {
  const defaultExpiryTime = new Date();
  defaultExpiryTime.setFullYear(defaultExpiryTime.getFullYear() + 1);
  return defaultExpiryTime.toISOString().slice(0, 16);
};

// 格式化到期时间为input[type="datetime-local"]可接受的格式
export const formatExpiryTime = (expiryTime: string): string => {
  return new Date(expiryTime).toISOString().slice(0, 16);
};
