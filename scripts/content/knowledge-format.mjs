/**
 * 知识正文的 Markdown 编解码层。
 *
 * 设计目标：`content/knowledge/**\/*.md` 是人写的内容源，构建期编译成
 * `KnowledgeArticleData` JSON，运行时与旧的 TS 正文模块共存（JSON 优先）。
 *
 * Markdown 约定：
 *   ---
 *   pointId: kp-layering
 *   ---
 *
 *   ## 网络的层次化设计 {#layering-purpose}
 *
 *   <!-- kb-layering-purpose-1 -->
 *   正文（Markdown，可多段，块内空行保留）
 *
 *   <!-- kb-layering-subnet-1 -->
 *   :::callout{title="传输层的位置" tone="orange"}
 *   传输层既不属于通信子网，也不属于资源子网。
 *   :::
 *
 *   :::html
 *   <svg .../>
 *   :::
 *
 *   :::formula{caption="香农公式"}
 *   C = W \log_2(1 + S/N)
 *   :::
 *
 *   :::image{src="@/assets/xx.webp" alt="..." caption="..."}
 *   :::animation{ref="@/animations/...#crcDivisionAnimation"}
 */

const BLOCK_ID_PATTERN = /^<!--\s*(kb-[a-z0-9]+(?:-[a-z0-9]+)*)\s*-->$/
const HEADING_PATTERN = /^##\s+(.+?)\s*\{#([A-Za-z0-9][\w-]*)\}\s*$/
const DIRECTIVE_PATTERN = /^:::(callout|html|formula|image|animation)(?:\{(.*)\})?\s*$/
const SUBPOINT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n')
}

function unescapeAttr(value) {
  return String(value ?? '').replace(/\\(["n\\])/g, (_match, token) => {
    if (token === 'n') return '\n'
    return token
  })
}

function parseAttrs(source) {
  const attrs = {}
  if (!source) return attrs
  const pattern = /(\w+)\s*=\s*"((?:\\.|[^"\\])*)"/g
  for (const match of source.matchAll(pattern)) {
    attrs[match[1]] = unescapeAttr(match[2])
  }
  return attrs
}

function attrsToSource(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ')
}

function trimBlankLines(text) {
  return text.replace(/^(?:[ \t]*\n)+/, '').replace(/(?:\n[ \t]*)+$/, '')
}

/** 把一篇 KnowledgeArticleData 序列化成 Markdown。 */
export function articleToMarkdown(article, resolveAnimationRef) {
  const lines = ['---', `pointId: ${article.pointId}`, '---', '']

  for (const subpoint of article.subpoints) {
    lines.push(`## ${subpoint.title} {#${subpoint.id}}`, '')
    for (const block of subpoint.blocks) {
      lines.push(`<!-- ${block.id} -->`)
      lines.push(...blockToMarkdown(block, resolveAnimationRef))
      lines.push('')
    }
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`
}

function blockToMarkdown(block, resolveAnimationRef) {
  switch (block.type) {
    case 'paragraph':
      return [block.text]
    case 'html':
      return [':::html', block.html, ':::']
    case 'formula':
      return [
        `:::formula${block.caption ? `{${attrsToSource({ caption: block.caption })}}` : ''}`,
        block.formula,
        ':::',
      ]
    case 'callout':
      return [
        `:::callout{${attrsToSource({ title: block.title, tone: block.tone })}}`,
        block.text,
        ':::',
      ]
    case 'image': {
      const src = block.sourceImport?.path ?? block.src
      return [`:::image{${attrsToSource({ src, alt: block.alt, caption: block.caption })}}`]
    }
    case 'animation': {
      const ref = block.sourceImport
        ? `${block.sourceImport.path}#${block.sourceImport.localName}`
        : resolveAnimationRef(block.animation)
      if (!ref) throw new Error(`动画块 ${block.id} 无法定位到动画模块（缺少 sourceImport）`)
      return [`:::animation{ref="${escapeAttr(ref)}"}`]
    }
    default:
      throw new Error(`未知的知识块类型：${block.type}`)
  }
}

