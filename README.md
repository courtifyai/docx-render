# DOCX Render Enhanced

基于 [docx-preview](https://github.com/VolodymyrBayworker/docx-preview) 的增强型 DOCX 渲染库，**支持评论显示和修改功能**。

## 功能特性

- 基于 docx-preview 的高保真文档渲染
- 评论显示与高亮
- 评论编辑、删除功能
- 评论面板 UI
- 修改后文档保存/下载
- TypeScript 支持
- 响应式设计

## 安装

```bash
npm install
```

## 快速开始

### 基础用法

```typescript
import { DocxRenderer } from 'docx-render-enhanced'

// 创建渲染器
const renderer = new DocxRenderer({
  container: '#docx-container',
  renderComments: true,
  enableCommentEdit: true,
  showCommentPanel: true
})

// 渲染文件
const file = document.getElementById('file-input').files[0]
await renderer.render(file)
```

### 便捷方法

```typescript
import { renderDocx } from 'docx-render-enhanced'

const renderer = await renderDocx(file, '#container', {
  renderComments: true,
  showCommentPanel: true
})
```

## API

### DocxRenderer

#### 构造函数选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `container` | `HTMLElement \| string` | 必填 | 渲染容器 |
| `renderComments` | `boolean` | `true` | 是否显示评论 |
| `enableCommentEdit` | `boolean` | `true` | 是否允许编辑评论 |
| `showCommentPanel` | `boolean` | `true` | 是否显示评论面板 |
| `commentPanelPosition` | `'right' \| 'bottom'` | `'right'` | 评论面板位置 |
| `breakPages` | `boolean` | `true` | 是否分页显示 |
| `renderHeaders` | `boolean` | `true` | 是否显示页眉 |
| `renderFooters` | `boolean` | `true` | 是否显示页脚 |
| `className` | `string` | - | 自定义类名 |
| `onCommentClick` | `(comment) => void` | - | 评论点击回调 |
| `onCommentChange` | `(comment, action) => void` | - | 评论变更回调 |

#### 方法

```typescript
// 渲染文件
await renderer.render(file: File | ArrayBuffer | Blob)

// 获取所有评论
renderer.getComments(): IComment[]

// 添加评论
renderer.addComment({ author, content }): IComment

// 更新评论
renderer.updateComment(id, { content }): boolean

// 删除评论
renderer.deleteComment(id): boolean

// 保存文档
const blob = await renderer.save()

// 下载文档
await renderer.download('filename.docx')

// 订阅评论事件
renderer.onCommentEvent('add' | 'update' | 'delete' | 'select', callback)

// 销毁渲染器
renderer.destroy()
```

### 评论数据结构

```typescript
interface IComment {
  id: string           // 评论 ID
  author: string       // 作者
  date: string         // 日期 (ISO 8601)
  content: string      // 内容
  initials?: string    // 作者缩写
}
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 运行示例

```bash
npm run dev
```

然后打开浏览器访问显示的地址，可以：
1. 点击「打开文件」选择 DOCX 文件
2. 或拖拽 DOCX 文件到页面
3. 查看和编辑评论
4. 点击「保存文档」下载修改后的文件

## 技术原理

### DOCX 文件结构

DOCX 文件实际上是一个 ZIP 压缩包，包含以下关键 XML 文件：

```
document.docx/
├── [Content_Types].xml
├── word/
│   ├── document.xml      # 主文档内容
│   ├── comments.xml      # 评论数据
│   ├── styles.xml        # 样式定义
│   └── _rels/
│       └── document.xml.rels  # 关系定义
└── docProps/
    └── core.xml          # 文档属性
```

### 评论处理流程

1. **解析阶段**：使用 JSZip 解压 DOCX，提取 `word/comments.xml`
2. **渲染阶段**：使用 docx-preview 渲染文档，同时标记评论位置
3. **交互阶段**：CommentManager 管理评论的显示、选中、编辑状态
4. **保存阶段**：CommentWriter 将修改写回 XML，重新打包为 DOCX

## License

MIT
