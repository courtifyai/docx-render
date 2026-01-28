/**
 * DOCX 渲染器类型定义
 * 参考 docx-preview 架构，定义 DOCX 文档的数据模型
 */

// ==================== DOM 元素类型 ====================

export enum DomType {
  Document = 'document',
  Paragraph = 'paragraph',
  Run = 'run',
  Text = 'text',
  Break = 'break',
  Table = 'table',
  TableRow = 'tableRow',
  TableCell = 'tableCell',
  Hyperlink = 'hyperlink',
  Drawing = 'drawing',
  Image = 'image',
  BookmarkStart = 'bookmarkStart',
  BookmarkEnd = 'bookmarkEnd',
  Comment = 'comment',
  CommentRangeStart = 'commentRangeStart',
  CommentRangeEnd = 'commentRangeEnd',
  CommentReference = 'commentReference',
  Section = 'section',
  Header = 'header',
  Footer = 'footer',
  Tab = 'tab',
  Symbol = 'symbol',
  // 域相关
  SimpleField = 'simpleField',
  ComplexField = 'complexField',
  FieldInstruction = 'fieldInstruction',
  // 脚注/尾注
  Footnote = 'footnote',
  Endnote = 'endnote',
  FootnoteReference = 'footnoteReference',
  EndnoteReference = 'endnoteReference',
}

// ==================== 基础元素 ====================

export interface IOpenXmlElement {
  type: DomType
  children?: IOpenXmlElement[]
  cssStyle?: Record<string, string>
  className?: string
}

export interface IDocumentElement extends IOpenXmlElement {
  type: DomType.Document
  children: IOpenXmlElement[]
  /** 文档默认 Section 属性 */
  sectionProps?: ISectionProperties
  /** 文档背景样式 */
  background?: Record<string, string>
}

// ==================== 段落和文本 ====================

export interface IParagraphElement extends IOpenXmlElement {
  type: DomType.Paragraph
  props?: IParagraphProperties
  children: IOpenXmlElement[]
}

export interface IRunElement extends IOpenXmlElement {
  type: DomType.Run
  props?: IRunProperties
  children: IOpenXmlElement[]
}

export interface ITextElement extends IOpenXmlElement {
  type: DomType.Text
  text: string
}

export interface IBreakElement extends IOpenXmlElement {
  type: DomType.Break
  breakType?: 'page' | 'column' | 'line' | 'textWrapping' | 'lastRenderedPageBreak'
}

export interface ITabElement extends IOpenXmlElement {
  type: DomType.Tab
}

export interface ISymbolElement extends IOpenXmlElement {
  type: DomType.Symbol
  font?: string
  char?: string
}

// ==================== 域（Fields） ====================

/**
 * 简单域 - 如 <w:fldSimple w:instr="PAGE">
 */
export interface ISimpleFieldElement extends IOpenXmlElement {
  type: DomType.SimpleField
  instruction: string
  children: IOpenXmlElement[]
}

/**
 * 复杂域字符 - 如 <w:fldChar w:fldCharType="begin"/>
 */
export interface IComplexFieldElement extends IOpenXmlElement {
  type: DomType.ComplexField
  charType: 'begin' | 'end' | 'separate' | string
}

/**
 * 域指令 - 如 <w:instrText>PAGE</w:instrText>
 */
export interface IFieldInstructionElement extends IOpenXmlElement {
  type: DomType.FieldInstruction
  text: string
}

// ==================== 表格 ====================

export interface ITableElement extends IOpenXmlElement {
  type: DomType.Table
  props?: ITableProperties
  columns?: ITableColumn[]
  children: ITableRowElement[]
}

export interface ITableColumn {
  width?: string
}

export interface ITableRowElement extends IOpenXmlElement {
  type: DomType.TableRow
  props?: ITableRowProperties
  children: ITableCellElement[]
}

export interface ITableCellElement extends IOpenXmlElement {
  type: DomType.TableCell
  props?: ITableCellProperties
  children: IOpenXmlElement[]
}

