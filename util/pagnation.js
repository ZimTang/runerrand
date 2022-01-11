/**
 * 
 * @param {Number} page 分页页码 
 * @param {Number} pageSize 单页数量
 * @param {Array} array 数组
 * @returns 
 */
module.exports =  function pagination(page, pageSize, array) {
  const offset = (page - 1) * pageSize;
  return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
} 