/**
 * 嵌入字体加载器
 * 从 DOCX 文件中加载嵌入字体，支持字体解密和 CSS @font-face 注入
 */

import JSZip from 'jszip'
import {
  IFontTable,
  IFontDeclaration,
  IEmbedFontRef,
  ILoadedEmbedFont,
  IRelationship,
  TEmbedFontType,
  RELATIONSHIP_TYPES,
} from '../types'

/**
 * 嵌入字体加载器配置
 */
export interface IFontLoaderOptions {
  /** 是否自动注入 CSS @font-face */
  injectStyles?: boolean
  /** 自定义样式容器（默认为 document.head） */
  styleContainer?: HTMLElement
  /** 字体加载超时时间（毫秒） */
  timeout?: number
}

const DEFAULT_OPTIONS: IFontLoaderOptions = {
  injectStyles: true,
  timeout: 10000,
}

/**
 * 加载嵌入字体
 * @param zip DOCX 文件的 JSZip 实例
 * @param fontTable 字体表
 * @param fontRels fontTable.xml 的关系文件内容（可选）
 * @param options 配置选项
 * @returns 已加载的嵌入字体数组
 */
export async function loadEmbeddedFonts(
  zip: JSZip,
  fontTable: IFontTable,
  fontRels: IRelationship[],
  options: IFontLoaderOptions = {}
): Promise<ILoadedEmbedFont[]> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const loadedFonts: ILoadedEmbedFont[] = []
  
  // 遍历所有有嵌入字体的字体声明
  for (const font of fontTable.fonts) {
    if (font.embedFontRefs.length === 0) continue
    
    for (const embedRef of font.embedFontRefs) {
      try {
        const loadedFont = await loadSingleEmbeddedFont(
          zip,
          font,
          embedRef,
          fontRels,
          opts.timeout || DEFAULT_OPTIONS.timeout!
        )
        
        if (loadedFont) {
          loadedFonts.push(loadedFont)
        }
      } catch (e) {
        console.warn(`加载嵌入字体失败: ${font.name} (${embedRef.type})`, e)
      }
    }
  }
  
  // 注入 CSS @font-face
  if (opts.injectStyles && loadedFonts.length > 0) {
    injectFontFaceStyles(loadedFonts, opts.styleContainer)
  }
  
  return loadedFonts
}

/**
 * 加载单个嵌入字体
 */
async function loadSingleEmbeddedFont(
  zip: JSZip,
  font: IFontDeclaration,
  embedRef: IEmbedFontRef,
  fontRels: IRelationship[],
  timeout: number
): Promise<ILoadedEmbedFont | null> {
  // 根据关系 ID 查找字体文件路径
  const rel = fontRels.find(r => r.id === embedRef.id)
  if (!rel) {
    console.warn(`找不到嵌入字体关系: ${embedRef.id}`)
    return null
  }
  
  // 构建字体文件路径
  const fontPath = `word/${rel.target}`
  const fontFile = zip.file(fontPath)
  
  if (!fontFile) {
    console.warn(`找不到嵌入字体文件: ${fontPath}`)
    return null
  }
  
  // 读取字体文件
  const fontData = await Promise.race([
    fontFile.async('arraybuffer'),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('字体加载超时')), timeout)
    ),
  ])
  
  // 如果有密钥，需要解密字体
  let decryptedData = fontData
  if (embedRef.key) {
    decryptedData = decryptEmbeddedFont(fontData, embedRef.key)
  }
  
  // 检测字体格式
  const format = detectFontFormat(new Uint8Array(decryptedData))
  
  // 转换为 Data URL
  const mimeType = getFontMimeType(format)
  const blob = new Blob([decryptedData], { type: mimeType })
  const dataUrl = await blobToDataUrl(blob)
  
  return {
    fontName: font.name,
    type: embedRef.type,
    dataUrl,
    format,
  }
}

/**
 * 解密嵌入字体
 * OOXML 嵌入字体使用 XOR 加密，密钥为 32 位 GUID
 * @param data 加密的字体数据
 * @param keyString 密钥字符串（格式：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}）
 * @returns 解密后的字体数据
 */
function decryptEmbeddedFont(data: ArrayBuffer, keyString: string): ArrayBuffer {
  // 解析密钥 GUID（移除花括号和连字符）
  const keyHex = keyString.replace(/[{}-]/g, '')
  if (keyHex.length !== 32) {
    console.warn('无效的字体密钥格式:', keyString)
    return data
  }
  
  // 将 GUID 转换为 16 字节密钥数组
  // 注意：GUID 的字节顺序需要特殊处理
  const key = new Uint8Array(16)
  
  // 前三组需要反转字节顺序（小端序）
  // 第一组：8 个字符 = 4 字节，反转
  for (let i = 0; i < 4; i++) {
    key[3 - i] = parseInt(keyHex.substr(i * 2, 2), 16)
  }
  // 第二组：4 个字符 = 2 字节，反转
  for (let i = 0; i < 2; i++) {
    key[5 - i] = parseInt(keyHex.substr(8 + i * 2, 2), 16)
  }
  // 第三组：4 个字符 = 2 字节，反转
  for (let i = 0; i < 2; i++) {
    key[7 - i] = parseInt(keyHex.substr(12 + i * 2, 2), 16)
  }
  // 后两组保持原顺序
  for (let i = 0; i < 8; i++) {
    key[8 + i] = parseInt(keyHex.substr(16 + i * 2, 2), 16)
  }
  
  // XOR 解密：每 16 字节与密钥进行 XOR
  const input = new Uint8Array(data)
  const output = new Uint8Array(input.length)
  
  // 只解密前 32 字节（OOXML 规范）
  const decryptLength = Math.min(32, input.length)
  
  for (let i = 0; i < decryptLength; i++) {
    output[i] = input[i] ^ key[i % 16]
  }
  
  // 剩余部分保持不变
  for (let i = decryptLength; i < input.length; i++) {
    output[i] = input[i]
  }
  
  return output.buffer
}