// ==================== 评论相关 ====================

export interface ICommentElement extends IOpenXmlElement {
  type: DomType.Comment
  id: string
  author: string
  date: string
  initials?: string
  children: IOpenXmlElement[]
  rawText?: string // 原始文本内容，作为备用
  /** 段落 ID（用于关联 commentsExtended） */
  paraId?: string
  /** 父评论 ID（回复链） */
  parentId?: string
  /** 子评论列表（回复） */
  replies?: ICommentElement[]
  /** 是否已完成/解决 */
  done?: boolean
}

export interface ICommentRangeStart extends IOpenXmlElement {
  type: DomType.CommentRangeStart
  id: string
}

export interface ICommentRangeEnd extends IOpenXmlElement {
  type: DomType.CommentRangeEnd
  id: string
}

export interface ICommentReference extends IOpenXmlElement {
  type: DomType.CommentReference
  id: string
}

// ==================== 评论扩展（回复链） ====================

/**
 * 扩展评论信息
 * 对应 word/commentsExtended.xml 中的 <w15:commentEx> 元素
 */
export interface ICommentExtended {
  /** 段落 ID（关联评论内容） */
  paraId: string
  /** 父段落 ID（形成回复链） */
  paraIdParent?: string
  /** 是否已完成/解决 */
  done: boolean
}

// ==================== 图片和绘图 ====================

export interface IDrawingElement extends IOpenXmlElement {
  type: DomType.Drawing
  children: IOpenXmlElement[]
}

export interface IImageElement extends IOpenXmlElement {
  type: DomType.Image
  src: string
  width?: string
  height?: string
  alt?: string
}

// ==================== 脚注/尾注 ====================

/**
 * 脚注元素
 * 对应 word/footnotes.xml 中的 <w:footnote>
 */
export interface IFootnoteElement extends IOpenXmlElement {
  type: DomType.Footnote
  /** 脚注 ID */
  id: string
  /** 脚注类型：normal | separator | continuationSeparator */
  noteType?: string
  /** 脚注内容 */
  children: IOpenXmlElement[]
}

/**
 * 尾注元素
 * 对应 word/endnotes.xml 中的 <w:endnote>
 */
export interface IEndnoteElement extends IOpenXmlElement {
  type: DomType.Endnote
  /** 尾注 ID */
  id: string
  /** 尾注类型：normal | separator | continuationSeparator */
  noteType?: string
  /** 尾注内容 */
  children: IOpenXmlElement[]
}

/**
 * 脚注引用
 * 文档正文中引用脚注的元素，渲染为上标数字
 */
export interface IFootnoteReference extends IOpenXmlElement {
  type: DomType.FootnoteReference
  /** 引用的脚注 ID */
  id: string
}

/**
 * 尾注引用
 * 文档正文中引用尾注的元素，渲染为上标数字
 */
export interface IEndnoteReference extends IOpenXmlElement {
  type: DomType.EndnoteReference
  /** 引用的尾注 ID */
  id: string
}

// ==================== 书签 ====================

/**
 * 书签开始标记
 * 对应 <w:bookmarkStart> 元素
 */
export interface IBookmarkStartElement extends IOpenXmlElement {
  type: DomType.BookmarkStart
  /** 书签 ID（用于匹配 bookmarkEnd） */
  id: string
  /** 书签名称（用于超链接跳转） */
  name: string
  /** 表格中的起始列（可选） */
  colFirst?: number
  /** 表格中的结束列（可选） */
  colLast?: number
}

/**
 * 书签结束标记
 * 对应 <w:bookmarkEnd> 元素
 */
export interface IBookmarkEndElement extends IOpenXmlElement {
  type: DomType.BookmarkEnd
  /** 书签 ID（用于匹配 bookmarkStart） */
  id: string
}

// ==================== 超链接 ====================

