/**
 * Format bytes into human-readable format (KB, MB, GB, etc.)
 * @param {number} bytes - The number of bytes to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted string with appropriate unit
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (bytes === null || bytes === undefined) return 'N/A';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  // Calculate the appropriate unit
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format row counts into human-readable format (K for thousands, M for millions, etc.)
 * @param {number} count - The number of rows to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted string with appropriate unit
 */
export function formatRowCount(count, decimals = 1) {
  if (count === 0) return '0';
  if (count === null || count === undefined) return 'N/A';
  
  // For numbers less than 1000, just return the number
  if (Math.abs(count) < 1000) {
    return count.toString();
  }
  
  const dm = decimals < 0 ? 0 : decimals;
  
  // For thousands
  if (Math.abs(count) < 1000000) {
    return parseFloat((count / 1000).toFixed(dm)) + 'K';
  }
  
  // For millions
  if (Math.abs(count) < 1000000000) {
    return parseFloat((count / 1000000).toFixed(dm)) + 'M';
  }
  
  // For billions
  if (Math.abs(count) < 1000000000000) {
    return parseFloat((count / 1000000000).toFixed(dm)) + 'B';
  }
  
  // For trillions and above (just in case someone has a really big table)
  return parseFloat((count / 1000000000000).toFixed(dm)) + 'T';
} 