/** 解析 Markdown 为一篇 KnowledgeArticleData；block 内的动画/图片保留为引用。 */
export function markdownToArticle(markdown, filePath = '<markdown>') {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let cursor = 0
  let pointId = ''

  if (lines[0]?.trim() === '---') {
    cursor = 1
    while (cursor < lines.length && lines[cursor].trim() !== '---') {
      const line = lines[cursor]
      const match = line.match(/^\s*pointId\s*:\s*(.+?)\s*$/)
      if (match) pointId = match[1]
      cursor += 1
    }
    if (cursor >= lines.length) throw new Error(`${filePath}: front-matter 缺少结束的 ---`)
    cursor += 1
  }

  if (!/^(?:kp|ds|co|os)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pointId)) {
    throw new Error(`${filePath}: front-matter 缺少合法的 pointId（当前：${pointId || '空'}）`)
  }

  const subpoints = []
  const blockIds = []
  let current = null
  let pendingBlockId = null
  let buffer = []
  let autoIndex = 0

  const ensureSubpoint = () => {
    if (!current) throw new Error(`${filePath}: 正文必须写在 ## 小节标题下`)
    return current
  }

  const nextBlockId = () => {
    if (pendingBlockId) {
      const id = pendingBlockId
      pendingBlockId = null
      return id
    }
    autoIndex += 1
    return `kb-${ensureSubpoint().id}-auto-${autoIndex}`
  }

  const flushParagraph = () => {
    const text = trimBlankLines(buffer.join('\n'))
    buffer = []
    if (!text) return
    const block = { id: nextBlockId(), type: 'paragraph', text }
    ensureSubpoint().blocks.push(block)
    blockIds.push(block.id)
  }

  while (cursor < lines.length) {
    const line = lines[cursor]
    const heading = line.match(HEADING_PATTERN)
    const anchor = line.match(BLOCK_ID_PATTERN)
    const directive = line.match(DIRECTIVE_PATTERN)

    if (heading) {
      flushParagraph()
      const [, title, id] = heading
      if (!SUBPOINT_ID_PATTERN.test(id)) throw new Error(`${filePath}: 非法小节 id ${id}`)
      current = { id, title: title.trim(), blocks: [] }
      subpoints.push(current)
      cursor += 1
      continue
    }

    if (anchor) {
      flushParagraph()
      pendingBlockId = anchor[1]
      cursor += 1
      continue
    }

    if (directive) {
      flushParagraph()
      const [, type, rawAttrs] = directive
      const attrs = parseAttrs(rawAttrs)
      cursor += 1

      if (type === 'image' || type === 'animation') {
        const block = { id: nextBlockId(), type }
        if (type === 'image') {
          block.srcRef = attrs.src ?? ''
          block.alt = attrs.alt ?? ''
          if (attrs.caption) block.caption = attrs.caption
        } else {
          block.animationRef = parseAnimationRef(attrs.ref, filePath)
        }
        ensureSubpoint().blocks.push(block)
        blockIds.push(block.id)
        continue
      }

      const body = []
      while (cursor < lines.length && lines[cursor].trim() !== ':::') {
        body.push(lines[cursor])
        cursor += 1
      }
      if (cursor >= lines.length) throw new Error(`${filePath}: :::${type} 缺少结束的 :::`)
      cursor += 1

      const content = trimBlankLines(body.join('\n'))
      const block = { id: nextBlockId(), type }
      if (type === 'paragraph') block.text = content
      if (type === 'html') block.html = content
      if (type === 'formula') {
        block.formula = content
        if (attrs.caption) block.caption = attrs.caption
      }
      if (type === 'callout') {
        block.title = attrs.title ?? ''
        block.text = content
        if (attrs.tone) block.tone = attrs.tone
      }
      ensureSubpoint().blocks.push(block)
      blockIds.push(block.id)
      continue
    }

    buffer.push(line)
    cursor += 1
  }

  flushParagraph()

  if (pendingBlockId) throw new Error(`${filePath}: 块 id 注释 ${pendingBlockId} 后面没有内容`)
  if (!subpoints.length) throw new Error(`${filePath}: 至少需要一个小节`)

  return {
    article: { pointId, subpoints },
    blockIds,
  }
}

function parseAnimationRef(ref, filePath) {
  if (!ref) throw new Error(`${filePath}: :::animation 缺少 ref`)
  const hashIndex = ref.lastIndexOf('#')
  if (hashIndex <= 0) throw new Error(`${filePath}: :::animation ref 需要写成 "模块路径#导出名"`)
  return { path: ref.slice(0, hashIndex), exportName: ref.slice(hashIndex + 1) }
}