export interface IHyperlinkElement extends IOpenXmlElement {
  type: DomType.Hyperlink
  href?: string
  anchor?: string
  children: IOpenXmlElement[]
}

// ==================== 节（Section）相关 ====================

export enum SectionType {
  Continuous = 'continuous',
  NextPage = 'nextPage',
  NextColumn = 'nextColumn',
  EvenPage = 'evenPage',
  OddPage = 'oddPage',
}

export interface IPageSize {
  width?: string
  height?: string
  orientation?: 'portrait' | 'landscape'
}

export interface IPageMargins {
  top?: string
  right?: string
  bottom?: string
  left?: string
  header?: string
  footer?: string
  gutter?: string
}

export interface IPageNumber {
  start?: number
  format?: 'decimal' | 'lowerRoman' | 'upperRoman' | 'lowerLetter' | 'upperLetter' | string
  chapSep?: string
  chapStyle?: string
}

export interface IColumns {
  numberOfColumns?: number
  space?: string
  separator?: boolean
  equalWidth?: boolean
  columns?: IColumn[]
}

export interface IColumn {
  width?: string
  space?: string
}

export interface IHeaderFooterReference {
  id: string
  type: 'default' | 'first' | 'even'
}

export interface ISectionProperties {
  type?: SectionType | string
  pageSize?: IPageSize
  pageMargins?: IPageMargins
  pageNumber?: IPageNumber
  pageBorders?: IBorders
  columns?: IColumns
  headerRefs?: IHeaderFooterReference[]
  footerRefs?: IHeaderFooterReference[]
  titlePage?: boolean
}

export interface IHeaderElement extends IOpenXmlElement {
  type: DomType.Header
  children: IOpenXmlElement[]
}

export interface IFooterElement extends IOpenXmlElement {
  type: DomType.Footer
  children: IOpenXmlElement[]
}

// ==================== 样式属性 ====================

export interface IParagraphProperties {
  styleId?: string
  justification?: 'left' | 'center' | 'right' | 'both'
  indentation?: {
    left?: string
    right?: string
    firstLine?: string
    hanging?: string
  }
  spacing?: {
    before?: string
    after?: string
    /** 行间距原始值（twip 单位），需配合 lineRule 解析 */
    line?: number
    /** 行间距规则：auto=倍数行距, atLeast=最小行高, exact=精确行高 */
    lineRule?: 'auto' | 'atLeast' | 'exact'
  }
  outlineLevel?: number
  /** @deprecated 使用 numbering 替代 */
  numberingId?: string
  /** @deprecated 使用 numbering 替代 */
  numberingLevel?: number
  /** 编号信息 */
  numbering?: IParagraphNumbering
  /** 段前分页 */
  pageBreakBefore?: boolean
  /** 段落所属 Section 属性（分节符） */
  sectionProps?: ISectionProperties
  /** 边框 */
  borders?: IBorders
}

export interface IRunProperties {
  styleId?: string
  bold?: boolean
  italic?: boolean
  /** 下划线样式 */
  underline?: TUnderlineStyle
  /** 单删除线 */
  strike?: boolean
  /** 双删除线 */
  dstrike?: boolean
  color?: string
  /** 主题颜色引用 */
  themeColor?: IThemeColorRef
  fontSize?: string
  fontFamily?: string
  /** 主题字体引用：major（标题）或 minor（正文） */
  themeFontFamily?: 'major' | 'minor'
  highlight?: string
  /** 上标/下标 */
  vertAlign?: 'superscript' | 'subscript'
}

/**
 * 下划线样式类型
 * 对应 OOXML 的 w:u@val 属性值
 */
