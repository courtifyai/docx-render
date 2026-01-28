/**
 * 主题模块
 * 解析 DOCX 主题文件（word/theme/theme1.xml）
 * 支持主题颜色和字体方案解析
 */

export { parseTheme, parseColorScheme, parseFontScheme } from './theme-parser'
export { resolveThemeColor, applyTintShade, resolveThemeFont } from './theme-utils'
