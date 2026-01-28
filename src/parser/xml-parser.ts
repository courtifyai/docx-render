import { XML_NS } from '../types'

/**
 * XML 解析器
 * 提供 XML 元素遍历和属性读取的工具方法
 */
export class XmlParser {
  /**
   * 获取元素的所有子元素
   */
  elements(elem: Element, localName?: string): Element[] {
    const result: Element[] = []
    for (let i = 0; i < elem.childNodes.length; i++) {
      const child = elem.childNodes[i]
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!localName || (child as Element).localName === localName) {
          result.push(child as Element)
        }
      }
    }
    return result
  }

  /**
   * 获取第一个匹配的子元素
   */
  element(elem: Element, localName: string): Element | null {
    for (let i = 0; i < elem.childNodes.length; i++) {
      const child = elem.childNodes[i]
      if (child.nodeType === Node.ELEMENT_NODE && (child as Element).localName === localName) {
        return child as Element
      }
    }
    return null
  }

  /**
   * 获取元素属性值
   */
  attr(elem: Element | null | undefined, localName: string): string | undefined {
    if (!elem) return undefined
    
    // 尝试带命名空间的属性
    for (const ns of Object.values(XML_NS)) {
      const value = elem.getAttributeNS(ns, localName)
      if (value) return value
    }
    // 尝试带前缀的属性
    const prefixedValue = elem.getAttribute(`w:${localName}`)
    if (prefixedValue) return prefixedValue
    // 尝试无前缀属性
    return elem.getAttribute(localName) || undefined
  }

  /**
   * 获取布尔属性
   */
  boolAttr(elem: Element | null | undefined, localName: string, defaultValue = false): boolean {
    if (!elem) return defaultValue
    const val = this.attr(elem, localName)
    if (val === undefined) return defaultValue
    return val === '1' || val === 'true' || val === 'on'
  }

  /**
   * 获取整数属性
   */
  intAttr(elem: Element | null | undefined, localName: string): number | undefined {
    if (!elem) return undefined
    const val = this.attr(elem, localName)
    if (!val) return undefined
    return parseInt(val, 10)
  }

  /**
   * 获取长度属性并转换单位
   */
  lengthAttr(elem: Element | null | undefined, localName: string, usage: ILengthUsage = LengthUsage.Dxa): string | undefined {
    if (!elem) return undefined
    const val = this.attr(elem, localName)
    return this.convertLength(val, usage)
  }

  /**
   * 转换长度单位
   */
  convertLength(val: string | undefined, usage: ILengthUsage = LengthUsage.Dxa): string | undefined {
    if (!val) return undefined
    // 如果已经有单位，直接返回
    if (/[a-z%]+$/i.test(val)) return val
    
    const num = parseFloat(val) * usage.mul
    return `${num.toFixed(2)}${usage.unit}`
  }

  /**
   * 获取元素的文本内容
   */
  textContent(elem: Element | null | undefined): string {
    if (!elem) return ''
    return elem.textContent || ''
  }
}

/**
 * 长度单位转换配置
 */
export interface ILengthUsage {
  mul: number
  unit: string
}

export const LengthUsage = {
  /** 1/20 点 (twip) */
  Dxa: { mul: 0.05, unit: 'pt' },
  /** EMU (English Metric Unit) */
  Emu: { mul: 1 / 12700, unit: 'pt' },
  /** 半点 */
  FontSize: { mul: 0.5, unit: 'pt' },
  /** 1/8 点 */
  Border: { mul: 0.125, unit: 'pt' },
  /** 点 */
  Point: { mul: 1, unit: 'pt' },
  /** 百分比 (1/50) */
  Percent: { mul: 0.02, unit: '%' },
} as const

/**
 * 解析 XML 字符串
 */
export function parseXmlString(xmlString: string): Document {
  // 移除 BOM
  if (xmlString.charCodeAt(0) === 0xFEFF) {
    xmlString = xmlString.substring(1)
  }
  // 移除 XML 声明
  xmlString = xmlString.replace(/<\?xml[^?]*\?>/g, '')
  
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')
  
  // 检查解析错误
  const parseError = doc.getElementsByTagName('parsererror')[0]
  if (parseError) {
    throw new Error(`XML 解析错误: ${parseError.textContent}`)
  }
  
  return doc
}

// 全局 XML 解析器实例
export const xmlParser = new XmlParser()
