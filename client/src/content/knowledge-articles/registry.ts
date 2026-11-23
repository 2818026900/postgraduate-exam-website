import type { KnowledgeArticleData } from './types'
import { hydrateArticle, type RawArticle } from './articleAssets'
import {
  blockIdsOfPoint,
  bookOfPoint,
  subpointLocationByBlockId,
} from './block-index.generated'

/**
 * 知识正文注册表。
 *
 * 正文有两个来源，按「教材」动态加载：
 * 1. `generated/<bookId>.json`：由 content/knowledge/**\/*.md 编译而来（新，优先）；
 * 2. `books/<bookId>.ts`：迁移前的 TS 正文模块（旧，兜底）。
 *
 * 两者按 pointId 合并，JSON 覆盖同名旧数据，因此可以按教材、按章节渐进迁移，
 * 未迁移的内容仍然照常渲染。轻量同步元数据（block 反查）来自自动生成的
 * block-index。
 */

/** 旧版 TS 正文模块（按教材拆分，懒加载）。 */
const legacyBookModules = import.meta.glob('./books/*.ts')
/** 新版 Markdown 编译产物（按教材拆分，懒加载）。 */
const generatedBookModules = import.meta.glob('./generated/*.json')

const bookRegistryCache = new Map<string, Promise<Record<string, KnowledgeArticleData>>>()

async function loadLegacyBook(bookId: string): Promise<Record<string, KnowledgeArticleData>> {
  const loader = legacyBookModules[`./books/${bookId}.ts`]
  if (!loader) return {}
  const module = (await loader()) as { articlesByPoint?: Record<string, KnowledgeArticleData> }
  return module.articlesByPoint ?? {}
}

async function loadGeneratedBook(bookId: string): Promise<Record<string, KnowledgeArticleData>> {
  const loader = generatedBookModules[`./generated/${bookId}.json`]
  if (!loader) return {}
  const module = (await loader()) as { default?: { articles?: Record<string, RawArticle> } }
  const rawArticles = module.default?.articles ?? {}
  const entries = await Promise.all(
    Object.entries(rawArticles).map(async ([pointId, raw]) => [pointId, await hydrateArticle(raw)] as const),
  )
  return Object.fromEntries(entries)
}

/** 加载某教材的全部知识正文（Markdown 编译产物优先，旧 TS 兜底），结果按教材缓存。 */
export function loadBookContent(bookId: string): Promise<Record<string, KnowledgeArticleData>> {
  let pending = bookRegistryCache.get(bookId)
  if (pending) return pending
  pending = Promise.all([loadLegacyBook(bookId), loadGeneratedBook(bookId)])
    .then(([legacy, generated]) => ({ ...legacy, ...generated }))
    .catch((error) => {
      bookRegistryCache.delete(bookId)
      throw error
    })
  bookRegistryCache.set(bookId, pending)
  return pending
}

/** 由 pointId 加载其所在教材的正文文章（跨书共用点也能正确命中拥有者）。 */
export async function getArticleForPoint(pointId: string): Promise<KnowledgeArticleData | undefined> {
  const owner = bookOfPoint[pointId]
  if (!owner) return undefined
  const articles = await loadBookContent(owner)
  return articles[pointId]
}

/** pointId → 其正文所属教材 bookId（同步元数据）。 */
export { bookOfPoint }

export type KnowledgeSubpointLocation = {
  pointId: string
  subpointId: string
  subpointTitle: string
}

/** 由知识块 ID（kb-*）反查它所属的小知识点 subpoint（轻量同步元数据）。 */
export function findSubpointLocationByBlockId(blockId: string): KnowledgeSubpointLocation | undefined {
  return subpointLocationByBlockId[blockId]
}

/** 由知识块 ID（kb-*）反查它所属的知识点 pointId */
export function findPointIdByBlockId(blockId: string): string | undefined {
  return findSubpointLocationByBlockId(blockId)?.pointId
}

/** pointId → 该知识点正文的全部 kb-* block ID（同步元数据，供筛选器/真题侧栏统计用）。 */
export { blockIdsOfPoint }