export type TUnderlineStyle =
  | 'single'       // 单线
  | 'words'        // 仅文字（词之间无下划线）
  | 'double'       // 双线
  | 'thick'        // 粗线
  | 'dotted'       // 点线
  | 'dottedHeavy'  // 粗点线
  | 'dash'         // 虚线
  | 'dashedHeavy'  // 粗虚线
  | 'dashLong'     // 长虚线
  | 'dashLongHeavy'// 粗长虚线
  | 'dotDash'      // 点划线
  | 'dashDotHeavy' // 粗点划线
  | 'dotDotDash'   // 双点划线
  | 'dashDotDotHeavy' // 粗双点划线
  | 'wave'         // 波浪线
  | 'wavyHeavy'    // 粗波浪线
  | 'wavyDouble'   // 双波浪线
  | 'none'         // 无下划线
  | string         // 其他自定义值

export interface ITableProperties {
  width?: string
  widthType?: 'auto' | 'dxa' | 'pct'
  justification?: string
  borders?: IBorders
  cellMargin?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  cellSpacing?: string
}

export interface ITableRowProperties {
  height?: string
  isHeader?: boolean
}

export interface ITableCellProperties {
  width?: string
  verticalAlign?: string
  gridSpan?: number
  verticalMerge?: 'restart' | 'continue'
  borders?: IBorders
  shading?: string
}

export interface IBorders {
  top?: IBorder
  bottom?: IBorder
  left?: IBorder
  right?: IBorder
  /** 表格内部水平边框（单元格之间的水平线） */
  insideH?: IBorder
  /** 表格内部垂直边框（单元格之间的垂直线） */
  insideV?: IBorder
}

export interface IBorder {
  /** 边框样式：single, dashed, dotted, double, nil, none 等 */
  style?: string
  /** 边框宽度（CSS 单位） */
  width?: string
  /** 边框颜色（#RRGGBB 格式） */
  color?: string
}

// ==================== 文档结构 ====================

export interface IDocxDocument {
  /** 文档主体内容 */
  body: IDocumentElement
  /** 评论列表（包含回复链结构） */
  comments: ICommentElement[]
  /** 评论 Map（id -> comment） */
  commentMap: Map<string, ICommentElement>
  /** 顶级评论列表（不包含回复，回复在各自的 replies 数组中） */
  rootComments: ICommentElement[]
  /** 扩展评论 Map（paraId -> ICommentExtended） */
  commentsExtendedMap: Map<string, ICommentExtended>
  /** 样式定义 */
  styles: IStyleDefinition[]
  /** 样式 Map（styleId -> style）*/
  styleMap: Map<string, IStyleDefinition>
  /** 编号定义（numId -> INumberingDefinition） */
  numberings: INumberingDefinition[]
  /** 编号 Map（numId -> INumberingDefinition） */
  numberingMap: Map<string, INumberingDefinition>
  /** 抽象编号定义 */
  abstractNumberings: IAbstractNumbering[]
  /** 图片资源 */
  images: Map<string, string>
  /** 关系 */
  relationships: IRelationship[]
  /** 页眉（relationshipId -> IHeaderElement） */
  headers: Map<string, IHeaderElement>
  /** 页脚（relationshipId -> IFooterElement） */
  footers: Map<string, IFooterElement>
  /** 主题 */
  theme?: ITheme
  /** 脚注（id -> IFootnoteElement） */
  footnotes: Map<string, IFootnoteElement>
  /** 尾注（id -> IEndnoteElement） */
  endnotes: Map<string, IEndnoteElement>
  /** 字体表 */
  fontTable?: IFontTable
  /** 已加载的嵌入字体 */
  embeddedFonts: ILoadedEmbedFont[]
  /** 书签（name -> IBookmarkStartElement） */
  bookmarks: Map<string, IBookmarkStartElement>
}

export interface IStyleDefinition {
  id: string
  name?: string
  type: 'paragraph' | 'character' | 'table' | 'numbering'
  basedOn?: string
  paragraphProps?: IParagraphProperties
  runProps?: IRunProperties
}

export interface INumberingDefinition {
  id: string
  abstractNumId: string
  levels: INumberingLevel[]
}