/**
 * 检测字体格式
 */
function detectFontFormat(data: Uint8Array): 'opentype' | 'truetype' | 'embedded-opentype' {
  if (data.length < 4) {
    return 'truetype'
  }
  
  // OpenType (CFF) 签名: 'OTTO'
  if (data[0] === 0x4F && data[1] === 0x54 && data[2] === 0x54 && data[3] === 0x4F) {
    return 'opentype'
  }
  
  // TrueType 签名: 0x00010000 或 'true'
  if ((data[0] === 0x00 && data[1] === 0x01 && data[2] === 0x00 && data[3] === 0x00) ||
      (data[0] === 0x74 && data[1] === 0x72 && data[2] === 0x75 && data[3] === 0x65)) {
    return 'truetype'
  }
  
  // EOT 签名
  if (data[0] === 0x00 && data[1] === 0x00 && data[2] === 0x01) {
    return 'embedded-opentype'
  }
  
  // 默认假设为 TrueType
  return 'truetype'
}

/**
 * 获取字体 MIME 类型
 */
function getFontMimeType(format: string): string {
  switch (format) {
    case 'opentype':
      return 'font/otf'
    case 'truetype':
      return 'font/ttf'
    case 'embedded-opentype':
      return 'application/vnd.ms-fontobject'
    default:
      return 'font/ttf'
  }
}

/**
 * Blob 转 Data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * 注入 CSS @font-face 样式
 */
function injectFontFaceStyles(
  fonts: ILoadedEmbedFont[],
  container?: HTMLElement
): void {
  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-docx-fonts', 'true')
  
  const cssRules = fonts.map(font => buildFontFaceRule(font)).join('\n')
  styleEl.textContent = cssRules
  
  const target = container || document.head
  
  // 移除旧的字体样式
  const oldStyle = target.querySelector('style[data-docx-fonts]')
  if (oldStyle) {
    oldStyle.remove()
  }
  
  target.appendChild(styleEl)
}

/**
 * 构建单个 @font-face 规则
 */
function buildFontFaceRule(font: ILoadedEmbedFont): string {
  const fontWeight = getFontWeight(font.type)
  const fontStyle = getFontStyle(font.type)
  const format = getFontFormatString(font.format)
  
  return `@font-face {
  font-family: "${escapeFontName(font.fontName)}";
  src: url("${font.dataUrl}") format("${format}");
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  font-display: swap;
}`
}

/**
 * 获取字体粗细
 */
function getFontWeight(type: TEmbedFontType): string {
  switch (type) {
    case 'bold':
    case 'boldItalic':
      return '700'
    default:
      return '400'
  }
}

/**
 * 获取字体样式
 */
function getFontStyle(type: TEmbedFontType): string {
  switch (type) {
    case 'italic':
    case 'boldItalic':
      return 'italic'
    default:
      return 'normal'
  }
}

/**
 * 获取 CSS font format 字符串
 */
function getFontFormatString(format: string): string {
  switch (format) {
    case 'opentype':
      return 'opentype'
    case 'truetype':
      return 'truetype'
    case 'embedded-opentype':
      return 'embedded-opentype'
    default:
      return 'truetype'
  }
}

/**
 * 转义字体名称中的特殊字符
 */
function escapeFontName(name: string): string {
  return name.replace(/"/g, '\\"')
}

/**
 * 清理已注入的字体样式
 * @param container 样式容器（默认为 document.head）
 */
export function cleanupFontStyles(container?: HTMLElement): void {
  const target = container || document.head
  const oldStyle = target.querySelector('style[data-docx-fonts]')
  if (oldStyle) {
    oldStyle.remove()
  }
}

/**
 * 解析 fontTable.xml.rels 文件获取字体关系
 */
export function parseFontRelationships(xmlContent: string): IRelationship[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlContent, 'application/xml')
  const root = doc.documentElement
  
  const relationships: IRelationship[] = []
  const relElements = root.getElementsByTagName('Relationship')
  
  for (let i = 0; i < relElements.length; i++) {
    const el = relElements[i]
    const type = el.getAttribute('Type') || ''
    
    // 只处理字体类型的关系
    if (type === RELATIONSHIP_TYPES.FONT) {
      relationships.push({
        id: el.getAttribute('Id') || '',
        type,
        target: el.getAttribute('Target') || '',
        targetMode: el.getAttribute('TargetMode') || undefined,
      })
    }
  }
  
  return relationships
}
