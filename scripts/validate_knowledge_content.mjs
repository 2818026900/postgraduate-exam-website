/**
 * 知识内容校验。
 *
 * 正文来源有两套（迁移期共存）：
 * 1. content/knowledge/<book>/<pointId>.md —— 新，Markdown 源；
 * 2. client/src/content/knowledge-articles/<book>/**.ts —— 旧，TS 模块。
 *
 * 规则：同一 pointId 以 Markdown 为准（TS 同名文件视为待删除的旧副本）；
 * 知识树里的每个知识点必须至少有一种正文；块 ID 全局唯一。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { markdownToArticle } from './content/knowledge-format.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const treePath = path.join(projectRoot, 'client/src/content/knowledge-tree.ts')
const articlesRoot = path.join(projectRoot, 'client/src/content/knowledge-articles')
const contentRoot = path.join(projectRoot, 'content/knowledge')

const rel = (filePath) => path.relative(projectRoot, filePath)

function collectArticleFiles(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectArticleFiles(target)
    return entry.isFile() && entry.name.endsWith('.ts') ? [target] : []
  })
}

function collectMatches(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1])
}

function assertUnique(values, label) {
  const seen = new Set()
  for (const value of values) {
    if (seen.has(value)) throw new Error(`${label} 重复：${value}`)
    seen.add(value)
  }
  return seen
}

/* ---------------- 1. 知识树：pointId / bookId ---------------- */

