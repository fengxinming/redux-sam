const es6Flag = '__esModule';

/**
 * 安全获取es6模块
 * @param {*} mod require方式获取的模块
 */
export function getSafeModule(mod) {
  return mod[es6Flag] ? (mod.default || mod) : mod;
}

/**
 * 遍历模块集合
 * @param {Function} requireContext
 * @param {Function} callback
 */
export function eachModule(requireContext, callback) {
  requireContext.keys().forEach(key => callback(getSafeModule(requireContext(key)), key));
}