export interface INumberingLevel {
  level: number
  /** 编号格式：decimal, lowerLetter, upperLetter, lowerRoman, upperRoman, bullet 等 */
  format: string
  /** 编号文本模板，如 "%1." "%1.%2." */
  text: string
  /** 起始值 */
  start: number
  /** 后缀类型：tab, space, nothing */
  suffix: string
  paragraphProps?: IParagraphProperties
  runProps?: IRunProperties
  /** 关联的段落样式名 */
  pStyleName?: string
}

/**
 * 抽象编号定义
 */
export interface IAbstractNumbering {
  id: string
  name?: string
  /** 多级列表类型 */
  multiLevelType?: 'singleLevel' | 'multiLevel' | 'hybridMultilevel' | string
  levels: INumberingLevel[]
  /** 编号样式链接 */
  numberingStyleLink?: string
  styleLink?: string
}

/**
 * 段落中的编号引用
 */
export interface IParagraphNumbering {
  /** 编号定义 ID */
  id: string
  /** 编号级别（0-8） */
  level: number
}

export interface IRelationship {
  id: string
  type: string
  target: string
  targetMode?: string
}

// ==================== 主题（Theme） ====================

/**
 * 主题定义
 * 包含颜色方案和字体方案
 */
export interface ITheme {
  /** 颜色方案 */
  colorScheme: IColorScheme
  /** 字体方案 */
  fontScheme: IFontScheme
}

/**
 * 颜色方案
 * 定义主题颜色映射
 */
export interface IColorScheme {
  /** 方案名称 */
  name: string
  /** 颜色映射表 */
  colors: IThemeColors
}

/**
 * 主题颜色映射
 * OOXML 标准定义的 12 种主题颜色
 */
export interface IThemeColors {
  /** 深色 1 (通常为黑色) */
  dk1?: string
  /** 浅色 1 (通常为白色) */
  lt1?: string
  /** 深色 2 */
  dk2?: string
  /** 浅色 2 */
  lt2?: string
  /** 强调色 1 */
  accent1?: string
  /** 强调色 2 */
  accent2?: string
  /** 强调色 3 */
  accent3?: string
  /** 强调色 4 */
  accent4?: string
  /** 强调色 5 */
  accent5?: string
  /** 强调色 6 */
  accent6?: string
  /** 超链接颜色 */
  hlink?: string
  /** 已访问超链接颜色 */
  folHlink?: string
  /** 其他自定义颜色 */
  [key: string]: string | undefined
}

/**
 * 字体方案
 */
export interface IFontScheme {
  /** 方案名称 */
  name: string
  /** 主要字体（标题用） */
  majorFont: IFontInfo
  /** 次要字体（正文用） */
  minorFont: IFontInfo
}

/**
 * 字体信息
 */
export interface IFontInfo {
  /** 拉丁字体 */
  latin?: string
  /** 东亚字体 */
  ea?: string
  /** 复杂文字字体 */
  cs?: string
}

/**
 * 主题颜色引用
 * 在 Run 属性中使用
 */
export interface IThemeColorRef {
  /** 主题颜色名称 */
  themeColor: string
  /** 色调 (0-255, 值越大越亮) */
  themeTint?: number
  /** 阴影 (0-255, 值越大越暗) */
  themeShade?: number
}

// ==================== 渲染器配置 ====================

export interface IRendererOptions {
  /** 渲染容器 */
  container: HTMLElement | string
  /** 是否渲染评论 */
  renderComments?: boolean
  /** 是否允许编辑评论 */
  enableCommentEdit?: boolean
  /** 是否显示评论连接线 */
  showCommentLines?: boolean
  /** 分页显示 */
  breakPages?: boolean
  /** 自定义类名前缀 */
  classNamePrefix?: string
  /** 评论点击回调 */
  onCommentClick?: (comment: ICommentElement) => void
  /** 评论变更回调 */
  onCommentChange?: (comment: ICommentElement, action: 'add' | 'update' | 'delete') => void
  /** 接受评论建议回调 */
  onCommentAccept?: (comment: ICommentElement) => void
  /** 拒绝评论建议回调 */
  onCommentReject?: (comment: ICommentElement) => void
}

