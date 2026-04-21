/**
 * 时间格式化工具函数
 */

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式化字符串
 * @returns 格式化后的时间字符串
 */
export const formatDateTime = (date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
export const formatDate = (date: Date | number | string): string => {
  return formatDateTime(date, 'YYYY-MM-DD');
};

/**
 * 格式化时间
 * @param date 日期对象或时间戳
 * @returns 格式化后的时间字符串 (HH:mm:ss)
 */
export const formatTime = (date: Date | number | string): string => {
  return formatDateTime(date, 'HH:mm:ss');
};

/**
 * 格式化本地日期时间
 * @param date 日期对象或时间戳
 * @returns 本地格式化的日期时间字符串
 */
export const formatLocalDateTime = (date: Date | number | string): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
};

/**
 * 格式化本地日期
 * @param date 日期对象或时间戳
 * @returns 本地格式化的日期字符串
 */
export const formatLocalDate = (date: Date | number | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
};

/**
 * 格式化本地时间
 * @param date 日期对象或时间戳
 * @returns 本地格式化的时间字符串
 */
export const formatLocalTime = (date: Date | number | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('zh-CN');
};

/**
 * 获取相对时间
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串
 */
export const getRelativeTime = (date: Date | number | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    return formatDate(past);
  }
};

/**
 * 判断是否是今天
 * @param date 日期对象或时间戳
 * @returns 是否是今天
 */
export const isToday = (date: Date | number | string): boolean => {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

/**
 * 判断是否是昨天
 * @param date 日期对象或时间戳
 * @returns 是否是昨天
 */
export const isYesterday = (date: Date | number | string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
};

/**
 * 获取时间差
 * @param start 开始时间
 * @param end 结束时间
 * @returns 时间差对象
 */
export const getTimeDiff = (start: Date | number | string, end: Date | number | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.abs(endDate.getTime() - startDate.getTime());
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return { days, hours, minutes, seconds };
};

/**
 * 格式化时间差
 * @param start 开始时间
 * @param end 结束时间
 * @returns 格式化后的时间差字符串
 */
export const formatTimeDiff = (start: Date | number | string, end: Date | number | string): string => {
  const { days, hours, minutes, seconds } = getTimeDiff(start, end);
  const parts = [];
  
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}秒`);
  
  return parts.join(' ');
};

/**
 * 获取当月第一天
 * @returns 当月第一天的日期对象
 */
export const getFirstDayOfMonth = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * 获取当月最后一天
 * @returns 当月最后一天的日期对象
 */
export const getLastDayOfMonth = (): Date => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * 获取本周第一天（周一）
 * @returns 本周第一天的日期对象
 */
export const getFirstDayOfWeek = (): Date => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

/**
 * 获取本周最后一天（周日）
 * @returns 本周最后一天的日期对象
 */
export const getLastDayOfWeek = (): Date => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() + (7 - day);
  return new Date(date.setDate(diff));
};