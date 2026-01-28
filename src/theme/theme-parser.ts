/**
 * 主题解析器
 * 解析 DOCX 主题 XML（word/theme/theme1.xml）
 */

import { ITheme, IColorScheme, IFontScheme, IFontInfo, IThemeColors } from '../types'

/**
 * 解析主题 XML
 */
export function parseTheme(root: Element): ITheme {
  const theme: ITheme = {
    colorScheme: { name: '', colors: {} },
    fontScheme: { name: '', majorFont: {}, minorFont: {} },
  }
  
  // 查找 a:themeElements
  const themeElements = findElement(root, 'themeElements')
  if (!themeElements) return theme
  
  // 遍历主题元素
  for (const el of getChildElements(themeElements)) {
    const localName = el.localName
    
    if (localName === 'clrScheme') {
      theme.colorScheme = parseColorScheme(el)
    } else if (localName === 'fontScheme') {
      theme.fontScheme = parseFontScheme(el)
    }
  }
  
  return theme
}

/**
 * 解析颜色方案
 * <a:clrScheme name="Office">
 *   <a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
 *   <a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
 *   <a:accent1><a:srgbClr val="4472C4"/></a:accent1>
 *   ...
 * </a:clrScheme>
 */
export function parseColorScheme(el: Element): IColorScheme {
  const result: IColorScheme = {
    name: el.getAttribute('name') || '',
    colors: {},
  }
  
  // 遍历每个颜色定义
  for (const colorEl of getChildElements(el)) {
    const colorName = colorEl.localName
    const colorValue = extractColorValue(colorEl)
    
    if (colorValue) {
      result.colors[colorName as keyof IThemeColors] = colorValue
    }
  }
  
  return result
}

/**
 * 提取颜色值
 * 支持 srgbClr 和 sysClr 两种格式
 */
function extractColorValue(colorEl: Element): string | null {
  // 尝试 srgbClr
  const srgbClr = findElement(colorEl, 'srgbClr')
  if (srgbClr) {
    const val = srgbClr.getAttribute('val')
    return val ? `#${val}` : null
  }
  
  // 尝试 sysClr（系统颜色，取 lastClr 属性）
  const sysClr = findElement(colorEl, 'sysClr')
  if (sysClr) {
    const lastClr = sysClr.getAttribute('lastClr')
    return lastClr ? `#${lastClr}` : null
  }
  
  return null
}

/**
 * 解析字体方案
 * <a:fontScheme name="Office">
 *   <a:majorFont>
 *     <a:latin typeface="Calibri Light"/>
 *     <a:ea typeface=""/>
 *     <a:cs typeface=""/>
 *   </a:majorFont>
 *   <a:minorFont>
 *     <a:latin typeface="Calibri"/>
 *     <a:ea typeface=""/>
 *     <a:cs typeface=""/>
 *   </a:minorFont>
 * </a:fontScheme>
 */
export function parseFontScheme(el: Element): IFontScheme {
  const result: IFontScheme = {
    name: el.getAttribute('name') || '',
    majorFont: {},
    minorFont: {},
  }
  
  for (const fontEl of getChildElements(el)) {
    const localName = fontEl.localName
    
    if (localName === 'majorFont') {
      result.majorFont = parseFontInfo(fontEl)
    } else if (localName === 'minorFont') {
      result.minorFont = parseFontInfo(fontEl)
    }
  }
  
  return result
}

/**
 * 解析字体信息
 */
function parseFontInfo(el: Element): IFontInfo {
  const result: IFontInfo = {}
  
  for (const child of getChildElements(el)) {
    const localName = child.localName
    const typeface = child.getAttribute('typeface')
    
    if (typeface) {
      if (localName === 'latin') {
        result.latin = typeface
      } else if (localName === 'ea') {
        result.ea = typeface
      } else if (localName === 'cs') {
        result.cs = typeface
      }
    }
  }
  
  return result
}

/**
 * 查找子元素（忽略命名空间）
 */
function findElement(parent: Element, localName: string): Element | null {
  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i]
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (el.localName === localName) {
        return el
      }
    }
  }
  return null
}

/**
 * 获取所有子元素
 */
function getChildElements(parent: Element): Element[] {
  const result: Element[] = []
  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i]
    if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(node as Element)
    }
  }
  return result
}
