/**
 * 把 content/knowledge 下的 Markdown 编译为运行时用的 JSON 正文。
 *
 * - 输入：content/knowledge/<bookId>/<pointId>.md
 * - 输出：client/src/content/knowledge-articles/generated/<bookId>.json
 * - 动画/图片保留为引用（@/animations/x#export、@/assets/x），由前端运行时解析。
 *
 * 除了编译，还做内容级校验：pointId 合法、块 id 全局唯一、动画/图片引用存在。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { markdownToArticle } from './content/knowledge-format.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientRoot = path.join(projectRoot, 'client')
const contentRoot = path.join(projectRoot, 'content/knowledge')
const outputRoot = path.join(clientRoot, 'src/content/knowledge-articles/generated')

const BOOK_IDS = ['computer-network', 'data-structures', 'computer-organization', 'operating-systems']

const seenBlockIds = new Map()
let pointCount = 0
let subpointCount = 0

function assertFileExists(refPath, label, filePath) {
  const target = path.join(clientRoot, 'src', refPath.replace(/^@\//, ''))
  if (!fs.existsSync(target) && !fs.existsSync(`${target}.ts`)) {
    throw new Error(`${filePath}: ${label} 引用不存在：${refPath}`)
  }
}

fs.mkdirSync(outputRoot, { recursive: true })

for (const bookId of BOOK_IDS) {
  const bookDir = path.join(contentRoot, bookId)
  const articles = {}
  if (fs.existsSync(bookDir)) {
    const files = fs.readdirSync(bookDir).filter((name) => name.endsWith('.md')).sort()
    for (const name of files) {
      const filePath = path.join(bookDir, name)
      const { article, blockIds } = markdownToArticle(fs.readFileSync(filePath, 'utf8'), path.relative(projectRoot, filePath))
      const expectedName = `${article.pointId}.md`
      if (name !== expectedName) throw new Error(`${path.relative(projectRoot, filePath)}: 文件名应与 pointId 一致（${expectedName}）`)
      if (articles[article.pointId]) throw new Error(`${bookId}: pointId ${article.pointId} 重复`)

      for (const blockId of blockIds) {
        if (seenBlockIds.has(blockId)) throw new Error(`知识块 ID 重复：${blockId}（${seenBlockIds.get(blockId)} / ${bookId}/${name}）`)
        seenBlockIds.set(blockId, `${bookId}/${name}`)
      }

      for (const subpoint of article.subpoints) {
        for (const block of subpoint.blocks) {
          if (block.type === 'animation' && block.animationRef) {
            assertFileExists(block.animationRef.path, '动画', path.relative(projectRoot, filePath))
          }
          if (block.type === 'image' && block.srcRef) {
            assertFileExists(block.srcRef, '图片', path.relative(projectRoot, filePath))
          }
        }
      }

      articles[article.pointId] = article
      pointCount += 1
      subpointCount += article.subpoints.length
    }
  }

  fs.writeFileSync(
    path.join(outputRoot, `${bookId}.json`),
    `${JSON.stringify({ bookId, articles })}\n`,
    'utf8',
  )
  console.log(`[content] ${bookId}: ${Object.keys(articles).length} 篇`)
}

console.log(`[content] 编译完成：${pointCount} 个知识点 / ${subpointCount} 个小节 / ${seenBlockIds.size} 个内容块`)