// ==================== XML 命名空间 ====================

export const XML_NS = {
  W: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  W14: 'http://schemas.microsoft.com/office/word/2010/wordml',
  W15: 'http://schemas.microsoft.com/office/word/2012/wordml',
  R: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  A: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  WP: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
  PIC: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
} as const

// ==================== 文件路径常量 ====================

export const DOCX_PARTS = {
  DOCUMENT: 'word/document.xml',
  COMMENTS: 'word/comments.xml',
  COMMENTS_EXTENDED: 'word/commentsExtended.xml',
  STYLES: 'word/styles.xml',
  NUMBERING: 'word/numbering.xml',
  THEME: 'word/theme/theme1.xml',
  FOOTNOTES: 'word/footnotes.xml',
  ENDNOTES: 'word/endnotes.xml',
  FONT_TABLE: 'word/fontTable.xml',
  FONT_TABLE_RELS: 'word/_rels/fontTable.xml.rels',
  RELS: 'word/_rels/document.xml.rels',
  CONTENT_TYPES: '[Content_Types].xml',
  HEADER_PREFIX: 'word/header',
  FOOTER_PREFIX: 'word/footer',
} as const

// ==================== 字体表（Font Table） ====================

/**
 * 嵌入字体类型
 */
export type TEmbedFontType = 'regular' | 'bold' | 'italic' | 'boldItalic'

/**
 * 嵌入字体引用
 * 对应 fontTable.xml 中的 embedRegular/embedBold/embedItalic/embedBoldItalic
 */
export interface IEmbedFontRef {
  /** 字体文件的关系 ID（r:id） */
  id: string
  /** 字体解密密钥（w:fontKey） */
  key?: string
  /** 字体子集 URI */
  subsetted?: boolean
  /** 字体类型 */
  type: TEmbedFontType
}

/**
 * 字体声明
 * 对应 fontTable.xml 中的 <w:font> 元素
 */
export interface IFontDeclaration {
  /** 字体名称 */
  name: string
  /** 替代字体名称（字体替换） */
  altName?: string
  /** 字体家族：roman, swiss, modern, script, decorative, auto */
  family?: string
  /** 字体字符集：00(ANSI), 02(Symbol), 80(Shift JIS), 等 */
  charset?: string
  /** Panose-1 字体分类编号 */
  panose1?: string
  /** 字体签名 */
  sig?: IFontSignature
  /** 嵌入字体引用 */
  embedFontRefs: IEmbedFontRef[]
}

/**
 * 字体签名
 * 描述字体支持的 Unicode 范围
 */
export interface IFontSignature {
  usb0?: string
  usb1?: string
  usb2?: string
  usb3?: string
  csb0?: string
  csb1?: string
}

/**
 * 字体表
 * 包含文档中使用的所有字体声明
 */
export interface IFontTable {
  /** 字体声明列表 */
  fonts: IFontDeclaration[]
  /** 字体名称到声明的映射 */
  fontMap: Map<string, IFontDeclaration>
  /** 字体替换映射（原字体名 -> 替代字体名） */
  substitutionMap: Map<string, string>
}

/**
 * 已加载的嵌入字体
 */
export interface ILoadedEmbedFont {
  /** 原始字体名称 */
  fontName: string
  /** 字体类型 */
  type: TEmbedFontType
  /** 字体数据 URL（Data URI 或 Blob URL） */
  dataUrl: string
  /** 字体格式 */
  format: 'opentype' | 'truetype' | 'embedded-opentype'
}

// ==================== 关系类型常量 ====================

export const RELATIONSHIP_TYPES = {
  IMAGE: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
  HYPERLINK: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
  COMMENTS: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments',
  STYLES: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',
  NUMBERING: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering',
  HEADER: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header',
  FOOTER: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
  FONT: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/font',
} as const
