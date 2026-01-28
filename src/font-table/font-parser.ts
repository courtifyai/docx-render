/**
 * 字体表解析器
 * 解析 word/fontTable.xml，提取字体声明、嵌入字体引用和字体替换映射
 */

import { xmlParser, parseXmlString } from '../parser/xml-parser'
import {
  IFontTable,
  IFontDeclaration,
  IEmbedFontRef,
  IFontSignature,
  TEmbedFontType,
} from '../types'

/**
 * 嵌入字体元素名到类型的映射
 */
const EMBED_FONT_TYPE_MAP: Record<string, TEmbedFontType> = {
  embedRegular: 'regular',
  embedBold: 'bold',
  embedItalic: 'italic',
  embedBoldItalic: 'boldItalic',
}

/**
 * 解析字体表 XML
 * @param xmlContent fontTable.xml 的内容
 * @returns 字体表对象
 */
export function parseFontTable(xmlContent: string): IFontTable {
  const doc = parseXmlString(xmlContent)
  const root = doc.documentElement
  
  const fonts = parseFonts(root)
  const fontMap = new Map(fonts.map(f => [f.name, f]))
  const substitutionMap = buildSubstitutionMap(fonts)
  
  return {
    fonts,
    fontMap,
    substitutionMap,
  }
}

/**
 * 解析所有字体声明
 */
function parseFonts(root: Element): IFontDeclaration[] {
  return xmlParser.elements(root, 'font').map(el => parseFont(el))
}

/**
 * 解析单个字体声明
 */
function parseFont(elem: Element): IFontDeclaration {
  const result: IFontDeclaration = {
    name: xmlParser.attr(elem, 'name') || '',
    embedFontRefs: [],
  }
  
  for (const el of xmlParser.elements(elem)) {
    switch (el.localName) {
      case 'family':
        result.family = xmlParser.attr(el, 'val')
        break
        
      case 'altName':
        result.altName = xmlParser.attr(el, 'val')
        break
        
      case 'charset':
        result.charset = xmlParser.attr(el, 'val')
        break
        
      case 'panose1':
        result.panose1 = xmlParser.attr(el, 'val')
        break
        
      case 'sig':
        result.sig = parseFontSignature(el)
        break
        
      case 'embedRegular':
      case 'embedBold':
      case 'embedItalic':
      case 'embedBoldItalic':
        const embedRef = parseEmbedFontRef(el)
        if (embedRef) {
          result.embedFontRefs.push(embedRef)
        }
        break
    }
  }
  
  return result
}

/**
 * 解析字体签名
 */
function parseFontSignature(elem: Element): IFontSignature {
  return {
    usb0: xmlParser.attr(elem, 'usb0'),
    usb1: xmlParser.attr(elem, 'usb1'),
    usb2: xmlParser.attr(elem, 'usb2'),
    usb3: xmlParser.attr(elem, 'usb3'),
    csb0: xmlParser.attr(elem, 'csb0'),
    csb1: xmlParser.attr(elem, 'csb1'),
  }
}

/**
 * 解析嵌入字体引用
 */
function parseEmbedFontRef(elem: Element): IEmbedFontRef | null {
  const id = xmlParser.attr(elem, 'id')
  if (!id) return null
  
  const type = EMBED_FONT_TYPE_MAP[elem.localName]
  if (!type) return null
  
  return {
    id,
    key: xmlParser.attr(elem, 'fontKey'),
    subsetted: xmlParser.boolAttr(elem, 'subsetted'),
    type,
  }
}

/**
 * 构建字体替换映射
 * 从字体声明中提取 altName，建立原字体名到替代字体名的映射
 */
function buildSubstitutionMap(fonts: IFontDeclaration[]): Map<string, string> {
  const map = new Map<string, string>()
  
  for (const font of fonts) {
    if (font.altName) {
      map.set(font.name, font.altName)
    }
  }
  
  return map
}

/**
 * 获取字体的替代字体名
 * @param fontTable 字体表
 * @param fontName 原字体名
 * @returns 替代字体名，如果没有替代则返回原字体名
 */
export function getSubstituteFontName(fontTable: IFontTable, fontName: string): string {
  return fontTable.substitutionMap.get(fontName) || fontName
}

/**
 * 获取字体声明
 * @param fontTable 字体表
 * @param fontName 字体名
 * @returns 字体声明，如果不存在则返回 undefined
 */
export function getFontDeclaration(fontTable: IFontTable, fontName: string): IFontDeclaration | undefined {
  return fontTable.fontMap.get(fontName)
}

/**
 * 检查字体是否有嵌入字体
 * @param fontTable 字体表
 * @param fontName 字体名
 * @returns 是否有嵌入字体
 */
export function hasEmbeddedFont(fontTable: IFontTable, fontName: string): boolean {
  const font = fontTable.fontMap.get(fontName)
  return font ? font.embedFontRefs.length > 0 : false
}

/**
 * 获取字体的嵌入字体引用
 * @param fontTable 字体表
 * @param fontName 字体名
 * @param type 字体类型（可选，不指定则返回所有类型）
 * @returns 嵌入字体引用数组
 */
export function getEmbedFontRefs(
  fontTable: IFontTable,
  fontName: string,
  type?: TEmbedFontType
): IEmbedFontRef[] {
  const font = fontTable.fontMap.get(fontName)
  if (!font) return []
  
  if (type) {
    return font.embedFontRefs.filter(ref => ref.type === type)
  }
  
  return font.embedFontRefs
}

/**
 * 生成 CSS font-family 字符串
 * 根据字体声明生成包含替代字体的 font-family
 * @param fontTable 字体表
 * @param fontName 字体名
 * @returns CSS font-family 字符串
 */
export function buildFontFamily(fontTable: IFontTable, fontName: string): string {
  const fonts: string[] = []
  const font = fontTable.fontMap.get(fontName)
  
  // 添加原字体名
  fonts.push(quoteFontName(fontName))
  
  // 添加替代字体
  if (font?.altName) {
    fonts.push(quoteFontName(font.altName))
  }
  
  // 根据字体家族添加通用字体
  if (font?.family) {
    const genericFont = getGenericFontFamily(font.family)
    if (genericFont) {
      fonts.push(genericFont)
    }
  }
  
  return fonts.join(', ')
}

/**
 * 为字体名添加引号（如果需要）
 */
function quoteFontName(name: string): string {
  // 如果字体名包含空格或特殊字符，需要加引号
  if (/[\s,'"()]/.test(name)) {
    return `"${name.replace(/"/g, '\\"')}"`
  }
  return name
}

/**
 * 根据 OOXML 字体家族获取 CSS 通用字体家族
 */
function getGenericFontFamily(family: string): string | null {
  switch (family.toLowerCase()) {
    case 'roman':
      return 'serif'
    case 'swiss':
      return 'sans-serif'
    case 'modern':
      return 'monospace'
    case 'script':
      return 'cursive'
    case 'decorative':
      return 'fantasy'
    default:
      return null
  }
}
