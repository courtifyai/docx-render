/**
 * DOCX Render
 * 自研 DOCX 渲染库，参考 docx-preview 架构
 * 支持文档和评论一体化渲染，评论连接线
 */

console.log('[docx-render] 模块开始加载...');

import { DocumentParser } from './parser'
console.log('[docx-render] DocumentParser 已导入');

import { DocumentRenderer } from './renderer'
console.log('[docx-render] DocumentRenderer 已导入');

import { IRendererOptions, IDocxDocument, ICommentElement } from './types'
console.log('[docx-render] types 已导入');

// 样式
console.log('[docx-render] 开始导入样式...');
import './styles/index.css'
console.log('[docx-render] 样式导入完成');

// 导出类型
export type {
  IDocxDocument,
  ICommentElement,
  ICommentExtended,
  IRendererOptions,
  IOpenXmlElement,
  IParagraphElement,
  IRunElement,
  IRunProperties,
  ITextElement,
  ITableElement,
  ITheme,
  IColorScheme,
  IFontScheme,
  IThemeColors,
  IThemeColorRef,
  IFootnoteElement,
  IEndnoteElement,
  IFootnoteReference,
  IEndnoteReference,
  // 书签类型
  IBookmarkStartElement,
  IBookmarkEndElement,
  // Symbol 元素
  ISymbolElement,
  // 字体表类型
  IFontTable,
  IFontDeclaration,
  IEmbedFontRef,
  IFontSignature,
  ILoadedEmbedFont,
  TEmbedFontType,
  // 下划线样式类型
  TUnderlineStyle,
} from './types'

// 导出常量
export { DomType, DOCX_PARTS, XML_NS } from './types'

// 导出解析器
export { DocumentParser } from './parser'

// 导出渲染器
export { DocumentRenderer } from './renderer'

// 导出主题工具
export { parseTheme, resolveThemeColor, applyTintShade, resolveThemeFont } from './theme'

// 导出字体表工具
export {
  parseFontTable,
  getSubstituteFontName,
  getFontDeclaration,
  hasEmbeddedFont,
  getEmbedFontRefs,
  buildFontFamily,
  loadEmbeddedFonts,
  cleanupFontStyles,
} from './font-table'

// 导出评论工具
export { parseCommentsExtended, buildCommentTree } from './comments'

/**
 * DOCX 渲染器类
 * 整合解析器和渲染器，提供完整的渲染能力
 */
export class DocxRender {
  private parser: DocumentParser
  private renderer: DocumentRenderer
  private document: IDocxDocument | null = null

  constructor(options: IRendererOptions) {
    console.log('[docx-render] DocxRender 构造函数被调用');
    this.parser = new DocumentParser()
    this.renderer = new DocumentRenderer(options)
  }

  /**
   * 渲染 DOCX 文件
   */
  async render(file: File | ArrayBuffer | Blob): Promise<void> {
    console.log('[docx-render] DocxRender.render() 开始');
    this.document = await this.parser.parse(file)
    console.log('[docx-render] 文档解析完成，开始渲染');
    this.renderer.render(this.document)
    console.log('[docx-render] DocxRender.render() 完成');
  }

  /**
   * 获取文档对象
   */
  getDocument(): IDocxDocument | null {
    return this.document
  }

  /**
   * 获取所有评论
   */
  getComments(): ICommentElement[] {
    return this.document?.comments || []
  }

  /**
   * 获取解析器（用于保存修改）
   */
  getParser(): DocumentParser {
    return this.parser
  }
}

/**
 * 便捷方法：快速渲染 DOCX 文件
 */
export async function renderDocx(
  file: File | ArrayBuffer | Blob,
  container: HTMLElement | string,
  options?: Partial<IRendererOptions>
): Promise<DocxRender> {
  console.log('[docx-render] renderDocx() 被调用');
  const render = new DocxRender({
    container,
    ...options,
  })
  
  await render.render(file)
  return render
}

console.log('[docx-render] 模块加载完成!');
