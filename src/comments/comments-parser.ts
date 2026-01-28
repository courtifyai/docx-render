/**
 * 评论扩展解析器
 * 解析 word/commentsExtended.xml，提取评论的父子关系
 */

import { ICommentExtended, ICommentElement } from '../types'
import { parseXmlString } from '../parser/xml-parser'

/** Word 2015 命名空间（用于 commentsExtended） */
const W15_NS = 'http://schemas.microsoft.com/office/word/2012/wordml'

/**
 * 解析 commentsExtended.xml 内容
 * @param xmlContent XML 字符串
 * @returns 扩展评论 Map（paraId -> ICommentExtended）
 */
export function parseCommentsExtended(xmlContent: string): Map<string, ICommentExtended> {
  const result = new Map<string, ICommentExtended>()
  
  if (!xmlContent) {
    return result
  }
  
  try {
    const doc = parseXmlString(xmlContent)
    const root = doc.documentElement
    
    // 查找所有 commentEx 元素
    // 可能在 w15 命名空间下
    const commentExElements = root.getElementsByTagNameNS(W15_NS, 'commentEx')
    
    // 如果找不到，尝试不带命名空间查找
    const elementsToProcess = commentExElements.length > 0 
      ? Array.from(commentExElements)
      : Array.from(root.getElementsByTagName('commentEx'))
    
    for (const el of elementsToProcess) {
      const paraId = getAttr(el, 'paraId')
      if (!paraId) continue
      
      const extended: ICommentExtended = {
        paraId,
        paraIdParent: getAttr(el, 'paraIdParent'),
        done: getBoolAttr(el, 'done'),
      }
      
      result.set(paraId, extended)
    }
    
    console.log('[DEBUG] parseCommentsExtended: found', result.size, 'extended comments')
  } catch (e) {
    console.warn('解析 commentsExtended.xml 失败:', e)
  }
  
  return result
}

/**
 * 构建评论树结构（回复链）
 * @param comments 所有评论列表
 * @param extendedMap 扩展评论映射（paraId -> ICommentExtended）
 * @returns 顶级评论列表（回复嵌套在 replies 中）
 */
export function buildCommentTree(
  comments: ICommentElement[],
  extendedMap: Map<string, ICommentExtended>
): ICommentElement[] {
  // 构建 paraId -> comment 映射
  const paraIdToComment = new Map<string, ICommentElement>()
  
  for (const comment of comments) {
    if (comment.paraId) {
      paraIdToComment.set(comment.paraId, comment)
    }
  }
  
  // 初始化所有评论的 replies 数组
  for (const comment of comments) {
    comment.replies = []
  }
  
  // 关联扩展信息并建立父子关系
  for (const [paraId, extended] of extendedMap) {
    const comment = paraIdToComment.get(paraId)
    if (!comment) continue
    
    // 设置完成状态
    comment.done = extended.done
    
    // 如果有父段落，建立父子关系
    if (extended.paraIdParent) {
      const parentComment = paraIdToComment.get(extended.paraIdParent)
      if (parentComment) {
        comment.parentId = parentComment.id
        parentComment.replies!.push(comment)
      }
    }
  }
  
  // 筛选顶级评论（没有 parentId 的）
  const rootComments = comments.filter(c => !c.parentId)
  
  // 按日期排序（旧的在前）
  rootComments.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })
  
  // 递归排序回复
  sortReplies(rootComments)
  
  console.log('[DEBUG] buildCommentTree: root comments:', rootComments.length, 
    'total comments:', comments.length)
  
  return rootComments
}

/**
 * 递归排序回复（按日期）
 */
function sortReplies(comments: ICommentElement[]): void {
  for (const comment of comments) {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateA - dateB
      })
      sortReplies(comment.replies)
    }
  }
}

/**
 * 获取元素属性（支持 w15 命名空间）
 */
function getAttr(el: Element, name: string): string | undefined {
  // 先尝试 w15 命名空间
  let value = el.getAttributeNS(W15_NS, name)
  if (value) return value
  
  // 再尝试无命名空间
  value = el.getAttribute(name)
  if (value) return value
  
  // 尝试 w: 前缀
  value = el.getAttribute(`w15:${name}`)
  return value || undefined
}

/**
 * 获取布尔属性
 */
function getBoolAttr(el: Element, name: string): boolean {
  const value = getAttr(el, name)
  if (!value) return false
  return value === '1' || value === 'true'
}
