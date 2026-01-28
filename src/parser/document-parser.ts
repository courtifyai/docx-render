import JSZip from 'jszip'
import {
  DomType,
  IDocxDocument,
  IDocumentElement,
  IOpenXmlElement,
  IParagraphElement,
  IRunElement,
  ITextElement,
  IBreakElement,
  ITableElement,
  ITableRowElement,
  ITableCellElement,
  ITableProperties,
  ITableCellProperties,
  ICommentElement,
  ICommentExtended,
  ICommentRangeStart,
  ICommentRangeEnd,
  ICommentReference,
  IHyperlinkElement,
  IImageElement,
  IDrawingElement,
  IStyleDefinition,
  IRelationship,
  IParagraphProperties,
  IRunProperties,
  ISectionProperties,
  IPageSize,
  IPageMargins,
  IColumns,
  IHeaderElement,
  IFooterElement,
  ITabElement,
  ISymbolElement,
  IBorders,
  IBorder,
  ISimpleFieldElement,
  IComplexFieldElement,
  IFieldInstructionElement,
  INumberingDefinition,
  INumberingLevel,
  IAbstractNumbering,
  IParagraphNumbering,
  ITheme,
  IFootnoteElement,
  IEndnoteElement,
  IFootnoteReference,
  IEndnoteReference,
  IBookmarkStartElement,
  IBookmarkEndElement,
  IFontTable,
  ILoadedEmbedFont,
  DOCX_PARTS,
  RELATIONSHIP_TYPES,
} from '../types'
import { xmlParser, parseXmlString, LengthUsage } from './xml-parser'
import { parseTheme, resolveThemeColor } from '../theme'
import { parseFontTable, loadEmbeddedFonts, parseFontRelationships } from '../font-table'
import { parseCommentsExtended, buildCommentTree } from '../comments'

/**
 * DOCX 文档解析器
 * 解析 DOCX 文件，生成可渲染的文档模型
 */
export class DocumentParser {
  private zip: JSZip | null = null
  private relationships: IRelationship[] = []
  private images: Map<string, string> = new Map()
  private theme: ITheme | undefined = undefined
  private fontTable: IFontTable | undefined = undefined
  private embeddedFonts: ILoadedEmbedFont[] = []
  private bookmarks: Map<string, IBookmarkStartElement> = new Map()

  /**
   * 解析 DOCX 文件
   */
  async parse(file: File | ArrayBuffer | Blob): Promise<IDocxDocument> {
    const arrayBuffer = file instanceof ArrayBuffer 
      ? file 
      : await (file as Blob).arrayBuffer()
    
    this.zip = await JSZip.loadAsync(arrayBuffer)
    
    // 重置书签 Map
    this.bookmarks = new Map()
    
    // 解析关系
    await this.parseRelationships()
    
    // 加载图片资源
    await this.loadImages()
    
    // 解析样式
    const styles = await this.parseStyles()
    const styleMap = new Map(styles.map(s => [s.id, s]))
    
    // 解析评论
    const comments = await this.parseComments()
    const commentMap = new Map(comments.map(c => [c.id, c]))
    
    // 解析扩展评论（回复链）
    const commentsExtendedMap = await this.parseCommentsExtended()
    
    // 构建评论回复链
    const rootComments = buildCommentTree(comments, commentsExtendedMap)
    
    // 解析编号
    const { numberings, abstractNumberings, numberingMap } = await this.parseNumberings()
    
    // 解析主题
    this.theme = await this.parseTheme()
    
    // 解析页眉
    const headers = await this.parseHeadersFooters('header') as Map<string, IHeaderElement>
    
    // 解析页脚
    const footers = await this.parseHeadersFooters('footer') as Map<string, IFooterElement>
    
    // 解析脚注
    const footnotes = await this.parseFootnotes()
    
    // 解析尾注
    const endnotes = await this.parseEndnotes()
    
    // 解析字体表
    this.fontTable = await this.parseFontTable()
    
    // 加载嵌入字体
    this.embeddedFonts = await this.loadEmbeddedFonts()
    
    // 解析文档主体（书签会在解析过程中被收集）
    const body = await this.parseDocument()
    
    return {
      body,
      comments,
      commentMap,
      rootComments,
      commentsExtendedMap,
      styles,
      styleMap,
      numberings,
      numberingMap,
      abstractNumberings,
      images: this.images,
      relationships: this.relationships,
      headers,
      footers,
      theme: this.theme,
      footnotes,
      endnotes,
      fontTable: this.fontTable,
      embeddedFonts: this.embeddedFonts,
      bookmarks: this.bookmarks,
    }
  }

  /**
   * 获取 ZIP 实例
   */
  getZip(): JSZip | null {
    return this.zip
  }

  /**
   * 解析关系文件
   */
  private async parseRelationships(): Promise<void> {
    const content = await this.zip?.file(DOCX_PARTS.RELS)?.async('string')
    if (!content) return

    const doc = parseXmlString(content)
    const root = doc.documentElement
    
    this.relationships = xmlParser.elements(root, 'Relationship').map(el => ({
      id: xmlParser.attr(el, 'Id') || '',
      type: xmlParser.attr(el, 'Type') || '',
      target: xmlParser.attr(el, 'Target') || '',
      targetMode: xmlParser.attr(el, 'TargetMode'),
    }))
  }

  /**
   * 加载图片资源
   */
  private async loadImages(): Promise<void> {
    for (const rel of this.relationships) {
      if (rel.type === RELATIONSHIP_TYPES.IMAGE) {
        const imagePath = `word/${rel.target}`
        const imageFile = this.zip?.file(imagePath)
        if (imageFile) {
          const blob = await imageFile.async('blob')
          const base64 = await this.blobToBase64(blob)
          this.images.set(rel.id, base64)
        }
      }
    }
  }

