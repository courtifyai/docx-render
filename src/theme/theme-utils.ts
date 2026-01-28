/**
 * 主题颜色工具函数
 * 提供主题颜色解析和转换能力
 */

import { ITheme, IThemeColorRef, IThemeColors } from '../types'

/**
 * 主题颜色名称到标准名称的映射
 * Word 使用的属性名和 theme.xml 中的元素名可能不同
 */
const THEME_COLOR_MAP: Record<string, keyof IThemeColors> = {
  // 标准映射
  dark1: 'dk1',
  dark2: 'dk2',
  light1: 'lt1',
  light2: 'lt2',
  accent1: 'accent1',
  accent2: 'accent2',
  accent3: 'accent3',
  accent4: 'accent4',
  accent5: 'accent5',
  accent6: 'accent6',
  hyperlink: 'hlink',
  followedHyperlink: 'folHlink',
  // 直接映射（XML 中的原始名称）
  dk1: 'dk1',
  dk2: 'dk2',
  lt1: 'lt1',
  lt2: 'lt2',
  hlink: 'hlink',
  folHlink: 'folHlink',
  // 文本颜色别名
  text1: 'dk1',
  text2: 'dk2',
  background1: 'lt1',
  background2: 'lt2',
}

/**
 * 解析主题颜色引用，返回实际颜色值
 * 
 * @param theme - 主题对象
 * @param colorRef - 主题颜色引用
 * @returns 解析后的颜色值（如 #RRGGBB）或 undefined
 */
export function resolveThemeColor(
  theme: ITheme | undefined,
  colorRef: IThemeColorRef
): string | undefined {
  if (!theme?.colorScheme?.colors) return undefined
  
  const themeColorName = colorRef.themeColor
  const mappedName = THEME_COLOR_MAP[themeColorName] || themeColorName
  const baseColor = theme.colorScheme.colors[mappedName]
  
  if (!baseColor) return undefined
  
  // 如果有 tint 或 shade，需要调整颜色
  if (colorRef.themeTint !== undefined || colorRef.themeShade !== undefined) {
    return applyTintShade(baseColor, colorRef.themeTint, colorRef.themeShade)
  }
  
  return baseColor
}

/**
 * 应用色调（tint）和阴影（shade）调整
 * 
 * tint: 向白色混合（0 = 原色，255 = 纯白）
 * shade: 向黑色混合（0 = 原色，255 = 纯黑）
 * 
 * @param color - 基础颜色（#RRGGBB 格式）
 * @param tint - 色调值（0-255）
 * @param shade - 阴影值（0-255）
 * @returns 调整后的颜色
 */
export function applyTintShade(
  color: string,
  tint?: number,
  shade?: number
): string {
  // 解析颜色
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  let finalR = r
  let finalG = g
  let finalB = b
  
  // 应用 tint（向白色混合）
  // OOXML 规范: result = color + (255 - color) * tint / 255
  if (tint !== undefined && tint > 0) {
    const tintFactor = tint / 255
    finalR = Math.round(r + (255 - r) * tintFactor)
    finalG = Math.round(g + (255 - g) * tintFactor)
    finalB = Math.round(b + (255 - b) * tintFactor)
  }
  
  // 应用 shade（向黑色混合）
  // OOXML 规范: result = color * (1 - shade / 255)
  if (shade !== undefined && shade > 0) {
    const shadeFactor = 1 - shade / 255
    finalR = Math.round(finalR * shadeFactor)
    finalG = Math.round(finalG * shadeFactor)
    finalB = Math.round(finalB * shadeFactor)
  }
  
  // 确保在有效范围内
  finalR = Math.max(0, Math.min(255, finalR))
  finalG = Math.max(0, Math.min(255, finalG))
  finalB = Math.max(0, Math.min(255, finalB))
  
  // 转回 hex
  return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`
}

/**
 * 数字转两位十六进制
 */
function toHex(n: number): string {
  const hex = n.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

/**
 * 获取主题字体
 * 
 * @param theme - 主题对象
 * @param fontType - 字体类型（major/minor）
 * @param script - 文字类型（latin/ea/cs）
 * @returns 字体名称或 undefined
 */
export function resolveThemeFont(
  theme: ITheme | undefined,
  fontType: 'major' | 'minor',
  script: 'latin' | 'ea' | 'cs' = 'latin'
): string | undefined {
  if (!theme?.fontScheme) return undefined
  
  const fontInfo = fontType === 'major' 
    ? theme.fontScheme.majorFont 
    : theme.fontScheme.minorFont
  
  return fontInfo[script]
}