const treeSource = fs.readFileSync(treePath, 'utf8')
const bookBlocks = treeSource.split(/export const \w+Book: Book = \{/).filter((block) => block.includes("id: '"))

const treeBookIds = new Set()
const treePointIds = new Set()

for (const block of bookBlocks) {
  const bookId = block.match(/\bid:\s*['"]([a-z0-9-]+)['"]/)?.[1]
  if (bookId) treeBookIds.add(bookId)

  const sectionParts = block.split(/\bpoints: \[/)
  for (let i = 1; i < sectionParts.length; i++) {
    const ids = collectMatches(
      sectionParts[i],
      /\bid:\s*['"]((?:kp|ds|co|os)-(?!chapter|section)[a-z0-9]+(?:-[a-z0-9]+)*)['"]/g,
    )
    assertUnique(ids, '同一 section 内 KnowledgePoint ID')
    for (const id of ids) treePointIds.add(id)
  }
}

/* ---------------- 2. Markdown 正文 ---------------- */

const mdPoints = new Map() // pointId -> { bookId, file, blockIds }
const mdBlockIds = []

if (fs.existsSync(contentRoot)) {
  for (const entry of fs.readdirSync(contentRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const bookId = entry.name
    if (!treeBookIds.has(bookId)) throw new Error(`content/knowledge 下的目录 ${bookId} 不是知识树中的教材 id`)

    const bookDir = path.join(contentRoot, bookId)
    for (const name of fs.readdirSync(bookDir).filter((file) => file.endsWith('.md'))) {
      const filePath = path.join(bookDir, name)
      const { article, blockIds } = markdownToArticle(fs.readFileSync(filePath, 'utf8'), rel(filePath))

      if (name !== `${article.pointId}.md`) {
        throw new Error(`${rel(filePath)}: 文件名必须与 pointId 一致（${article.pointId}.md）`)
      }
      if (mdPoints.has(article.pointId)) {
        throw new Error(`知识点 ${article.pointId} 在 Markdown 中重复：${mdPoints.get(article.pointId).file} / ${rel(filePath)}`)
      }

      const seenSubpoint = new Set()
      for (const subpoint of article.subpoints) {
        if (seenSubpoint.has(subpoint.id)) throw new Error(`${rel(filePath)}: 小节 id 重复：${subpoint.id}`)
        seenSubpoint.add(subpoint.id)
      }

      mdPoints.set(article.pointId, { bookId, file: rel(filePath), blockIds })
      mdBlockIds.push(...blockIds)
    }
  }
}

/* ---------------- 3. 旧 TS 正文（未被 Markdown 覆盖的部分） ---------------- */

const tsArticleRecords = collectArticleFiles(articlesRoot)
  .filter((filePath) => {
    const relative = path.relative(articlesRoot, filePath)
    if (!relative.includes(path.sep)) return false
    if (relative.startsWith('books' + path.sep)) return false
    return true
  })
  .map((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8')
    const pointIds = collectMatches(source, /\bpointId:\s*['"]((?:kp|ds|co|os)-(?!chapter|section)[a-z0-9]+(?:-[a-z0-9]+)*)['"]/g)
    const exportNames = collectMatches(source, /export\s+const\s+([A-Za-z_$][\w$]*)\s*:\s*KnowledgeArticleData/g)
    if (pointIds.length !== 1 || exportNames.length !== 1) {
      throw new Error(`${rel(filePath)} 必须且只能导出一个 KnowledgeArticleData`)
    }
    return { filePath, pointId: pointIds[0], exportName: exportNames[0], source }
  })

// Markdown 已覆盖的 pointId，其 TS 旧文件不再参与校验（迁移完成后应删除）
const legacyRecords = tsArticleRecords.filter((record) => !mdPoints.has(record.pointId))
assertUnique(legacyRecords.map((record) => record.pointId), 'KnowledgeArticle pointId（旧 TS）')

const tsBlockIds = legacyRecords.flatMap((record) =>
  collectMatches(record.source, /\bid:\s*['"](kb-[a-z0-9]+(?:-[a-z0-9]+)*)['"]/g),
)

const allBlockIds = [...mdBlockIds, ...tsBlockIds]
assertUnique(allBlockIds, 'Knowledge Block ID')

/* ---------------- 4. 覆盖与注册 ---------------- */

const booksDir = path.join(articlesRoot, 'books')
const exportNameToPointId = new Map(legacyRecords.map((record) => [record.exportName, record.pointId]))
const bookSources = fs.existsSync(booksDir)
  ? fs.readdirSync(booksDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
      .map((entry) => ({ file: path.join(booksDir, entry.name), source: fs.readFileSync(path.join(booksDir, entry.name), 'utf8') }))
  : []

const registeredExports = new Set()
const importedExports = new Set()
const pointIdToBook = new Map()

for (const { source, file } of bookSources) {
  const bookId = path.basename(file, '.ts')
  for (const m of collectMatches(source, /\[([A-Za-z_$][\w$]*)\.pointId\]\s*:/g)) {
    registeredExports.add(m)
    const pointId = exportNameToPointId.get(m)
    if (!pointId) continue
    if (pointIdToBook.has(pointId)) {
      throw new Error(`KnowledgePoint ${pointId} 在多个 book 模块重复注册：${pointIdToBook.get(pointId)} 与 ${bookId}`)
    }
    pointIdToBook.set(pointId, bookId)
  }
  for (const m of collectMatches(source, /import\s*\{\s*([A-Za-z_$][\w$]*)\s*\}\s*from\s*['"]/g)) importedExports.add(m)
}

for (const [pointId, record] of mdPoints) {
  if (!treePointIds.has(pointId)) throw new Error(`${record.file} 的 pointId ${pointId} 不存在于 knowledge-tree`)
  if (pointIdToBook.has(pointId) && pointIdToBook.get(pointId) !== record.bookId) {
    throw new Error(`知识点 ${pointId} 的教材归属不一致：Markdown 在 ${record.bookId}，TS 在 ${pointIdToBook.get(pointId)}`)
  }
}

for (const pointId of treePointIds) {
  if (mdPoints.has(pointId)) continue
  const legacy = legacyRecords.find((record) => record.pointId === pointId)
  if (!legacy) throw new Error(`KnowledgePoint ${pointId} 缺少正文（Markdown 与 TS 都没有）`)
  if (!importedExports.has(legacy.exportName)) throw new Error(`${legacy.exportName} 未被 books/ 模块导入`)
  if (!registeredExports.has(legacy.exportName)) throw new Error(`${legacy.exportName} 未在 books/ 模块注册`)
}

for (const record of legacyRecords) {
  if (!treePointIds.has(record.pointId)) {
    throw new Error(`${rel(record.filePath)} 的 pointId ${record.pointId} 不存在于 knowledge-tree`)
  }
}

const mdCount = mdPoints.size
const legacyCount = legacyRecords.length
console.log(
  `知识内容校验通过：${treePointIds.size} 个 KnowledgePoint（Markdown ${mdCount} 篇${legacyCount ? `，旧 TS ${legacyCount} 篇` : ''}），${allBlockIds.length} 个知识块。`,
)
