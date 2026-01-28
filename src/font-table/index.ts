/**
 * 字体表模块
 * 提供字体表解析、嵌入字体加载和字体替换映射功能
 */

// 导出解析器
export {
  parseFontTable,
  getSubstituteFontName,
  getFontDeclaration,
  hasEmbeddedFont,
  getEmbedFontRefs,
  buildFontFamily,
} from './font-parser'

// 导出加载器
export {
  loadEmbeddedFonts,
  cleanupFontStyles,
  parseFontRelationships,
  type IFontLoaderOptions,
} from './font-loader'
