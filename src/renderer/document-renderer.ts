import {
  DomType,
  IDocxDocument,
  IOpenXmlElement,
  IParagraphElement,
  IRunElement,
  ITextElement,
  IBreakElement,
  ITableElement,
  ITableRowElement,
  ITableCellElement,
  ITableProperties,
  ICommentElement,
  ICommentRangeStart,
  ICommentRangeEnd,
  ICommentReference,
  IHyperlinkElement,
  IImageElement,
  IDrawingElement,
  IRendererOptions,
  IParagraphProperties,
  IRunProperties,
  ISectionProperties,
  ISymbolElement,
  ISimpleFieldElement,
  IComplexFieldElement,
  IFieldInstructionElement,
  INumberingDefinition,
  INumberingLevel,
  IFootnoteReference,
  IEndnoteReference,
  IFootnoteElement,
  IEndnoteElement,
  IBookmarkStartElement,
  IBookmarkEndElement,
  TUnderlineStyle,
  IBorder,
  IBorders,
} from '../types'

/**
 * 分页 Section 信息
 */
interface ISection {
  sectProps: ISectionProperties | null
  elements: IOpenXmlElement[]
  pageBreak: boolean
}

/**
 * 评论范围信息
 */
interface ICommentRangeInfo {
  id: string
  startElement: HTMLElement | null
  endElement: HTMLElement | null
  highlightElements: HTMLElement[]
  panelElement: HTMLElement | null
}

/**
 * DOCX 文档渲染器
 * 将解析后的文档模型渲染为 HTML，评论和文档内容一体化渲染
 */
// 内部使用的选项类型，accept/reject 回调保持可选
type InternalRendererOptions = Required<Omit<IRendererOptions, 'onCommentAccept' | 'onCommentReject'>> & 
  Pick<IRendererOptions, 'onCommentAccept' | 'onCommentReject'>

export class DocumentRenderer {
  private document: IDocxDocument | null = null
  private container: HTMLElement
  private options: InternalRendererOptions
  private classPrefix: string
  
  // 评论相关状态
  private commentRanges: Map<string, ICommentRangeInfo> = new Map()
  private activeCommentId: string | null = null
  private svgLayer: SVGSVGElement | null = null
  private currentCommentIds: Set<string> = new Set() // 当前正在渲染的评论范围
  private commentStartInParagraph: Set<string> = new Set() // 在当前段落开始的评论

  // 页码相关状态
  private currentPageNumber = 1
  private totalPages = 1
  private inComplexField = false // 是否在复杂域中
  private currentFieldInstruction = '' // 当前域指令
  private skipFieldContent = false // 是否跳过域的静态内容（separate 后）

  // 编号/列表相关状态
  // 编号计数器：key 格式为 "numId-level"，value 为当前计数
  private numberingCounters: Map<string, number> = new Map()

  // 脚注/尾注相关状态
  private currentFootnoteIds: string[] = []  // 当前页面引用的脚注 ID
  private currentEndnoteIds: string[] = []   // 文档中引用的尾注 ID
  private footnoteCounter = 0  // 脚注编号计数器
  private endnoteCounter = 0   // 尾注编号计数器

  constructor(options: IRendererOptions) {
    const containerEl = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container

    if (!containerEl) {
      throw new Error('容器元素不存在')
    }

    this.container = containerEl as HTMLElement
    this.classPrefix = options.classNamePrefix || 'docx'
    
    this.options = {
      container: this.container,
      renderComments: options.renderComments ?? true,
      enableCommentEdit: options.enableCommentEdit ?? true,
      showCommentLines: options.showCommentLines ?? true,
      breakPages: options.breakPages ?? true,
      classNamePrefix: this.classPrefix,
      onCommentClick: options.onCommentClick || (() => {}),
      onCommentChange: options.onCommentChange || (() => {}),
      onCommentAccept: options.onCommentAccept,
      onCommentReject: options.onCommentReject,
    }
  }