  /**
   * Blob 转 Base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * 解析样式
   */
  private async parseStyles(): Promise<IStyleDefinition[]> {
    const content = await this.zip?.file(DOCX_PARTS.STYLES)?.async('string')
    if (!content) return []

    const doc = parseXmlString(content)
    const styles: IStyleDefinition[] = []
    
    const styleElements = doc.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'style'
    )
    
    for (let i = 0; i < styleElements.length; i++) {
      const el = styleElements[i]
      const nameEl = xmlParser.element(el, 'name')
      const basedOnEl = xmlParser.element(el, 'basedOn')
      
      const style: IStyleDefinition = {
        id: xmlParser.attr(el, 'styleId') || '',
        name: nameEl ? xmlParser.attr(nameEl, 'val') : undefined,
        type: (xmlParser.attr(el, 'type') as IStyleDefinition['type']) || 'paragraph',
        basedOn: basedOnEl ? xmlParser.attr(basedOnEl, 'val') : undefined,
      }
      
      // 解析段落属性
      const pPr = xmlParser.element(el, 'pPr')
      if (pPr) {
        style.paragraphProps = this.parseParagraphProperties(pPr)
      }
      
      // 解析文本属性
      const rPr = xmlParser.element(el, 'rPr')
      if (rPr) {
        style.runProps = this.parseRunProperties(rPr)
      }
      
      styles.push(style)
    }
    
