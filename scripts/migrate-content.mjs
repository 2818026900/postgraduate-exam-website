/**
 * 一次性迁移脚本：把 client/src 里硬编码的 KnowledgeArticleData(TS)
 * 导出成 content/knowledge/<book>/<pointId>.md。
 *
 * 用法：
 *   node scripts/migrate-content.mjs            # 四本教材全量导出（已存在的文件跳过）
 *   node scripts/migrate-content.mjs --force    # 覆盖已有 Markdown
 *   node scripts/migrate-content.mjs --book computer-network
 */
import fs from 'node:fs'
import Module from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
import { articleToMarkdown } from './content/knowledge-format.mjs'

// 文章里会 import 图片资源（Vite 的 `?url`），Node 侧没有对应 loader，
// 迁移时把它们当作字符串路径处理即可（真正 URL 由前端构建解析）。
// 注意：必须在创建 jiti 实例前注册。
for (const extension of ['.svg', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif']) {
  Module._extensions[extension] = (module, filename) => {
    module.exports = filename
  }
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientRoot = path.join(projectRoot, 'client')
const animationsRoot = path.join(clientRoot, 'src/animations')
const contentRoot = path.join(projectRoot, 'content/knowledge')

const BOOK_MODULES = [
  { bookId: 'computer-network', file: './src/content/knowledge-articles/books/computer-network.ts' },
  { bookId: 'data-structures', file: './src/content/knowledge-articles/books/data-structures.ts' },
  { bookId: 'computer-organization', file: './src/content/knowledge-articles/books/computer-organization.ts' },
  { bookId: 'operating-systems', file: './src/content/knowledge-articles/books/operating-systems.ts' },
]

const args = process.argv.slice(2)
const force = args.includes('--force')
const bookFilter = args.includes('--book') ? args[args.indexOf('--book') + 1] : null

const jiti = createJiti(clientRoot, {
  cache: false,
  interopDefault: false,
  alias: { '@': path.join(clientRoot, 'src') },
})

/**
 * 扫描 animations 目录，建立「动画 id → 模块路径 + 导出名」索引。
 * 迁移时优先使用文章里已有的 sourceImport；缺失时用它兜底。
 */
function buildAnimationIndex() {
  const idToRef = new Map()
  const pending = [animationsRoot]
  while (pending.length) {
    const directory = pending.pop()
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        pending.push(target)
        continue
      }
      if (!entry.name.endsWith('.ts')) continue
      const source = fs.readFileSync(target, 'utf8')
      const segments = source.split(/(?=export\s+const\s+[A-Za-z_$][\w$]*)/)
      for (const segment of segments) {
        const exportMatch = segment.match(/export\s+const\s+([A-Za-z_$][\w$]*)/)
        if (!exportMatch) continue
        const idMatch = segment.match(/\bid:\s*['"]([^'"]+)['"]/)
        if (!idMatch) continue
        const modulePath = `@/animations/${path.relative(animationsRoot, target).replace(/\\/g, '/').replace(/\.ts$/, '')}`
        const ref = { path: modulePath, exportName: exportMatch[1] }
        const previous = idToRef.get(idMatch[1])
        if (previous && `${previous.path}#${previous.exportName}` !== `${ref.path}#${ref.exportName}`) {
          console.warn(`[migrate] 动画 id 重复：${idMatch[1]}（${previous.path} / ${ref.path}），保留先出现的`)
          continue
        }
        idToRef.set(idMatch[1], ref)
      }
    }
  }
  return idToRef
}

const animationIndex = buildAnimationIndex()

function resolveAnimationRef(animation) {
  if (!animation?.id) return null
  const ref = animationIndex.get(animation.id)
  if (!ref) return null
  return `${ref.path}#${ref.exportName}`
}

let written = 0
let skipped = 0
const seenPointIds = new Map()
const seenBlockIds = new Map()

for (const book of BOOK_MODULES) {
  if (bookFilter && book.bookId !== bookFilter) continue
  const module = jiti(book.file)
  const articles = module.articlesByPoint ?? {}
  const entries = Object.entries(articles)
  const outputDir = path.join(contentRoot, book.bookId)
  fs.mkdirSync(outputDir, { recursive: true })

  for (const [pointId, article] of entries) {
    if (article.pointId !== pointId) {
      throw new Error(`${book.bookId}: 文章键 ${pointId} 与 pointId ${article.pointId} 不一致`)
    }
    if (seenPointIds.has(pointId)) {
      throw new Error(`知识点 ${pointId} 在多本教材重复导出：${seenPointIds.get(pointId)} / ${book.bookId}`)
    }
    seenPointIds.set(pointId, book.bookId)

    for (const subpoint of article.subpoints) {
      for (const block of subpoint.blocks) {
        if (seenBlockIds.has(block.id)) {
          throw new Error(`知识块 ${block.id} 重复：${seenBlockIds.get(block.id)} / ${pointId}`)
        }
        seenBlockIds.set(block.id, pointId)
      }
    }

    const markdown = articleToMarkdown(article, resolveAnimationRef)
    const filePath = path.join(outputDir, `${pointId}.md`)
    if (fs.existsSync(filePath) && !force) {
      skipped += 1
      continue
    }
    fs.writeFileSync(filePath, markdown, 'utf8')
    written += 1
  }

  console.log(`[migrate] ${book.bookId}: ${entries.length} 篇`)
}

console.log(`[migrate] 写入 ${written} 个 Markdown，跳过 ${skipped} 个（已存在），共 ${seenPointIds.size} 个知识点`)
if (skipped) console.log('[migrate] 需要覆盖时加 --force')