  /**
   * 渲染文档
   */
  render(document: IDocxDocument): void {
    this.document = document
    this.commentRanges.clear()
    this.currentCommentIds.clear()
    this.numberingCounters.clear()
    this.currentFootnoteIds = []
    this.currentEndnoteIds = []
    this.footnoteCounter = 0
    this.endnoteCounter = 0
    
    // 初始化评论范围信息
    for (const comment of document.comments) {
      this.commentRanges.set(comment.id, {
        id: comment.id,
        startElement: null,
        endElement: null,
        highlightElements: [],
        panelElement: null,
      })
    }
    
    // 清空容器
    this.container.innerHTML = ''
    this.container.className = `${this.classPrefix}-container`
    
    // 创建主布局
    const wrapper = this.createElement('div', `${this.classPrefix}-wrapper`)
    
    // 判断是否启用分页
    if (this.options.breakPages) {
      // 分页渲染模式
      this.renderWithPages(wrapper, document)
    } else {
      // 单页渲染模式（旧逻辑）
      this.renderSinglePage(wrapper, document)
    }
    
    this.container.appendChild(wrapper)
    
    // 创建 SVG 连线层（fixed 定位）
    if (this.options.showCommentLines) {
      this.svgLayer = this.createSvgLayer()
      this.container.appendChild(this.svgLayer)
    }
    
    // 渲染评论气泡（fixed 定位在右侧）
    if (this.options.renderComments) {
      this.renderAllCommentBubbles()
    }
    
    // 使用 requestAnimationFrame 优化滚动更新
    let ticking = false
    const updateAll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.positionCommentBubbles()
          this.updateLines()
          ticking = false
        })
        ticking = true
      }
    }
    
    // 滚动时立即更新（不等待 RAF）
    wrapper.addEventListener('scroll', () => {
      this.positionCommentBubbles()
      this.updateLines()
    }, { passive: true })
    
    window.addEventListener('resize', updateAll)
    
    // 初始定位和绘制连线
    requestAnimationFrame(() => {
      this.positionCommentBubbles()
      this.updateLines()
    })
  }

  /**
   * 单页渲染模式
   */
  private renderSinglePage(wrapper: HTMLElement, document: IDocxDocument): void {
    const documentArea = this.createElement('div', `${this.classPrefix}-document`)
    const page = this.createElement('div', `${this.classPrefix}-page`)
    
    // 渲染文档内容
    const content = this.renderElement(document.body)
    if (content) {
      page.appendChild(content)
    }
    
    // 渲染脚注
    this.renderPageFootnotes(this.currentFootnoteIds, page)
    
    documentArea.appendChild(page)
    wrapper.appendChild(documentArea)
    
    // 渲染尾注（在文档末尾）
    this.renderDocumentEndnotes(wrapper)
  }

  /**
   * 分页渲染模式
   */
  private renderWithPages(wrapper: HTMLElement, document: IDocxDocument): void {
    const body = document.body
    const defaultSectionProps = body.sectionProps
    
    // 分割内容为多个 Section
    const sections = this.splitBySection(body.children || [], defaultSectionProps)
    
    // 将 Section 按页面分组
    const pages = this.groupByPageBreaks(sections)
    
    // 设置总页数
    this.totalPages = pages.length
    
    let prevSectionProps: ISectionProperties | undefined = undefined
    
    // 渲染每一页
    for (let i = 0; i < pages.length; i++) {
      // 设置当前页码（从 1 开始）
      this.currentPageNumber = i + 1
      
      // 记录本页开始时的脚注计数
      const pageFootnoteStartIndex = this.currentFootnoteIds.length
      
      const pageSections = pages[i]
      if (pageSections.length === 0) continue
      
      const firstSection = pageSections[0]
      let sectionProps = firstSection.sectProps || defaultSectionProps
      
      // 创建页面元素
      const pageElement = this.createPageElement(sectionProps)
      
      // 渲染页眉
      if (sectionProps?.headerRefs) {
        this.renderHeaderFooter(
          sectionProps.headerRefs,
          sectionProps,
          i,
          prevSectionProps !== sectionProps,
          pageElement,
          'header'
        )
      }
      
      // 渲染每个 Section 的内容
      for (const section of pageSections) {
        const contentElement = this.createSectionContent(section.sectProps)
        
        for (const element of section.elements) {
          const rendered = this.renderElement(element)
          if (rendered) {
            contentElement.appendChild(rendered)
          }
        }
        
        pageElement.appendChild(contentElement)
        sectionProps = section.sectProps || sectionProps
      }
      
      // 渲染本页脚注
      const pageFootnoteIds = this.currentFootnoteIds.slice(pageFootnoteStartIndex)
      this.renderPageFootnotes(pageFootnoteIds, pageElement)
      
      // 渲染页脚
      if (sectionProps?.footerRefs) {
        this.renderHeaderFooter(
          sectionProps.footerRefs,
          sectionProps,
          i,
          prevSectionProps !== sectionProps,
          pageElement,
          'footer'
        )
      }
      
      wrapper.appendChild(pageElement)
      prevSectionProps = sectionProps
    }
    
    // 渲染尾注（在文档末尾）
    this.renderDocumentEndnotes(wrapper)
  }

  /**
   * 按 Section 分割内容
   */
  private splitBySection(elements: IOpenXmlElement[], defaultProps?: ISectionProperties): ISection[] {
    const result: ISection[] = []
    let current: ISection = { sectProps: null, elements: [], pageBreak: false }
    result.push(current)
    
    for (const elem of elements) {
      // 检查 pageBreakBefore 样式
      if (elem.type === DomType.Paragraph) {
        const p = elem as IParagraphElement
        if (p.props?.pageBreakBefore) {
          // 在此段落前分页
          current.pageBreak = true
          current = { sectProps: null, elements: [], pageBreak: false }
          result.push(current)
        }
      }
      
      current.elements.push(elem)
      
      // 检查段落中的分节符和分页符
      if (elem.type === DomType.Paragraph) {
        const p = elem as IParagraphElement
        const sectProps = p.props?.sectionProps
        
        // 检查段落内是否有分页符
        let hasPageBreak = false
        const checkForPageBreak = (children: IOpenXmlElement[]) => {
          for (const child of children) {
            if (child.type === DomType.Break) {
              const br = child as IBreakElement
              if (br.breakType === 'page' || br.breakType === 'lastRenderedPageBreak') {
                hasPageBreak = true
                return
              }
            }
            if (child.type === DomType.Run && (child as IRunElement).children) {
              checkForPageBreak((child as IRunElement).children)
            }
          }
        }
        
        if (this.options.breakPages && p.children) {
          checkForPageBreak(p.children)
        }
        
        // 如果有分节符或分页符，创建新的 Section
        if (sectProps || hasPageBreak) {
          current.sectProps = sectProps || null
          current.pageBreak = hasPageBreak
          current = { sectProps: null, elements: [], pageBreak: false }
          result.push(current)
        }
      }
    }
    
    // 反向传播 Section 属性
    let currentSectProps: ISectionProperties | null = null
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].sectProps === null) {
        result[i].sectProps = currentSectProps || defaultProps || null
      } else {
        currentSectProps = result[i].sectProps
      }
    }
    
    return result
  }

  /**
   * 按分页符分组
   */
  private groupByPageBreaks(sections: ISection[]): ISection[][] {
    const result: ISection[][] = []
    let current: ISection[] = []
    result.push(current)
    
    let prevSectProps: ISectionProperties | null = null
    
    for (const section of sections) {
      current.push(section)
      
      // 检查是否需要分页
      const needPageBreak = section.pageBreak || 
        this.isPageBreakSection(prevSectProps, section.sectProps)
      
      if (needPageBreak) {
        current = []
        result.push(current)
      }
      
      prevSectProps = section.sectProps
    }
    
    // 过滤空页面
    return result.filter(page => page.length > 0)
  }

  /**
   * 检查是否因为 Section 属性变化需要分页
   */
  private isPageBreakSection(prev: ISectionProperties | null, next: ISectionProperties | null): boolean {
    if (!prev || !next) return false
    
    // 页面尺寸或方向改变时分页
    const prevSize = prev.pageSize
    const nextSize = next.pageSize
    
    if (!prevSize || !nextSize) return false
    
    return prevSize.orientation !== nextSize.orientation ||
           prevSize.width !== nextSize.width ||
           prevSize.height !== nextSize.height
  }

  /**
   * 创建页面元素
   */
  private createPageElement(sectionProps?: ISectionProperties | null): HTMLElement {
    const page = this.createElement('section', `${this.classPrefix}-page`)
    
    if (sectionProps) {
      // 应用页面尺寸
      if (sectionProps.pageSize) {
        if (sectionProps.pageSize.width) {
          page.style.width = sectionProps.pageSize.width
        }
        if (sectionProps.pageSize.height) {
          page.style.minHeight = sectionProps.pageSize.height
        }
      }
      
      // 应用页边距
      if (sectionProps.pageMargins) {
        const margins = sectionProps.pageMargins
        if (margins.top) page.style.paddingTop = margins.top
        if (margins.right) page.style.paddingRight = margins.right
        if (margins.bottom) page.style.paddingBottom = margins.bottom
        if (margins.left) page.style.paddingLeft = margins.left
      }
    }
    
    return page
  }

  /**
   * 创建 Section 内容区域
   */
  private createSectionContent(sectionProps?: ISectionProperties | null): HTMLElement {
    const content = this.createElement('article', `${this.classPrefix}-section-content`)
    
    if (sectionProps?.columns) {
      const cols = sectionProps.columns
      if (cols.numberOfColumns && cols.numberOfColumns > 1) {
        content.style.columnCount = String(cols.numberOfColumns)
        if (cols.space) {
          content.style.columnGap = cols.space
        }
        if (cols.separator) {
          content.style.columnRule = '1px solid #ccc'
        }
      }
    }
    
    return content
  }

  /**
   * 渲染页眉或页脚
   */
  private renderHeaderFooter(
    refs: { id: string; type: 'default' | 'first' | 'even' }[],
    sectionProps: ISectionProperties,
    pageIndex: number,
    isFirstOfSection: boolean,
    pageElement: HTMLElement,
    position: 'header' | 'footer'
  ): void {
    if (!refs || refs.length === 0) return
    
    // 选择合适的页眉/页脚
    let ref = null
    
    // 首页特殊处理
    if (sectionProps.titlePage && isFirstOfSection) {
      ref = refs.find(r => r.type === 'first')
    }
    
    // 奇偶页处理
    if (!ref) {
      if (pageIndex % 2 === 1) {
        ref = refs.find(r => r.type === 'even')
      }
    }
    
    // 默认页眉/页脚
    if (!ref) {
      ref = refs.find(r => r.type === 'default')
    }
    
    if (!ref) return
    
    // 获取页眉/页脚内容
    const map = position === 'header' ? this.document?.headers : this.document?.footers
    const content = map?.get(ref.id)
    
    if (!content) return
    
    // 渲染
    const element = this.createElement('div', `${this.classPrefix}-${position}`)
    
    for (const child of content.children || []) {
      const rendered = this.renderElement(child)
      if (rendered) {
        element.appendChild(rendered)
      }
    }
    
    // 应用边距
    if (sectionProps.pageMargins) {
      const margins = sectionProps.pageMargins
      if (position === 'header' && margins.header && margins.top) {
        element.style.marginTop = `calc(${margins.header} - ${margins.top})`
        element.style.minHeight = `calc(${margins.top} - ${margins.header})`
      } else if (position === 'footer' && margins.footer && margins.bottom) {
        element.style.marginBottom = `calc(${margins.footer} - ${margins.bottom})`
        element.style.minHeight = `calc(${margins.bottom} - ${margins.footer})`
      }
    }
    
    if (position === 'header') {
      pageElement.insertBefore(element, pageElement.firstChild)
    } else {
      pageElement.appendChild(element)
    }
  }

  /**
   * 渲染所有评论气泡（右侧固定面板）
   */
  private renderAllCommentBubbles(): void {
    // 创建评论面板（fixed 定位在视口右侧）
    const commentsLayer = this.createElement('div', `${this.classPrefix}-comments-layer`)
    this.container.appendChild(commentsLayer)
    
    // 调试：打印所有评论
    const comments = this.document?.comments || []
    console.log('[DEBUG] renderAllCommentBubbles - Total comments:', comments.length)
    comments.forEach(c => {
      console.log('[DEBUG] Comment:', {
        id: c.id,
        author: c.author,
        date: c.date,
        childrenCount: c.children?.length || 0,
        text: this.getCommentText(c)
      })
    })
    console.log('[DEBUG] Comment ranges count:', this.commentRanges.size)
    
    // 为每个评论创建气泡
    for (const comment of comments) {
      const range = this.commentRanges.get(comment.id)
      
      if (range && range.highlightElements.length > 0) {
        const bubble = this.createCommentBubble(comment)
        range.panelElement = bubble
        commentsLayer.appendChild(bubble)
      }
    }
    
    // 在 DOM 渲染后定位评论气泡（在分页模式下不需要绝对定位）
    // requestAnimationFrame(() => this.positionCommentBubbles())
  }

  /**
   * 定位评论气泡到对应的高亮文字旁边
   * 原文不可见时隐藏评论
   */
  private positionCommentBubbles(): void {
    // 获取页面元素用于计算 left 位置
    const pageElement = this.container.querySelector(`.${this.classPrefix}-page`) as HTMLElement
    if (!pageElement) return
    
    const pageRect = pageElement.getBoundingClientRect()
    // 评论气泡的 left 位置：页面右边缘 + 间距
    const bubbleLeft = pageRect.right + 15
    
    // 获取有效的视口范围
    const viewportTop = 0
    const viewportBottom = window.innerHeight
    
    for (const [, range] of this.commentRanges) {
      if (!range.panelElement || range.highlightElements.length === 0) continue
      
      const highlightEl = range.highlightElements[0]
      const rect = highlightEl.getBoundingClientRect()
      
      // 检查高亮文字是否在视口内
      const isVisible = rect.bottom > viewportTop && rect.top < viewportBottom
      
      if (isVisible) {
        // 直接设置 fixed 定位坐标
        range.panelElement.style.display = 'block'
        range.panelElement.style.left = `${bubbleLeft}px`
        range.panelElement.style.top = `${rect.top}px`
      } else {
        range.panelElement.style.display = 'none'
      }
    }
  }

  /**
   * 创建 SVG 连线层
   */
  private createSvgLayer(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.classList.add(`${this.classPrefix}-lines`)
    // 样式由 CSS 控制，不设置内联样式
    return svg
  }

  /**
   * 更新所有连线
   */
  private updateLines(): void {
    if (!this.svgLayer) return
    
    this.svgLayer.innerHTML = ''
    
    // 绘制所有可见评论的连线
    for (const [id] of this.commentRanges) {
      const isActive = id === this.activeCommentId
      this.drawCommentLine(id, isActive)
    }
  }

  /**
   * 绘制单个评论的连线
   */
  private drawCommentLine(commentId: string, active: boolean): void {
    const range = this.commentRanges.get(commentId)
    if (!range || !range.highlightElements.length || !range.panelElement || !this.svgLayer) return
    
    // 如果评论气泡被隐藏，不绘制连线
    if (range.panelElement.style.display === 'none') return

    // 直接使用视口坐标（SVG 是 fixed 定位）
    const highlightRect = range.highlightElements[0].getBoundingClientRect()
    const panelRect = range.panelElement.getBoundingClientRect()
    
    const startX = highlightRect.right
    const startY = highlightRect.top + highlightRect.height / 2
    const endX = panelRect.left
    // 连接线水平，Y 坐标与高亮文字中心对齐
    const endY = startY

    // 创建直线（水平线）
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(startX))
    line.setAttribute('y1', String(startY))
    line.setAttribute('x2', String(endX))
    line.setAttribute('y2', String(endY))
    line.setAttribute('stroke', '#ef4444') // 红色
    line.setAttribute('stroke-width', active ? '2' : '1')
    
    this.svgLayer.appendChild(line)
  }

  /**
   * 渲染元素
   */
  private renderElement(element: IOpenXmlElement): HTMLElement | null {
    switch (element.type) {
      case DomType.Document:
        return this.renderDocument(element)
      case DomType.Paragraph:
        return this.renderParagraph(element as IParagraphElement)
      case DomType.Run:
        return this.renderRun(element as IRunElement)
      case DomType.Text:
        return this.renderText(element as ITextElement)
      case DomType.Break:
        return this.renderBreak(element as IBreakElement)
      case DomType.Tab:
        return this.renderTab()
      case DomType.Symbol:
        return this.renderSymbol(element as ISymbolElement)
      case DomType.SimpleField:
        return this.renderSimpleField(element as ISimpleFieldElement)
      case DomType.ComplexField:
        return this.renderComplexField(element as IComplexFieldElement)
      case DomType.FieldInstruction:
        return this.renderFieldInstruction(element as IFieldInstructionElement)
      case DomType.Table:
        return this.renderTable(element as ITableElement)
      case DomType.TableRow:
        return this.renderTableRow(element as ITableRowElement)
      case DomType.TableCell:
        return this.renderTableCell(element as ITableCellElement)
      case DomType.Hyperlink:
        return this.renderHyperlink(element as IHyperlinkElement)
      case DomType.Drawing:
        return this.renderDrawing(element as IDrawingElement)
      case DomType.Image:
        return this.renderImage(element as IImageElement)
      case DomType.CommentRangeStart:
        return this.renderCommentRangeStart(element as ICommentRangeStart)
      case DomType.CommentRangeEnd:
        return this.renderCommentRangeEnd(element as ICommentRangeEnd)
      case DomType.CommentReference:
        return this.renderCommentReference(element as ICommentReference)
      case DomType.FootnoteReference:
        return this.renderFootnoteReference(element as IFootnoteReference)
      case DomType.EndnoteReference:
        return this.renderEndnoteReference(element as IEndnoteReference)
      case DomType.Footnote:
        return this.renderFootnote(element as IFootnoteElement)
      case DomType.Endnote:
        return this.renderEndnote(element as IEndnoteElement)
      case DomType.BookmarkStart:
        return this.renderBookmarkStart(element as IBookmarkStartElement)
      case DomType.BookmarkEnd:
        return this.renderBookmarkEnd(element as IBookmarkEndElement)
      default:
        return null
    }
  }

  /**
   * 渲染文档
   */
  private renderDocument(element: IOpenXmlElement): HTMLElement {
    const article = this.createElement('article', `${this.classPrefix}-body`)
    this.renderChildren(element.children || [], article)
    return article
  }

  /**
   * 渲染段落
   */
  private renderParagraph(element: IParagraphElement): HTMLElement {
    const p = this.createElement('p', `${this.classPrefix}-p`)
    
    // 清空当前段落的评论开始记录
    this.commentStartInParagraph.clear()
    
    // 应用段落样式
    if (element.props) {
      this.applyParagraphStyles(p, element.props)
    }
    
    // 渲染编号
    const numberingContent = this.renderNumbering(element.props)
    if (numberingContent) {
      p.insertBefore(numberingContent, p.firstChild)
      p.classList.add(`${this.classPrefix}-list-item`)
    }
    
    // 渲染子元素
    this.renderChildren(element.children || [], p)
    
    // 如果段落为空，添加一个换行符保持高度
    if (p.childNodes.length === 0 || (p.childNodes.length === 1 && numberingContent)) {
      p.appendChild(document.createElement('br'))
    }
    
    // 如果当前段落有评论开始，标记段落
    if (this.commentStartInParagraph.size > 0 && this.options.renderComments) {
      // 将评论 ID 存储在段落元素上，稍后处理
      p.dataset.commentIds = Array.from(this.commentStartInParagraph).join(',')
    }
    
    return p
  }

  /**
   * 渲染编号
   */
  private renderNumbering(props?: IParagraphProperties): HTMLElement | null {
    if (!props?.numbering || !this.document?.numberingMap) {
      return null
    }

    const { id, level } = props.numbering
    const numbering = this.document.numberingMap.get(id)
    
    if (!numbering) {
      return null
    }

    const levelDef = numbering.levels.find(l => l.level === level)
    if (!levelDef) {
      return null
    }

    // 获取编号内容
    const content = this.getNumberingContent(numbering, levelDef, id, level)
    
    // 创建编号 span
    const span = this.createElement('span', `${this.classPrefix}-numbering`)
    span.textContent = content
    
    // 应用编号级别的文本样式
    if (levelDef.runProps) {
      this.applyRunStyles(span, levelDef.runProps)
    }
    
    // 添加后缀（tab、space 等）
    const suffix = this.createElement('span', `${this.classPrefix}-numbering-suffix`)
    switch (levelDef.suffix) {
      case 'tab':
        suffix.innerHTML = '&emsp;'
        break
      case 'space':
        suffix.innerHTML = '&nbsp;'
        break
      default:
        // nothing
        break
    }
    
    const wrapper = this.createElement('span', `${this.classPrefix}-numbering-wrapper`)
    wrapper.appendChild(span)
    wrapper.appendChild(suffix)
    
    // 应用缩进
    if (levelDef.paragraphProps?.indentation) {
      const indent = levelDef.paragraphProps.indentation
      if (indent.left) {
        wrapper.style.marginLeft = indent.left
      }
      if (indent.hanging) {
        wrapper.style.textIndent = `-${indent.hanging}`
        wrapper.style.paddingLeft = indent.hanging
      }
    }
    
    return wrapper
  }

  /**
   * 获取编号内容
   */
  private getNumberingContent(
    numbering: INumberingDefinition,
    levelDef: INumberingLevel,
    numId: string,
    level: number
  ): string {
    const format = levelDef.format
    const text = levelDef.text
    
    // 处理 bullet（无序列表）
    if (format === 'bullet') {
      return text || '•'
    }
    
    // 更新计数器
    const counterKey = `${numId}-${level}`
    let count = this.numberingCounters.get(counterKey) ?? (levelDef.start - 1)
    count++
    this.numberingCounters.set(counterKey, count)
    
    // 重置更高级别的计数器
    for (let i = level + 1; i <= 8; i++) {
      this.numberingCounters.delete(`${numId}-${i}`)
    }
    
    // 替换文本模板中的占位符
    // 如 "%1." 表示第一级编号，"%1.%2." 表示第一级.第二级
    let result = text
    for (let i = 0; i <= level; i++) {
      const lvlCount = this.numberingCounters.get(`${numId}-${i}`) ?? 1
      const lvlDef = numbering.levels.find(l => l.level === i)
      const lvlFormat = lvlDef?.format || 'decimal'
      const formatted = this.formatNumber(lvlCount, lvlFormat)
      result = result.replace(`%${i + 1}`, formatted)
    }
    
    return result
  }

  /**
   * 格式化编号
   */
  private formatNumber(num: number, format: string): string {
    switch (format) {
      case 'decimal':
        return String(num)
      case 'decimalZero':
        return num < 10 ? `0${num}` : String(num)
      case 'lowerLetter':
        return this.toLetters(num, false)
      case 'upperLetter':
        return this.toLetters(num, true)
      case 'lowerRoman':
        return this.toRoman(num).toLowerCase()
      case 'upperRoman':
        return this.toRoman(num)
      case 'chineseCountingThousand':
      case 'chineseCounting':
        return this.toChinese(num)
      case 'ideographTraditional':
        return this.toChineseTraditional(num)
      case 'bullet':
        return '•'
      default:
        return String(num)
    }
  }

  /**
   * 数字转字母
   */
  private toLetters(num: number, upper: boolean): string {
    const base = upper ? 65 : 97 // A or a
    let result = ''
    while (num > 0) {
      num--
      result = String.fromCharCode(base + (num % 26)) + result
      num = Math.floor(num / 26)
    }
    return result
  }

  /**
   * 数字转罗马数字
   */
  private toRoman(num: number): string {
    const romanNumerals: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ]
    let result = ''
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol
        num -= value
      }
    }
    return result
  }

  /**
   * 数字转中文数字
   */
  private toChinese(num: number): string {
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const units = ['', '十', '百', '千', '万']
    
    if (num <= 10) {
      return num === 10 ? '十' : digits[num]
    }
    
    let result = ''
    let unitIndex = 0
    while (num > 0) {
      const digit = num % 10
      if (digit !== 0) {
        result = digits[digit] + units[unitIndex] + result
      } else if (result && !result.startsWith('零')) {
        result = '零' + result
      }
      num = Math.floor(num / 10)
      unitIndex++
    }
    
    // 处理 "一十" -> "十"
    if (result.startsWith('一十')) {
      result = result.substring(1)
    }
    
    return result
  }

  /**
   * 数字转中文传统数字（甲乙丙丁...）
   */
  private toChineseTraditional(num: number): string {
    const traditional = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    if (num >= 1 && num <= 10) {
      return traditional[num - 1]
    }
    return String(num)
  }

  /**
   * 创建评论气泡
   */
  private createCommentBubble(comment: ICommentElement): HTMLElement {
    const bubble = this.createElement('div', `${this.classPrefix}-comment-bubble`)
    bubble.dataset.commentId = comment.id
    
    const initials = comment.initials || comment.author.charAt(0).toUpperCase()
    const date = this.formatDate(comment.date)
    const content = this.getCommentText(comment)
    
    // 构建操作按钮
    const hasActions = this.options.enableCommentEdit || this.options.onCommentAccept || this.options.onCommentReject
    const actionsHtml = hasActions ? `
      <div class="${this.classPrefix}-comment-actions">
        ${this.options.onCommentAccept ? `
          <button class="${this.classPrefix}-comment-btn accept" title="接受建议">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </button>
        ` : ''}
        ${this.options.onCommentReject ? `
          <button class="${this.classPrefix}-comment-btn reject" title="拒绝建议">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        ` : ''}
        ${this.options.enableCommentEdit ? `
          <button class="${this.classPrefix}-comment-btn edit" title="编辑">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="${this.classPrefix}-comment-btn delete" title="删除">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        ` : ''}
      </div>
    ` : ''
    
    bubble.innerHTML = `
      <div class="${this.classPrefix}-comment-header">
        <div class="${this.classPrefix}-comment-avatar">${this.escapeHtml(initials)}</div>
        <div class="${this.classPrefix}-comment-meta">
          <span class="${this.classPrefix}-comment-author">${this.escapeHtml(comment.author)}</span>
          <span class="${this.classPrefix}-comment-date">${date}</span>
        </div>
      </div>
      <div class="${this.classPrefix}-comment-content">${this.escapeHtml(content)}</div>
      ${actionsHtml}
    `
    
    // 绑定事件
    bubble.addEventListener('mouseenter', () => this.highlightComment(comment.id))
    bubble.addEventListener('mouseleave', () => this.unhighlightComment(comment.id))
    bubble.addEventListener('click', () => {
      this.selectComment(comment.id)
      this.options.onCommentClick(comment)
    })
    
    // 接受按钮
    const acceptBtn = bubble.querySelector('.accept')
    acceptBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      this.options.onCommentAccept?.(comment)
    })
    
    // 拒绝按钮
    const rejectBtn = bubble.querySelector('.reject')
    rejectBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      this.options.onCommentReject?.(comment)
    })
    
    // 编辑按钮
    const editBtn = bubble.querySelector('.edit')
    editBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      this.editComment(comment)
    })
    
    // 删除按钮
    const deleteBtn = bubble.querySelector('.delete')
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      this.deleteComment(comment.id)
    })
    
    return bubble
  }

  /**
   * 获取评论文本内容
   */
  private getCommentText(comment: ICommentElement): string {
    const texts: string[] = []
    const extractText = (elements: IOpenXmlElement[]) => {
      for (const el of elements) {
        if (el.type === DomType.Text) {
          texts.push((el as ITextElement).text)
        }
        if (el.children) {
          extractText(el.children)
        }
      }
    }
    extractText(comment.children || [])
    
    const result = texts.join('')
    
    // 如果递归提取失败，使用原始文本作为备用
    if (!result && comment.rawText) {
      console.log('[DEBUG] Comment', comment.id, 'using rawText:', comment.rawText)
      return comment.rawText
    }
    
    console.log('[DEBUG] Comment', comment.id, 'text result:', result)
    return result || ''
  }

  /**
   * 高亮评论
   */
  private highlightComment(commentId: string): void {
    this.activeCommentId = commentId
    
    const range = this.commentRanges.get(commentId)
    if (range) {
      range.highlightElements.forEach(el => {
        el.classList.add(`${this.classPrefix}-highlight--active`)
      })
      range.panelElement?.classList.add(`${this.classPrefix}-comment-bubble--active`)
    }
    
    this.updateLines()
  }

  /**
   * 取消高亮评论
   */
  private unhighlightComment(commentId: string): void {
    if (this.activeCommentId === commentId) {
      this.activeCommentId = null
    }
    
    const range = this.commentRanges.get(commentId)
    if (range) {
      range.highlightElements.forEach(el => {
        el.classList.remove(`${this.classPrefix}-highlight--active`)
      })
      range.panelElement?.classList.remove(`${this.classPrefix}-comment-bubble--active`)
    }
    
    this.updateLines()
  }

  /**
   * 选中评论
   */
  private selectComment(commentId: string): void {
    this.activeCommentId = commentId
    this.updateLines()
  }

  /**
   * 编辑评论
   */
  private editComment(comment: ICommentElement): void {
    const currentText = this.getCommentText(comment)
    const newText = prompt('编辑评论:', currentText)
    
    if (newText !== null && newText !== currentText) {
      // 更新评论内容
      const textEl: ITextElement = { type: DomType.Text, text: newText }
      const runEl: IRunElement = { type: DomType.Run, children: [textEl] }
      const paraEl: IParagraphElement = { type: DomType.Paragraph, children: [runEl] }
      comment.children = [paraEl]
      
      // 更新 UI
      const range = this.commentRanges.get(comment.id)
      if (range?.panelElement) {
        const contentEl = range.panelElement.querySelector(`.${this.classPrefix}-comment-content`)
        if (contentEl) {
          contentEl.textContent = newText
        }
      }
      
      this.options.onCommentChange(comment, 'update')
    }
  }

  /**
   * 删除评论
   */
  private deleteComment(commentId: string): void {
    if (!confirm('确定要删除这条评论吗？')) return
    
    const comment = this.document?.commentMap.get(commentId)
    if (!comment) return
    
    // 移除高亮
    const range = this.commentRanges.get(commentId)
    if (range) {
      range.highlightElements.forEach(el => {
        el.classList.remove(`${this.classPrefix}-highlight`)
        el.classList.remove(`${this.classPrefix}-highlight--active`)
      })
      range.panelElement?.remove()
    }
    
    // 从文档中移除
    if (this.document) {
      const index = this.document.comments.indexOf(comment)
      if (index > -1) {
        this.document.comments.splice(index, 1)
      }
      this.document.commentMap.delete(commentId)
    }
    
    this.commentRanges.delete(commentId)
    this.options.onCommentChange(comment, 'delete')
    this.updateLines()
  }

  /**
   * 应用段落样式
   */
  private applyParagraphStyles(element: HTMLElement, props: IParagraphProperties): void {
    const styles: string[] = []
    
    if (props.justification) {
      const alignMap: Record<string, string> = {
        left: 'left',
        center: 'center',
        right: 'right',
        both: 'justify',
      }
      styles.push(`text-align: ${alignMap[props.justification] || 'left'}`)
    }
    
    if (props.indentation) {
      if (props.indentation.left) styles.push(`padding-left: ${props.indentation.left}`)
      if (props.indentation.right) styles.push(`padding-right: ${props.indentation.right}`)
      if (props.indentation.firstLine) styles.push(`text-indent: ${props.indentation.firstLine}`)
    }
    
    if (props.spacing) {
      if (props.spacing.before) styles.push(`margin-top: ${props.spacing.before}`)
      if (props.spacing.after) styles.push(`margin-bottom: ${props.spacing.after}`)
      
      // 根据 lineRule 计算行间距
      if (props.spacing.line !== undefined) {
        const line = props.spacing.line
        switch (props.spacing.lineRule) {
          case 'auto':
            // auto: line 值是 240 的倍数（240 = 单倍行距）
            styles.push(`line-height: ${(line / 240).toFixed(2)}`)
            break
          case 'atLeast':
            // atLeast: 最小行高，line 值是 twip（1/20 pt）
            styles.push(`line-height: calc(100% + ${line / 20}pt)`)
            break
          case 'exact':
          default:
            // exact/默认: 精确行高，line 值是 twip
            styles.push(`line-height: ${line / 20}pt`)
            break
        }
      }
    }
    
    if (styles.length > 0) {
      element.style.cssText = styles.join('; ')
    }
  }

  /**
   * 渲染 Run
   */
  private renderRun(element: IRunElement): HTMLElement | null {
    // 如果正在跳过域内容，检查这个 run 是否包含域结束符
    // 如果不包含域结束符，就跳过整个 run
    if (this.skipFieldContent) {
      const hasFieldEnd = (element.children || []).some(
        child => child.type === DomType.ComplexField && 
                 (child as IComplexFieldElement).charType === 'end'
      )
      if (!hasFieldEnd) {
        return null
      }
    }
    
    const span = this.createElement('span', `${this.classPrefix}-run`)
    
    // 如果在评论范围内，添加高亮类
    if (this.currentCommentIds.size > 0) {
      span.classList.add(`${this.classPrefix}-highlight`)
      for (const id of this.currentCommentIds) {
        span.classList.add(`${this.classPrefix}-highlight-${id}`)
        span.dataset.commentId = id
        
        // 记录高亮元素
        const range = this.commentRanges.get(id)
        if (range) {
          range.highlightElements.push(span)
        }
      }
      
      // 点击高亮文字时高亮对应评论
      span.addEventListener('click', () => {
        const id = span.dataset.commentId
        if (id) {
          this.highlightComment(id)
        }
      })
    }
    
    // 应用文本样式
    if (element.props) {
      this.applyRunStyles(span, element.props)
    }
    
    // 渲染子元素
    this.renderChildren(element.children || [], span)
    
    // 如果 span 是空的（所有内容都被跳过了），返回 null
    if (span.childNodes.length === 0) {
      return null
    }
    
    return span
  }

  /**
   * 应用 Run 样式
   */
  private applyRunStyles(element: HTMLElement, props: IRunProperties): void {
    const styles: string[] = []
    
    if (props.bold) styles.push('font-weight: bold')
    if (props.italic) styles.push('font-style: italic')
    
    // 处理下划线和删除线（可以同时存在多种）
    const textDecorations: string[] = []
    if (props.underline && props.underline !== 'none') {
      // 根据下划线样式添加对应的 CSS 类
      element.classList.add(`${this.classPrefix}-underline-${props.underline}`)
      // 对于复杂下划线样式，用 CSS 类处理；对于简单样式，用内联样式
      if (!this.isComplexUnderline(props.underline)) {
        textDecorations.push('underline')
      }
    }
    if (props.strike) {
      textDecorations.push('line-through')
    }
    if (props.dstrike) {
      // 双删除线使用 CSS 类实现
      element.classList.add(`${this.classPrefix}-dstrike`)
    }
    
    if (textDecorations.length > 0) {
      styles.push(`text-decoration: ${textDecorations.join(' ')}`)
    }
    
    // 上标/下标
    if (props.vertAlign) {
      element.classList.add(`${this.classPrefix}-${props.vertAlign}`)
    }
    
    if (props.color) styles.push(`color: ${props.color}`)
    if (props.fontSize) styles.push(`font-size: ${props.fontSize}`)
    if (props.fontFamily) styles.push(`font-family: "${props.fontFamily}"`)
    if (props.highlight) {
      const colorMap: Record<string, string> = {
        yellow: '#ffff00',
        green: '#00ff00',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        blue: '#0000ff',
        red: '#ff0000',
        darkBlue: '#000080',
        darkCyan: '#008080',
        darkGreen: '#008000',
        darkMagenta: '#800080',
        darkRed: '#800000',
        darkYellow: '#808000',
        darkGray: '#808080',
        lightGray: '#c0c0c0',
        black: '#000000',
      }
      styles.push(`background-color: ${colorMap[props.highlight] || props.highlight}`)
    }
    
    if (styles.length > 0) {
      element.style.cssText = styles.join('; ')
    }
  }

  /**
   * 检查是否是复杂下划线样式（需要特殊 CSS 处理）
   */
  private isComplexUnderline(style: TUnderlineStyle): boolean {
    const complexStyles = [
      'double', 'thick', 'dotted', 'dottedHeavy', 
      'dash', 'dashedHeavy', 'dashLong', 'dashLongHeavy',
      'dotDash', 'dashDotHeavy', 'dotDotDash', 'dashDotDotHeavy',
      'wave', 'wavyHeavy', 'wavyDouble'
    ]
    return complexStyles.includes(style)
  }

  /**
   * 渲染文本
   */
  private renderText(element: ITextElement): HTMLElement | null {
    // 如果在跳过域内容模式，不渲染文本
    if (this.skipFieldContent) {
      return null
    }
    const span = document.createElement('span')
    span.textContent = element.text
    return span
  }

  /**
   * 渲染换行
   */
  private renderBreak(element: IBreakElement): HTMLElement {
    switch (element.breakType) {
      case 'page':
      case 'lastRenderedPageBreak':
        const div = this.createElement('div', `${this.classPrefix}-page-break`)
        div.style.pageBreakAfter = 'always'
        return div
      case 'column':
        const colBreak = this.createElement('span', `${this.classPrefix}-column-break`)
        colBreak.style.breakAfter = 'column'
        return colBreak
      default:
        return document.createElement('br')
    }
  }

  /**
   * 渲染 Tab
   */
  private renderTab(): HTMLElement {
    const tab = this.createElement('span', `${this.classPrefix}-tab`)
    tab.innerHTML = '&emsp;' // 使用 em 空格模拟 tab
    return tab
  }

  /**
   * 渲染 Symbol 字符
   * 处理 Word 中的特殊符号字符（如 Wingdings、Symbol 字体中的符号）
   */
  private renderSymbol(element: ISymbolElement): HTMLElement {
    const span = this.createElement('span', `${this.classPrefix}-symbol`)
    
    if (element.font) {
      // 尝试使用原始字体渲染
      span.style.fontFamily = `"${element.font}", "Segoe UI Symbol", "Apple Symbols", sans-serif`
    }
    
    if (element.char) {
      span.textContent = element.char
    } else {
      // 如果没有字符，显示一个占位符
      span.textContent = '□'
    }
    
    return span
  }

  /**
   * 渲染简单域 - 如 PAGE, NUMPAGES 等
   */
  private renderSimpleField(element: ISimpleFieldElement): HTMLElement | null {
    const instruction = element.instruction.trim().toUpperCase()
    const fieldValue = this.evaluateFieldInstruction(instruction)
    
    if (fieldValue !== null) {
      const span = this.createElement('span', `${this.classPrefix}-field`)
      span.textContent = fieldValue
      return span
    }
    
    // 如果不是我们支持的域，渲染子内容
    const span = this.createElement('span', `${this.classPrefix}-field`)
    this.renderChildren(element.children || [], span)
    return span
  }

  /**
   * 渲染复杂域字符
   */
  private renderComplexField(element: IComplexFieldElement): HTMLElement | null {
    switch (element.charType) {
      case 'begin':
        this.inComplexField = true
        this.skipFieldContent = false
        this.currentFieldInstruction = ''
        return null
      case 'separate':
        // 在 separate 后面的内容是域的显示值（Word 保存的静态值）
        // 如果我们能解析域，就输出我们计算的值并跳过后面的静态内容
        const fieldValue = this.evaluateFieldInstruction(this.currentFieldInstruction.trim().toUpperCase())
        if (fieldValue !== null) {
          this.skipFieldContent = true // 跳过后面的静态内容
          const span = this.createElement('span', `${this.classPrefix}-field`)
          span.textContent = fieldValue
          return span
        }
        return null
      case 'end':
        this.inComplexField = false
        this.skipFieldContent = false
        this.currentFieldInstruction = ''
        return null
      default:
        return null
    }
  }

  /**
   * 渲染域指令
   */
  private renderFieldInstruction(element: IFieldInstructionElement): HTMLElement | null {
    if (this.inComplexField) {
      this.currentFieldInstruction += element.text
    }
    return null // 域指令本身不显示
  }

  /**
   * 计算域值
   */
  private evaluateFieldInstruction(instruction: string): string | null {
    // 解析域指令，提取域类型
    const parts = instruction.split(/\s+/)
    const fieldType = parts[0]
    
    switch (fieldType) {
      case 'PAGE':
        return String(this.currentPageNumber)
      case 'NUMPAGES':
        return String(this.totalPages)
      case 'DATE':
        return new Date().toLocaleDateString('zh-CN')
      case 'TIME':
        return new Date().toLocaleTimeString('zh-CN')
      default:
        return null // 不支持的域类型
    }
  }

  // 表格垂直合并状态
  private tableVerticalMerges: Map<number, HTMLTableCellElement>[] = []
  private currentVerticalMerge: Map<number, HTMLTableCellElement> = new Map()
  private currentCellCol = 0
  
  // 表格边框状态（用于 insideH/insideV 内部边框）
  private currentTableBorders: IBorders | undefined = undefined
  private tableBordersStack: (IBorders | undefined)[] = []
  private currentTableRowIndex = 0
  private currentTableRowCount = 0
  private currentTableColCount = 0

  /**
   * 渲染表格
   */
  private renderTable(element: ITableElement): HTMLElement {
    const table = this.createElement('table', `${this.classPrefix}-table`)
    
    // 保存当前垂直合并状态
    this.tableVerticalMerges.push(this.currentVerticalMerge)
    this.currentVerticalMerge = new Map()
    
    // 保存当前表格边框状态（用于嵌套表格）
    this.tableBordersStack.push(this.currentTableBorders)
    this.currentTableBorders = element.props?.borders
    this.currentTableRowCount = element.children?.length || 0
    this.currentTableColCount = element.columns?.length || 0
    this.currentTableRowIndex = 0
    
    // 渲染列宽度
    if (element.columns && element.columns.length > 0) {
      const colgroup = document.createElement('colgroup')
      for (const col of element.columns) {
        const colEl = document.createElement('col')
        if (col.width) {
          colEl.style.width = col.width
        }
        colgroup.appendChild(colEl)
      }
      table.appendChild(colgroup)
    }
    
    // 应用表格样式（包含边框）
    if (element.props) {
      this.applyTableStyles(table, element.props)
    }
    
    // 渲染表格行
    const tbody = document.createElement('tbody')
    for (const row of element.children || []) {
      this.currentCellCol = 0
      const tr = this.renderTableRow(row)
      tbody.appendChild(tr)
      this.currentTableRowIndex++
    }
    table.appendChild(tbody)
    
    // 恢复垂直合并状态
    this.currentVerticalMerge = this.tableVerticalMerges.pop() || new Map()
    
    // 恢复表格边框状态
    this.currentTableBorders = this.tableBordersStack.pop()
    
    return table
  }

  /**
   * 应用表格样式
   */
  private applyTableStyles(table: HTMLElement, props: ITableProperties): void {
    if (props.width) {
      if (props.widthType === 'pct') {
        table.style.width = props.width
      } else {
        table.style.width = props.width
      }
    }
    
    if (props.justification === 'center') {
      table.style.marginLeft = 'auto'
      table.style.marginRight = 'auto'
    }
    
    // 应用单元格间距
    if (props.cellSpacing) {
      table.style.borderSpacing = props.cellSpacing
      table.style.borderCollapse = 'separate'
    }
  }

  /**
   * 将边框属性转换为 CSS 字符串
   */
  private borderToCss(border: IBorder | undefined): string {
    if (!border || !border.style) {
      return 'none'
    }
    
    // 转换 Word 边框类型到 CSS 边框类型
    const cssStyle = this.parseBorderType(border.style)
    
    if (cssStyle === 'none') {
      return 'none'
    }
    
    const width = border.width || '1px'
    const color = border.color || 'black'
    
    return `${width} ${cssStyle} ${color}`
  }

  /**
   * 将 Word 边框类型转换为 CSS 边框样式
   */
  private parseBorderType(type: string | undefined): string {
    switch (type) {
      case 'single':
        return 'solid'
      case 'dashDotStroked':
        return 'solid'
      case 'dashed':
        return 'dashed'
      case 'dashSmallGap':
        return 'dashed'
      case 'dotDash':
        return 'dotted'
      case 'dotDotDash':
        return 'dotted'
      case 'dotted':
        return 'dotted'
      case 'double':
        return 'double'
      case 'doubleWave':
        return 'double'
      case 'inset':
        return 'inset'
      case 'nil':
        return 'none'
      case 'none':
        return 'none'
      case 'outset':
        return 'outset'
      case 'thick':
        return 'solid'
      case 'thickThinLargeGap':
        return 'solid'
      case 'thickThinMediumGap':
        return 'solid'
      case 'thickThinSmallGap':
        return 'solid'
      case 'thinThickLargeGap':
        return 'solid'
      case 'thinThickMediumGap':
        return 'solid'
      case 'thinThickSmallGap':
        return 'solid'
      case 'thinThickThinLargeGap':
        return 'solid'
      case 'thinThickThinMediumGap':
        return 'solid'
      case 'thinThickThinSmallGap':
        return 'solid'
      case 'threeDEmboss':
        return 'solid'
      case 'threeDEngrave':
        return 'solid'
      case 'triple':
        return 'double'
      case 'wave':
        return 'solid'
      default:
        return 'solid'
    }
  }

  /**
   * 应用单元格边框样式
   */
  private applyCellBorders(
    td: HTMLElement,
    cellBorders: IBorders | undefined,
    rowIndex: number,
    colIndex: number,
    colSpan: number
  ): void {
    const tableBorders = this.currentTableBorders
    const isFirstRow = rowIndex === 0
    const isLastRow = rowIndex === this.currentTableRowCount - 1
    const isFirstCol = colIndex === 0
    const isLastCol = colIndex + colSpan >= this.currentTableColCount
    
    // 优先使用单元格自身边框，其次使用表格边框
    // Top border
    let topBorder = cellBorders?.top
    if (!topBorder) {
      if (isFirstRow) {
        topBorder = tableBorders?.top
      } else {
        topBorder = tableBorders?.insideH
      }
    }
    if (topBorder) {
      td.style.borderTop = this.borderToCss(topBorder)
    }
    
    // Bottom border
    let bottomBorder = cellBorders?.bottom
    if (!bottomBorder) {
      if (isLastRow) {
        bottomBorder = tableBorders?.bottom
      } else {
        bottomBorder = tableBorders?.insideH
      }
    }
    if (bottomBorder) {
      td.style.borderBottom = this.borderToCss(bottomBorder)
    }
    
    // Left border
    let leftBorder = cellBorders?.left
    if (!leftBorder) {
      if (isFirstCol) {
        leftBorder = tableBorders?.left
      } else {
        leftBorder = tableBorders?.insideV
      }
    }
    if (leftBorder) {
      td.style.borderLeft = this.borderToCss(leftBorder)
    }
    
    // Right border
    let rightBorder = cellBorders?.right
    if (!rightBorder) {
      if (isLastCol) {
        rightBorder = tableBorders?.right
      } else {
        rightBorder = tableBorders?.insideV
      }
    }
    if (rightBorder) {
      td.style.borderRight = this.borderToCss(rightBorder)
    }
  }

  /**
   * 渲染表格行
   */
  private renderTableRow(element: ITableRowElement): HTMLElement {
    const tr = this.createElement('tr', `${this.classPrefix}-tr`)
    this.currentCellCol = 0
    
    for (const cell of element.children || []) {
      const td = this.renderTableCell(cell)
      if (td) {
        tr.appendChild(td)
      }
    }
    
    return tr
  }

  /**
   * 渲染表格单元格
   */
  private renderTableCell(element: ITableCellElement): HTMLElement | null {
    const td = this.createElement('td', `${this.classPrefix}-td`) as HTMLTableCellElement
    
    const props = element.props
    const colKey = this.currentCellCol
    const colSpan = props?.gridSpan || 1
    
    // 处理垂直合并
    if (props?.verticalMerge) {
      if (props.verticalMerge === 'restart') {
        // 开始新的垂直合并
        this.currentVerticalMerge.set(colKey, td)
        td.rowSpan = 1
      } else {
        // 继续垂直合并
        const mergeCell = this.currentVerticalMerge.get(colKey)
        if (mergeCell) {
          mergeCell.rowSpan += 1
          this.currentCellCol += colSpan
          return null // 不渲染这个单元格
        }
      }
    } else {
      // 清除垂直合并状态
      this.currentVerticalMerge.delete(colKey)
    }
    
    // 应用单元格样式
    if (props) {
      if (props.width) {
        td.style.width = props.width
      }
      if (props.verticalAlign) {
        td.style.verticalAlign = props.verticalAlign
      }
      if (props.shading) {
        td.style.backgroundColor = props.shading
      }
      if (colSpan > 1) {
        td.colSpan = colSpan
      }
    }
    
    // 应用单元格边框（优先使用单元格边框，其次使用表格边框）
    this.applyCellBorders(
      td,
      props?.borders,
      this.currentTableRowIndex,
      colKey,
      colSpan
    )
    
    // 渲染内容
    this.renderChildren(element.children || [], td)
    
    // 更新列位置
    this.currentCellCol += colSpan
    
    return td
  }

  /**
   * 渲染超链接
   */
  private renderHyperlink(element: IHyperlinkElement): HTMLElement {
    const a = document.createElement('a')
    a.className = `${this.classPrefix}-link`
    
    if (element.href) {
      a.href = element.href
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    } else if (element.anchor) {
      a.href = `#${element.anchor}`
    }
    
    this.renderChildren(element.children || [], a)
    return a
  }

  /**
   * 渲染绘图
   */
  private renderDrawing(element: IDrawingElement): HTMLElement {
    const span = this.createElement('span', `${this.classPrefix}-drawing`)
    this.renderChildren(element.children || [], span)
    return span
  }

  /**
   * 渲染图片
   */
  private renderImage(element: IImageElement): HTMLElement {
    const img = document.createElement('img') as HTMLImageElement
    img.className = `${this.classPrefix}-image`
    img.src = element.src
    
    if (element.width) img.style.width = element.width
    if (element.height) img.style.height = element.height
    if (element.alt) img.alt = element.alt
    
    return img
  }

  /**
   * 渲染评论范围开始
   */
  private renderCommentRangeStart(element: ICommentRangeStart): HTMLElement {
    this.currentCommentIds.add(element.id)
    this.commentStartInParagraph.add(element.id) // 记录这个评论在当前段落开始
    
    const marker = this.createElement('span', `${this.classPrefix}-comment-start`)
    marker.dataset.commentId = element.id
    
    const range = this.commentRanges.get(element.id)
    if (range) {
      range.startElement = marker
    }
    
    return marker
  }

  /**
   * 渲染评论范围结束
   */
  private renderCommentRangeEnd(element: ICommentRangeEnd): HTMLElement {
    this.currentCommentIds.delete(element.id)
    
    const marker = this.createElement('span', `${this.classPrefix}-comment-end`)
    marker.dataset.commentId = element.id
    
    const range = this.commentRanges.get(element.id)
    if (range) {
      range.endElement = marker
    }
    
    return marker
  }

  /**
   * 渲染评论引用
   */
  private renderCommentReference(element: ICommentReference): HTMLElement {
    const marker = this.createElement('span', `${this.classPrefix}-comment-ref`)
    marker.dataset.commentId = element.id
    marker.textContent = '📝'
    marker.title = '查看评论'
    
    marker.addEventListener('click', () => {
      this.highlightComment(element.id)
    })
    
    return marker
  }

  /**
   * 渲染书签开始标记
   * 创建一个锚点元素，供超链接跳转使用
   */
  private renderBookmarkStart(element: IBookmarkStartElement): HTMLElement {
    // 忽略以 _ 开头的内置书签（如 _GoBack）
    if (element.name.startsWith('_')) {
      const empty = this.createElement('span')
      return empty
    }
    
    const anchor = this.createElement('span', `${this.classPrefix}-bookmark`)
    // 设置 id 属性，用于超链接跳转（href="#bookmarkName"）
    anchor.id = element.name
    anchor.dataset.bookmarkId = element.id
    anchor.dataset.bookmarkName = element.name
    
    return anchor
  }

  /**
   * 渲染书签结束标记
   * 书签结束标记不需要渲染任何可见内容
   */
  private renderBookmarkEnd(_element: IBookmarkEndElement): HTMLElement {
    // 返回一个空的 span，不影响文档结构
    return this.createElement('span')
  }

  /**
   * 渲染脚注引用（文档正文中的上标数字）
   */
  private renderFootnoteReference(element: IFootnoteReference): HTMLElement {
    this.footnoteCounter++
    this.currentFootnoteIds.push(element.id)
    
    const sup = this.createElement('sup', `${this.classPrefix}-footnote-ref`)
    sup.dataset.footnoteId = element.id
    sup.textContent = String(this.footnoteCounter)
    sup.title = '脚注'
    
    // 点击跳转到脚注
    sup.addEventListener('click', () => {
      const footnoteEl = document.getElementById(`${this.classPrefix}-footnote-${element.id}`)
      footnoteEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    
    return sup
  }

  /**
   * 渲染尾注引用（文档正文中的上标数字）
   */
  private renderEndnoteReference(element: IEndnoteReference): HTMLElement {
    this.endnoteCounter++
    this.currentEndnoteIds.push(element.id)
    
    const sup = this.createElement('sup', `${this.classPrefix}-endnote-ref`)
    sup.dataset.endnoteId = element.id
    sup.textContent = String(this.endnoteCounter)
    sup.title = '尾注'
    
    // 点击跳转到尾注
    sup.addEventListener('click', () => {
      const endnoteEl = document.getElementById(`${this.classPrefix}-endnote-${element.id}`)
      endnoteEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    
    return sup
  }

  /**
   * 渲染脚注内容
   */
  private renderFootnote(element: IFootnoteElement): HTMLElement {
    const li = this.createElement('li', `${this.classPrefix}-footnote`)
    li.id = `${this.classPrefix}-footnote-${element.id}`
    li.dataset.footnoteId = element.id
    
    this.renderChildren(element.children || [], li)
    
    return li
  }

  /**
   * 渲染尾注内容
   */
  private renderEndnote(element: IEndnoteElement): HTMLElement {
    const li = this.createElement('li', `${this.classPrefix}-endnote`)
    li.id = `${this.classPrefix}-endnote-${element.id}`
    li.dataset.endnoteId = element.id
    
    this.renderChildren(element.children || [], li)
    
    return li
  }

  /**
   * 渲染页面脚注区域
   */
  private renderPageFootnotes(footnoteIds: string[], container: HTMLElement): void {
    if (footnoteIds.length === 0 || !this.document?.footnotes) return
    
    const footnotesSection = this.createElement('div', `${this.classPrefix}-footnotes-section`)
    
    // 分隔线
    const separator = this.createElement('hr', `${this.classPrefix}-footnotes-separator`)
    footnotesSection.appendChild(separator)
    
    // 脚注列表
    const ol = this.createElement('ol', `${this.classPrefix}-footnotes-list`)
    
    for (const id of footnoteIds) {
      const footnote = this.document.footnotes.get(id)
      if (footnote) {
        const rendered = this.renderFootnote(footnote)
        ol.appendChild(rendered)
      }
    }
    
    footnotesSection.appendChild(ol)
    container.appendChild(footnotesSection)
  }

  /**
   * 渲染文档尾注区域
   */
  private renderDocumentEndnotes(wrapper: HTMLElement): void {
    if (this.currentEndnoteIds.length === 0 || !this.document?.endnotes) return
    
    const endnotesSection = this.createElement('div', `${this.classPrefix}-endnotes-section`)
    
    // 标题
    const title = this.createElement('h3', `${this.classPrefix}-endnotes-title`)
    title.textContent = '尾注'
    endnotesSection.appendChild(title)
    
    // 尾注列表
    const ol = this.createElement('ol', `${this.classPrefix}-endnotes-list`)
    
    for (const id of this.currentEndnoteIds) {
      const endnote = this.document.endnotes.get(id)
      if (endnote) {
        const rendered = this.renderEndnote(endnote)
        ol.appendChild(rendered)
      }
    }
    
    endnotesSection.appendChild(ol)
    wrapper.appendChild(endnotesSection)
  }

  /**
   * 渲染子元素
   */
  private renderChildren(children: IOpenXmlElement[], parent: HTMLElement): void {
    for (const child of children) {
      const rendered = this.renderElement(child)
      if (rendered) {
        parent.appendChild(rendered)
      }
    }
  }

  /**
   * 创建元素
   */
  private createElement(tag: string, className?: string): HTMLElement {
    const el = document.createElement(tag)
    if (className) {
      el.className = className
    }
    return el
  }

  /**
   * 格式化日期
   */
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  /**
   * 转义 HTML
   */
  private escapeHtml(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  /**
   * 获取文档对象
   */
  getDocument(): IDocxDocument | null {
    return this.document
  }
}