    return styles
  }

  /**
   * 解析主题（word/theme/theme1.xml）
   */
  private async parseTheme(): Promise<ITheme | undefined> {
    const content = await this.zip?.file(DOCX_PARTS.THEME)?.async('string')
    if (!content) return undefined

    try {
      const doc = parseXmlString(content)
      return parseTheme(doc.documentElement)
    } catch (e) {
      console.warn('主题解析失败:', e)
      return undefined
    }
  }

  /**
   * 解析字体表（word/fontTable.xml）
   */
  private async parseFontTable(): Promise<IFontTable | undefined> {
    const content = await this.zip?.file(DOCX_PARTS.FONT_TABLE)?.async('string')
    if (!content) return undefined

    try {
      return parseFontTable(content)
    } catch (e) {
      console.warn('字体表解析失败:', e)
      return undefined
    }
  }

  /**
   * 加载嵌入字体
   */
  private async loadEmbeddedFonts(): Promise<ILoadedEmbedFont[]> {
    if (!this.fontTable || !this.zip) return []

    // 检查是否有嵌入字体
    const hasEmbedded = this.fontTable.fonts.some(f => f.embedFontRefs.length > 0)
    if (!hasEmbedded) return []

    try {
      // 解析字体表的关系文件
      const relsContent = await this.zip.file(DOCX_PARTS.FONT_TABLE_RELS)?.async('string')
      if (!relsContent) {
        console.warn('找不到字体表关系文件')
        return []
      }

      const fontRels = parseFontRelationships(relsContent)
      
      // 加载嵌入字体
      return await loadEmbeddedFonts(this.zip, this.fontTable, fontRels, {
        injectStyles: true,
      })
    } catch (e) {
      console.warn('嵌入字体加载失败:', e)
      return []
    }
  }

  /**
   * 解析脚注（word/footnotes.xml）
   */
  private async parseFootnotes(): Promise<Map<string, IFootnoteElement>> {
    const content = await this.zip?.file(DOCX_PARTS.FOOTNOTES)?.async('string')
    if (!content) return new Map()

    try {
      const doc = parseXmlString(content)
      return this.parseNotes<IFootnoteElement>(doc.documentElement, 'footnote', DomType.Footnote)
    } catch (e) {
      console.warn('脚注解析失败:', e)
      return new Map()
    }
  }

  /**
   * 解析尾注（word/endnotes.xml）
   */
  private async parseEndnotes(): Promise<Map<string, IEndnoteElement>> {
    const content = await this.zip?.file(DOCX_PARTS.ENDNOTES)?.async('string')
    if (!content) return new Map()

    try {
      const doc = parseXmlString(content)
      return this.parseNotes<IEndnoteElement>(doc.documentElement, 'endnote', DomType.Endnote)
    } catch (e) {
      console.warn('尾注解析失败:', e)
      return new Map()
    }
  }

  /**
   * 解析注释（脚注/尾注通用）
   */
  private parseNotes<T extends IFootnoteElement | IEndnoteElement>(
    root: Element,
    elemName: string,
    domType: DomType
  ): Map<string, T> {
    const result = new Map<string, T>()
    
    const noteElements = root.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      elemName
    )
    
    for (let i = 0; i < noteElements.length; i++) {
      const el = noteElements[i]
      const id = xmlParser.attr(el, 'id') || ''
      const noteType = xmlParser.attr(el, 'type')
      
      // 跳过分隔符类型的注释（separator, continuationSeparator）
      if (noteType === 'separator' || noteType === 'continuationSeparator') {
        continue
      }
      
      const note = {
        type: domType,
        id,
        noteType,
        children: this.parseChildren(el),
      } as T
      
      result.set(id, note)
    }
    
    return result
  }

  /**
   * 解析编号（word/numbering.xml）
   */
  private async parseNumberings(): Promise<{
    numberings: INumberingDefinition[]
    abstractNumberings: IAbstractNumbering[]
    numberingMap: Map<string, INumberingDefinition>
  }> {
    const content = await this.zip?.file(DOCX_PARTS.NUMBERING)?.async('string')
    if (!content) {
      return {
        numberings: [],
        abstractNumberings: [],
        numberingMap: new Map(),
      }
    }

    const doc = parseXmlString(content)
    const root = doc.documentElement
    
    // 存储抽象编号定义
    const abstractNumberings: IAbstractNumbering[] = []
    // 存储编号实例到抽象编号的映射
    const numToAbstractMap: Map<string, string> = new Map()
    
    // 第一遍：解析所有 abstractNum 和 num
    for (const el of xmlParser.elements(root)) {
      switch (el.localName) {
        case 'abstractNum':
          abstractNumberings.push(this.parseAbstractNumbering(el))
          break
        case 'num':
          const numId = xmlParser.attr(el, 'numId') || ''
          const abstractNumIdEl = xmlParser.element(el, 'abstractNumId')
          if (abstractNumIdEl) {
            const abstractNumId = xmlParser.attr(abstractNumIdEl, 'val') || ''
            numToAbstractMap.set(numId, abstractNumId)
          }
          break
      }
    }
    
    // 第二遍：根据映射生成最终的 numberings
    const numberings: INumberingDefinition[] = []
    const numberingMap = new Map<string, INumberingDefinition>()
    
    for (const [numId, abstractNumId] of numToAbstractMap) {
      const abstractNum = abstractNumberings.find(a => a.id === abstractNumId)
      if (abstractNum) {
        const numbering: INumberingDefinition = {
          id: numId,
          abstractNumId: abstractNumId,
          levels: abstractNum.levels.map(level => ({ ...level })),
        }
        numberings.push(numbering)
        numberingMap.set(numId, numbering)
      }
    }
    
    return { numberings, abstractNumberings, numberingMap }
  }

  /**
   * 解析抽象编号定义
   */
  private parseAbstractNumbering(el: Element): IAbstractNumbering {
    const result: IAbstractNumbering = {
      id: xmlParser.attr(el, 'abstractNumId') || '',
      levels: [],
    }
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'name':
          result.name = xmlParser.attr(child, 'val')
          break
        case 'multiLevelType':
          result.multiLevelType = xmlParser.attr(child, 'val')
          break
        case 'numStyleLink':
          result.numberingStyleLink = xmlParser.attr(child, 'val')
          break
        case 'styleLink':
          result.styleLink = xmlParser.attr(child, 'val')
          break
        case 'lvl':
          result.levels.push(this.parseNumberingLevel(child))
          break
      }
    }
    
    return result
  }

  /**
   * 解析编号级别
   */
  private parseNumberingLevel(el: Element): INumberingLevel {
    const result: INumberingLevel = {
      level: xmlParser.intAttr(el, 'ilvl') ?? 0,
      format: 'decimal',
      text: '',
      start: 1,
      suffix: 'tab',
    }
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'start':
          result.start = xmlParser.intAttr(child, 'val') ?? 1
          break
        case 'numFmt':
          result.format = xmlParser.attr(child, 'val') || 'decimal'
          break
        case 'lvlText':
          result.text = xmlParser.attr(child, 'val') || ''
          break
        case 'suff':
          result.suffix = xmlParser.attr(child, 'val') || 'tab'
          break
        case 'pStyle':
          result.pStyleName = xmlParser.attr(child, 'val')
          break
        case 'pPr':
          result.paragraphProps = this.parseParagraphProperties(child)
          break
        case 'rPr':
          result.runProps = this.parseRunProperties(child)
          break
      }
    }
    
    return result
  }

  /**
   * 解析评论
   */
  private async parseComments(): Promise<ICommentElement[]> {
    const content = await this.zip?.file(DOCX_PARTS.COMMENTS)?.async('string')
    if (!content) return []

    const doc = parseXmlString(content)
    const comments: ICommentElement[] = []
    
    const commentElements = doc.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'comment'
    )
    
    // Word 2010 命名空间（用于 paraId）
    const W14_NS = 'http://schemas.microsoft.com/office/word/2010/wordml'
    
    for (let i = 0; i < commentElements.length; i++) {
      const el = commentElements[i]
      
      // 获取评论的原始文本内容（作为备用）
      const rawText = el.textContent?.trim() || ''
      
      // 获取 paraId（w14:paraId 属性）
      // paraId 用于关联 commentsExtended.xml 中的回复链信息
      let paraId = el.getAttributeNS(W14_NS, 'paraId')
      if (!paraId) {
        // 尝试不带命名空间获取
        paraId = el.getAttribute('w14:paraId') || null
      }
      
      const comment: ICommentElement = {
        type: DomType.Comment,
        id: xmlParser.attr(el, 'id') || '',
        author: xmlParser.attr(el, 'author') || '未知',
        date: xmlParser.attr(el, 'date') || new Date().toISOString(),
        initials: xmlParser.attr(el, 'initials'),
        children: this.parseChildren(el),
        rawText,
        paraId: paraId || undefined,
      }
      comments.push(comment)
    }
    
    console.log('[DEBUG] parseComments: found', comments.length, 'comments')
    
    return comments
  }

  /**
   * 解析扩展评论（word/commentsExtended.xml）
   * 包含评论的父子关系信息
   */
  private async parseCommentsExtended(): Promise<Map<string, ICommentExtended>> {
    const content = await this.zip?.file(DOCX_PARTS.COMMENTS_EXTENDED)?.async('string')
    if (!content) {
      console.log('[DEBUG] commentsExtended.xml not found')
      return new Map()
    }

    console.log('[DEBUG] commentsExtended.xml found, length:', content.length)
    return parseCommentsExtended(content)
  }

  /**
   * 解析文档主体
   */
  private async parseDocument(): Promise<IDocumentElement> {
    const content = await this.zip?.file(DOCX_PARTS.DOCUMENT)?.async('string')
    if (!content) {
      return { type: DomType.Document, children: [] }
    }

    const doc = parseXmlString(content)
    const bodyEl = doc.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'body'
    )[0]
    
    if (!bodyEl) {
      return { type: DomType.Document, children: [] }
    }
    
    // 解析文档级别的 sectPr（默认 Section 属性）
    const sectPrEl = xmlParser.element(bodyEl, 'sectPr')
    const sectionProps = sectPrEl ? this.parseSectionProperties(sectPrEl) : undefined
    
    // 解析背景
    const documentEl = doc.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'document'
    )[0]
    const backgroundEl = documentEl ? xmlParser.element(documentEl, 'background') : null
    const background = backgroundEl ? this.parseBackground(backgroundEl) : undefined
    
    return {
      type: DomType.Document,
      children: this.parseChildren(bodyEl),
      sectionProps,
      background,
    }
  }

  /**
   * 解析页眉页脚
   */
  private async parseHeadersFooters(type: 'header' | 'footer'): Promise<Map<string, IHeaderElement | IFooterElement>> {
    const result = new Map<string, IHeaderElement | IFooterElement>()
    const relType = type === 'header' ? RELATIONSHIP_TYPES.HEADER : RELATIONSHIP_TYPES.FOOTER
    
    for (const rel of this.relationships) {
      if (rel.type === relType) {
        const path = `word/${rel.target}`
        const content = await this.zip?.file(path)?.async('string')
        
        if (content) {
          const doc = parseXmlString(content)
          const rootEl = doc.getElementsByTagNameNS(
            'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            type === 'header' ? 'hdr' : 'ftr'
          )[0]
          
          if (rootEl) {
            const element: IHeaderElement | IFooterElement = {
              type: type === 'header' ? DomType.Header : DomType.Footer,
              children: this.parseChildren(rootEl),
            }
            result.set(rel.id, element)
          }
        }
      }
    }
    
    return result
  }

  /**
   * 解析背景
   */
  private parseBackground(el: Element): Record<string, string> {
    const style: Record<string, string> = {}
    
    const color = xmlParser.attr(el, 'color')
    if (color && color !== 'auto') {
      style['background-color'] = `#${color}`
    }
    
    return style
  }

  /**
   * 解析 Section 属性
   */
  private parseSectionProperties(el: Element): ISectionProperties {
    const props: ISectionProperties = {}
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'pgSz':
          props.pageSize = this.parsePageSize(child)
          break
        case 'pgMar':
          props.pageMargins = this.parsePageMargins(child)
          break
        case 'type':
          props.type = xmlParser.attr(child, 'val') || 'nextPage'
          break
        case 'cols':
          props.columns = this.parseColumns(child)
          break
        case 'pgBorders':
          props.pageBorders = this.parseBorders(child)
          break
        case 'pgNumType':
          props.pageNumber = {
            start: xmlParser.intAttr(child, 'start'),
            format: xmlParser.attr(child, 'fmt'),
            chapSep: xmlParser.attr(child, 'chapSep'),
            chapStyle: xmlParser.attr(child, 'chapStyle'),
          }
          break
        case 'headerReference':
          if (!props.headerRefs) props.headerRefs = []
          props.headerRefs.push({
            id: xmlParser.attr(child, 'id') || '',
            type: (xmlParser.attr(child, 'type') || 'default') as 'default' | 'first' | 'even',
          })
          break
        case 'footerReference':
          if (!props.footerRefs) props.footerRefs = []
          props.footerRefs.push({
            id: xmlParser.attr(child, 'id') || '',
            type: (xmlParser.attr(child, 'type') || 'default') as 'default' | 'first' | 'even',
          })
          break
        case 'titlePg':
          props.titlePage = xmlParser.boolAttr(child, 'val') !== false
          break
      }
    }
    
    return props
  }

  /**
   * 解析页面尺寸
   */
  private parsePageSize(el: Element): IPageSize {
    return {
      width: xmlParser.lengthAttr(el, 'w'),
      height: xmlParser.lengthAttr(el, 'h'),
      orientation: xmlParser.attr(el, 'orient') as 'portrait' | 'landscape' | undefined,
    }
  }

  /**
   * 解析页边距
   */
  private parsePageMargins(el: Element): IPageMargins {
    return {
      top: xmlParser.lengthAttr(el, 'top'),
      right: xmlParser.lengthAttr(el, 'right'),
      bottom: xmlParser.lengthAttr(el, 'bottom'),
      left: xmlParser.lengthAttr(el, 'left'),
      header: xmlParser.lengthAttr(el, 'header'),
      footer: xmlParser.lengthAttr(el, 'footer'),
      gutter: xmlParser.lengthAttr(el, 'gutter'),
    }
  }

  /**
   * 解析分栏
   */
  private parseColumns(el: Element): IColumns {
    const columns: IColumns = {
      numberOfColumns: xmlParser.intAttr(el, 'num'),
      space: xmlParser.lengthAttr(el, 'space'),
      separator: xmlParser.boolAttr(el, 'sep'),
      equalWidth: xmlParser.boolAttr(el, 'equalWidth') !== false,
      columns: [],
    }
    
    for (const child of xmlParser.elements(el, 'col')) {
      columns.columns!.push({
        width: xmlParser.lengthAttr(child, 'w'),
        space: xmlParser.lengthAttr(child, 'space'),
      })
    }
    
    return columns
  }

  /**
   * 解析边框
   */
  private parseBorders(el: Element): IBorders {
    const borders: IBorders = {}
    
    for (const child of xmlParser.elements(el)) {
      const border = this.parseBorder(child)
      switch (child.localName) {
        case 'top':
          borders.top = border
          break
        case 'bottom':
          borders.bottom = border
          break
        case 'left':
        case 'start':
          borders.left = border
          break
        case 'right':
        case 'end':
          borders.right = border
          break
      }
    }
    
    return borders
  }

  /**
   * 解析单个边框
   */
  private parseBorder(el: Element): IBorder {
    const color = xmlParser.attr(el, 'color')
    return {
      style: xmlParser.attr(el, 'val'),
      width: xmlParser.lengthAttr(el, 'sz', LengthUsage.Border),
      color: color && color !== 'auto' ? `#${color}` : undefined,
    }
  }

  /**
   * 解析子元素
   */
  private parseChildren(parent: Element, debug = false): IOpenXmlElement[] {
    const children: IOpenXmlElement[] = []
    
    for (const el of xmlParser.elements(parent)) {
      const child = this.parseElement(el)
      if (child) {
        children.push(child)
      }
    }
    
    if (debug && children.length === 0) {
      // 只在解析失败时输出调试信息
      console.log('[DEBUG] parseChildren: no children parsed from', parent.localName, 
        'childNodes:', parent.childNodes.length,
        'elements:', xmlParser.elements(parent).map(e => e.localName))
    }
    
    return children
  }

  /**
   * 解析单个元素
   */
  private parseElement(el: Element): IOpenXmlElement | null {
    const localName = el.localName
    
    switch (localName) {
      case 'p':
        return this.parseParagraph(el)
      case 'r':
        return this.parseRun(el)
      case 't':
        return this.parseText(el)
      case 'br':
        return this.parseBreak(el)
      case 'tab':
        return this.parseTab()
      case 'sym':
        return this.parseSymbol(el)
      case 'lastRenderedPageBreak':
        return { type: DomType.Break, breakType: 'lastRenderedPageBreak' } as IBreakElement
      case 'fldSimple':
        return this.parseSimpleField(el)
      case 'fldChar':
        return this.parseComplexField(el)
      case 'instrText':
        return this.parseFieldInstruction(el)
      case 'tbl':
        return this.parseTable(el)
      case 'tr':
        return this.parseTableRow(el)
      case 'tc':
        return this.parseTableCell(el)
      case 'hyperlink':
        return this.parseHyperlink(el)
      case 'drawing':
        return this.parseDrawing(el)
      case 'commentRangeStart':
        return this.parseCommentRangeStart(el)
      case 'commentRangeEnd':
        return this.parseCommentRangeEnd(el)
      case 'commentReference':
        return this.parseCommentReference(el)
      case 'footnoteReference':
        return this.parseFootnoteReference(el)
      case 'endnoteReference':
        return this.parseEndnoteReference(el)
      case 'bookmarkStart':
        return this.parseBookmarkStart(el)
      case 'bookmarkEnd':
        return this.parseBookmarkEnd(el)
      default:
        // 对于未知元素，尝试解析其子元素
        console.log('[DEBUG] parseElement default branch for:', localName)
        const children = this.parseChildren(el)
        if (children.length > 0) {
          console.log('[DEBUG]   -> found children:', children.length)
          return children.length === 1 ? children[0] : {
            type: DomType.Run,
            children,
          } as IRunElement
        }
        // 如果没有子元素但有文本内容，创建一个文本元素
        const textContent = el.textContent?.trim()
        if (textContent) {
          console.log('[DEBUG]   -> using textContent:', textContent.substring(0, 50))
          return {
            type: DomType.Text,
            text: textContent,
          } as ITextElement
        }
        return null
    }
  }

  /**
   * 解析段落
   */
  private parseParagraph(el: Element): IParagraphElement {
    const pPr = xmlParser.element(el, 'pPr')
    
    return {
      type: DomType.Paragraph,
      props: pPr ? this.parseParagraphProperties(pPr) : undefined,
      children: this.parseChildren(el).filter(c => c.type !== DomType.Paragraph),
    }
  }

  /**
   * 解析段落属性
   */
  private parseParagraphProperties(el: Element): IParagraphProperties {
    const props: IParagraphProperties = {}
    
    // 样式 ID
    const pStyleEl = xmlParser.element(el, 'pStyle')
    if (pStyleEl) {
      props.styleId = xmlParser.attr(pStyleEl, 'val')
    }
    
    // 对齐方式
    const jcEl = xmlParser.element(el, 'jc')
    if (jcEl) {
      const val = xmlParser.attr(jcEl, 'val')
      if (val === 'left' || val === 'center' || val === 'right' || val === 'both') {
        props.justification = val
      }
    }
    
    // 缩进
    const indEl = xmlParser.element(el, 'ind')
    if (indEl) {
      props.indentation = {
        left: xmlParser.lengthAttr(indEl, 'left'),
        right: xmlParser.lengthAttr(indEl, 'right'),
        firstLine: xmlParser.lengthAttr(indEl, 'firstLine'),
        hanging: xmlParser.lengthAttr(indEl, 'hanging'),
      }
    }
    
    // 间距
    const spacingEl = xmlParser.element(el, 'spacing')
    if (spacingEl) {
      props.spacing = {
        before: xmlParser.lengthAttr(spacingEl, 'before'),
        after: xmlParser.lengthAttr(spacingEl, 'after'),
        // line 保存原始数值（twip），由渲染器根据 lineRule 计算
        line: xmlParser.intAttr(spacingEl, 'line'),
        lineRule: xmlParser.attr(spacingEl, 'lineRule') as 'auto' | 'atLeast' | 'exact',
      }
    }
    
    // 段前分页
    const pageBreakBeforeEl = xmlParser.element(el, 'pageBreakBefore')
    if (pageBreakBeforeEl) {
      props.pageBreakBefore = xmlParser.boolAttr(pageBreakBeforeEl, 'val') !== false
    }
    
    // 段落边框
    const pBdrEl = xmlParser.element(el, 'pBdr')
    if (pBdrEl) {
      props.borders = this.parseBorders(pBdrEl)
    }
    
    // 段落内分节符
    const sectPrEl = xmlParser.element(el, 'sectPr')
    if (sectPrEl) {
      props.sectionProps = this.parseSectionProperties(sectPrEl)
    }
    
    // 编号属性
    const numPrEl = xmlParser.element(el, 'numPr')
    if (numPrEl) {
      props.numbering = this.parseParagraphNumbering(numPrEl)
    }
    
    return props
  }

  /**
   * 解析段落编号引用
   */
  private parseParagraphNumbering(el: Element): IParagraphNumbering | undefined {
    const result: IParagraphNumbering = {
      id: '',
      level: 0,
    }
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'numId':
          result.id = xmlParser.attr(child, 'val') || ''
          break
        case 'ilvl':
          result.level = xmlParser.intAttr(child, 'val') ?? 0
          break
      }
    }
    
    // 如果没有 numId，返回 undefined
    if (!result.id) {
      return undefined
    }
    
    return result
  }

  /**
   * 解析 Run
   */
  private parseRun(el: Element): IRunElement {
    const rPr = xmlParser.element(el, 'rPr')
    
    return {
      type: DomType.Run,
      props: rPr ? this.parseRunProperties(rPr) : undefined,
      children: this.parseChildren(el),
    }
  }

  /**
   * 解析 Run 属性
   */
  private parseRunProperties(el: Element): IRunProperties {
    const props: IRunProperties = {}
    
    // 样式 ID
    const rStyleEl = xmlParser.element(el, 'rStyle')
    if (rStyleEl) {
      props.styleId = xmlParser.attr(rStyleEl, 'val')
    }
    
    // 粗体
    const bEl = xmlParser.element(el, 'b')
    if (bEl) {
      props.bold = xmlParser.attr(bEl, 'val') !== '0'
    }
    
    // 斜体
    const iEl = xmlParser.element(el, 'i')
    if (iEl) {
      props.italic = xmlParser.attr(iEl, 'val') !== '0'
    }
    
    // 下划线
    const uEl = xmlParser.element(el, 'u')
    if (uEl) {
      props.underline = xmlParser.attr(uEl, 'val') || 'single'
    }
    
    // 删除线
    const strikeEl = xmlParser.element(el, 'strike')
    if (strikeEl) {
      props.strike = xmlParser.attr(strikeEl, 'val') !== '0'
    }
    
    // 双删除线
    const dstrikeEl = xmlParser.element(el, 'dstrike')
    if (dstrikeEl) {
      props.dstrike = xmlParser.attr(dstrikeEl, 'val') !== '0'
    }
    
    // 上标/下标
    const vertAlignEl = xmlParser.element(el, 'vertAlign')
    if (vertAlignEl) {
      const val = xmlParser.attr(vertAlignEl, 'val')
      if (val === 'superscript' || val === 'subscript') {
        props.vertAlign = val
      }
    }
    
    // 颜色（支持主题颜色）
    const colorEl = xmlParser.element(el, 'color')
    if (colorEl) {
      const val = xmlParser.attr(colorEl, 'val')
      const themeColor = xmlParser.attr(colorEl, 'themeColor')
      
      if (themeColor) {
        // 主题颜色引用
        const themeTint = xmlParser.attr(colorEl, 'themeTint')
        const themeShade = xmlParser.attr(colorEl, 'themeShade')
        
        props.themeColor = {
          themeColor,
          themeTint: themeTint ? parseInt(themeTint, 16) : undefined,
          themeShade: themeShade ? parseInt(themeShade, 16) : undefined,
        }
        
        // 立即解析主题颜色为实际值
        if (this.theme) {
          const resolvedColor = resolveThemeColor(this.theme, props.themeColor)
          if (resolvedColor) {
            props.color = resolvedColor
          }
        }
      } else if (val && val !== 'auto') {
        props.color = `#${val}`
      }
    }
    
    // 字号
    const szEl = xmlParser.element(el, 'sz')
    if (szEl) {
      props.fontSize = xmlParser.lengthAttr(szEl, 'val', LengthUsage.FontSize)
    }
    
    // 字体（支持主题字体）
    const fontsEl = xmlParser.element(el, 'rFonts')
    if (fontsEl) {
      // 检查主题字体引用
      const asciiTheme = xmlParser.attr(fontsEl, 'asciiTheme')
      const eastAsiaTheme = xmlParser.attr(fontsEl, 'eastAsiaTheme')
      
      if (asciiTheme || eastAsiaTheme) {
        // 主题字体：majorHAnsi/minorHAnsi/majorEastAsia/minorEastAsia 等
        const themeRef = asciiTheme || eastAsiaTheme || ''
        if (themeRef.startsWith('major')) {
          props.themeFontFamily = 'major'
          // 解析主题字体
          if (this.theme?.fontScheme?.majorFont) {
            const font = themeRef.includes('EastAsia') 
              ? this.theme.fontScheme.majorFont.ea 
              : this.theme.fontScheme.majorFont.latin
            if (font) props.fontFamily = font
          }
        } else if (themeRef.startsWith('minor')) {
          props.themeFontFamily = 'minor'
          // 解析主题字体
          if (this.theme?.fontScheme?.minorFont) {
            const font = themeRef.includes('EastAsia')
              ? this.theme.fontScheme.minorFont.ea
              : this.theme.fontScheme.minorFont.latin
            if (font) props.fontFamily = font
          }
        }
      }
      
      // 如果没有主题字体或解析失败，使用直接指定的字体
      if (!props.fontFamily) {
        props.fontFamily = xmlParser.attr(fontsEl, 'ascii') || 
                           xmlParser.attr(fontsEl, 'eastAsia') ||
                           xmlParser.attr(fontsEl, 'hAnsi')
      }
    }
    
    // 高亮
    const highlightEl = xmlParser.element(el, 'highlight')
    if (highlightEl) {
      props.highlight = xmlParser.attr(highlightEl, 'val')
    }
    
    return props
  }

  /**
   * 解析文本
   */
  private parseText(el: Element): ITextElement {
    return {
      type: DomType.Text,
      text: el.textContent || '',
    }
  }

  /**
   * 解析换行
   */
  private parseBreak(el: Element): IBreakElement {
    const breakType = xmlParser.attr(el, 'type')
    return {
      type: DomType.Break,
      breakType: (breakType || 'textWrapping') as IBreakElement['breakType'],
    }
  }

  /**
   * 解析 Tab
   */
  private parseTab(): ITabElement {
    return {
      type: DomType.Tab,
    }
  }

  /**
   * 解析符号字符 - <w:sym w:font="Symbol" w:char="F0B7"/>
   * Symbol 字体中的特殊字符，如箭头、符号等
   */
  private parseSymbol(el: Element): ISymbolElement {
    const font = xmlParser.attr(el, 'font')
    const charCode = xmlParser.attr(el, 'char')
    
    // 将十六进制字符码转换为实际字符
    let char: string | undefined
    if (charCode) {
      const code = parseInt(charCode, 16)
      if (!isNaN(code)) {
        char = String.fromCharCode(code)
      }
    }
    
    return {
      type: DomType.Symbol,
      font,
      char,
    }
  }

  /**
   * 解析简单域 - <w:fldSimple w:instr="PAGE">...</w:fldSimple>
   */
  private parseSimpleField(el: Element): ISimpleFieldElement {
    return {
      type: DomType.SimpleField,
      instruction: xmlParser.attr(el, 'instr') || '',
      children: this.parseChildren(el),
    }
  }

  /**
   * 解析复杂域字符 - <w:fldChar w:fldCharType="begin"/>
   */
  private parseComplexField(el: Element): IComplexFieldElement {
    return {
      type: DomType.ComplexField,
      charType: xmlParser.attr(el, 'fldCharType') || '',
    }
  }

  /**
   * 解析域指令 - <w:instrText>PAGE</w:instrText>
   */
  private parseFieldInstruction(el: Element): IFieldInstructionElement {
    return {
      type: DomType.FieldInstruction,
      text: el.textContent || '',
    }
  }

  /**
   * 解析表格
   */
  private parseTable(el: Element): ITableElement {
    const table: ITableElement = {
      type: DomType.Table,
      children: [],
    }
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'tr':
          table.children.push(this.parseTableRow(child))
          break
        case 'tblGrid':
          table.columns = this.parseTableGrid(child)
          break
        case 'tblPr':
          table.props = this.parseTableProperties(child)
          break
      }
    }
    
    return table
  }

  /**
   * 解析表格列宽度
   */
  private parseTableGrid(el: Element): { width?: string }[] {
    const columns: { width?: string }[] = []
    
    for (const child of xmlParser.elements(el)) {
      if (child.localName === 'gridCol') {
        columns.push({
          width: xmlParser.lengthAttr(child, 'w'),
        })
      }
    }
    
    return columns
  }

  /**
   * 解析表格属性
   */
  private parseTableProperties(el: Element): ITableProperties {
    const props: ITableProperties = {}
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'tblW':
          props.width = xmlParser.lengthAttr(child, 'w')
          const widthType = xmlParser.attr(child, 'type')
          if (widthType === 'auto' || widthType === 'dxa' || widthType === 'pct') {
            props.widthType = widthType
          }
          break
        case 'jc':
          props.justification = xmlParser.attr(child, 'val')
          break
        case 'tblBorders':
          props.borders = this.parseTableBorders(child)
          break
        case 'tblCellSpacing':
          props.cellSpacing = xmlParser.lengthAttr(child, 'w')
          break
        case 'tblCellMar':
          props.cellMargin = {
            top: xmlParser.lengthAttr(xmlParser.element(child, 'top'), 'w'),
            bottom: xmlParser.lengthAttr(xmlParser.element(child, 'bottom'), 'w'),
            left: xmlParser.lengthAttr(xmlParser.element(child, 'left'), 'w') || 
                  xmlParser.lengthAttr(xmlParser.element(child, 'start'), 'w'),
            right: xmlParser.lengthAttr(xmlParser.element(child, 'right'), 'w') ||
                   xmlParser.lengthAttr(xmlParser.element(child, 'end'), 'w'),
          }
          break
      }
    }
    
    return props
  }

  /**
   * 解析表格边框（包含内部边框 insideH/insideV）
   */
  private parseTableBorders(el: Element): IBorders {
    const borders: IBorders = {}
    
    for (const child of xmlParser.elements(el)) {
      const border = this.parseBorder(child)
      switch (child.localName) {
        case 'top':
          borders.top = border
          break
        case 'bottom':
          borders.bottom = border
          break
        case 'left':
        case 'start':
          borders.left = border
          break
        case 'right':
        case 'end':
          borders.right = border
          break
        case 'insideH':
          borders.insideH = border
          break
        case 'insideV':
          borders.insideV = border
          break
      }
    }
    
    return borders
  }

  /**
   * 解析表格行
   */
  private parseTableRow(el: Element): ITableRowElement {
    return {
      type: DomType.TableRow,
      children: xmlParser.elements(el)
        .filter(c => c.localName === 'tc')
        .map(c => this.parseTableCell(c)),
    }
  }

  /**
   * 解析表格单元格
   */
  private parseTableCell(el: Element): ITableCellElement {
    const cell: ITableCellElement = {
      type: DomType.TableCell,
      children: [],
    }
    
    for (const child of xmlParser.elements(el)) {
      if (child.localName === 'tcPr') {
        cell.props = this.parseTableCellProperties(child)
      } else {
        const parsed = this.parseElement(child)
        if (parsed) {
          cell.children.push(parsed)
        }
      }
    }
    
    return cell
  }

  /**
   * 解析表格单元格属性
   */
  private parseTableCellProperties(el: Element): ITableCellProperties {
    const props: ITableCellProperties = {}
    
    for (const child of xmlParser.elements(el)) {
      switch (child.localName) {
        case 'tcW':
          props.width = xmlParser.lengthAttr(child, 'w')
          break
        case 'gridSpan':
          props.gridSpan = xmlParser.intAttr(child, 'val')
          break
        case 'vMerge':
          const val = xmlParser.attr(child, 'val')
          props.verticalMerge = val === 'restart' ? 'restart' : 'continue'
          break
        case 'vAlign':
          props.verticalAlign = xmlParser.attr(child, 'val')
          break
        case 'shd':
          const fill = xmlParser.attr(child, 'fill')
          if (fill && fill !== 'auto') {
            props.shading = `#${fill}`
          }
          break
        case 'tcBorders':
          props.borders = this.parseBorders(child)
          break
      }
    }
    
    return props
  }

  /**
   * 解析超链接
   */
  private parseHyperlink(el: Element): IHyperlinkElement {
    const rId = xmlParser.attr(el, 'id')
    let href: string | undefined
    
    if (rId) {
      const rel = this.relationships.find(r => r.id === rId)
      if (rel) {
        href = rel.target
      }
    }
    
    return {
      type: DomType.Hyperlink,
      href,
      anchor: xmlParser.attr(el, 'anchor'),
      children: this.parseChildren(el),
    }
  }

  /**
   * 解析绘图（图片等）
   */
  private parseDrawing(el: Element): IDrawingElement {
    const children: IOpenXmlElement[] = []
    
    // 查找 blip 元素（包含图片引用）
    const blipElements = el.getElementsByTagNameNS(
      'http://schemas.openxmlformats.org/drawingml/2006/main',
      'blip'
    )
    
    for (let i = 0; i < blipElements.length; i++) {
      const blip = blipElements[i]
      const embedId = blip.getAttributeNS(
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'embed'
      )
      
      if (embedId && this.images.has(embedId)) {
        // 获取图片尺寸
        const extentEl = el.getElementsByTagNameNS(
          'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
          'extent'
        )[0]
        
        let width: string | undefined
        let height: string | undefined
        
        if (extentEl) {
          const cx = extentEl.getAttribute('cx')
          const cy = extentEl.getAttribute('cy')
          if (cx) width = xmlParser.convertLength(cx, LengthUsage.Emu)
          if (cy) height = xmlParser.convertLength(cy, LengthUsage.Emu)
        }
        
        children.push({
          type: DomType.Image,
          src: this.images.get(embedId)!,
          width,
          height,
        } as IImageElement)
      }
    }
    
    return {
      type: DomType.Drawing,
      children,
    }
  }

  /**
   * 解析评论范围开始
   */
  private parseCommentRangeStart(el: Element): ICommentRangeStart {
    return {
      type: DomType.CommentRangeStart,
      id: xmlParser.attr(el, 'id') || '',
    }
  }

  /**
   * 解析评论范围结束
   */
  private parseCommentRangeEnd(el: Element): ICommentRangeEnd {
    return {
      type: DomType.CommentRangeEnd,
      id: xmlParser.attr(el, 'id') || '',
    }
  }

  /**
   * 解析评论引用
   */
  private parseCommentReference(el: Element): ICommentReference {
    return {
      type: DomType.CommentReference,
      id: xmlParser.attr(el, 'id') || '',
    }
  }

  /**
   * 解析脚注引用
   */
  private parseFootnoteReference(el: Element): IFootnoteReference {
    return {
      type: DomType.FootnoteReference,
      id: xmlParser.attr(el, 'id') || '',
    }
  }

  /**
   * 解析尾注引用
   */
  private parseEndnoteReference(el: Element): IEndnoteReference {
    return {
      type: DomType.EndnoteReference,
      id: xmlParser.attr(el, 'id') || '',
    }
  }

  /**
   * 解析书签开始
   * <w:bookmarkStart w:id="0" w:name="bookmark1"/>
   */
  private parseBookmarkStart(el: Element): IBookmarkStartElement {
    const bookmark: IBookmarkStartElement = {
      type: DomType.BookmarkStart,
      id: xmlParser.attr(el, 'id') || '',
      name: xmlParser.attr(el, 'name') || '',
      colFirst: xmlParser.intAttr(el, 'colFirst'),
      colLast: xmlParser.intAttr(el, 'colLast'),
    }
    
    // 收集书签到 Map（以 name 为 key）
    // 注意：忽略以 _ 开头的内置书签（如 _GoBack）
    if (bookmark.name && !bookmark.name.startsWith('_')) {
      this.bookmarks.set(bookmark.name, bookmark)
    }
    
    return bookmark
  }

  /**
   * 解析书签结束
   * <w:bookmarkEnd w:id="0"/>
   */
  private parseBookmarkEnd(el: Element): IBookmarkEndElement {
    return {
      type: DomType.BookmarkEnd,
      id: xmlParser.attr(el, 'id') || '',
    }
  }
}
