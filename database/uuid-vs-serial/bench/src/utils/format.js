/**
 * 格式化工具函數
 */

/**
 * 將數字格式化為帶千分位的字串
 * @param {number} num - 要格式化的數字
 * @returns {string} 格式化後的字串
 */
export const formatNumber = (num) => {
  // 處理 null、undefined 或非數字值
  if (num == null || isNaN(num)) {
    return "0";
  }
  return new Intl.NumberFormat().format(Number(num));
};

/**
 * 將位元組大小格式化為易讀的字串
 * @param {number} bytes - 位元組數
 * @returns {string} 格式化後的大小字串（如 "1.25 MB"）
 */
export const formatSize = (bytes) => {
  // 處理 null、undefined 或非數字值
  if (bytes == null || isNaN(bytes) || bytes < 0) {
    return "0.00 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = Number(bytes);
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * 延遲執行
 * @param {number} ms - 延遲毫秒數
 * @returns {Promise<void>} 延遲完成後解析的 Promise
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
