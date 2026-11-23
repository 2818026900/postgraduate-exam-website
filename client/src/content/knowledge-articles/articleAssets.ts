import type { ManimWebAnimation } from '@/animations/types'
import type { KnowledgeArticleBlock, KnowledgeArticleData } from './types'

/**
 * 运行时资源解析层：Markdown 编译出的 JSON 只保存引用
 * （动画 = `@/animations/xxx#exportName`，图片 = `@/assets/xxx`），
 * 这里把它们还原成真正可渲染的动画对象与资源 URL。
 */

export type RawBlock = {
  id: string
  type: KnowledgeArticleBlock['type'] | 'animation' | 'image'
  [key: string]: unknown
}

export type RawArticle = {
  pointId: string
  subpoints: {
    id: string
    title: string
    blocks: RawBlock[]
  }[]
}

const animationModules = import.meta.glob('../../animations/**/*.ts')
const assetUrls = import.meta.glob('../../assets/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function toAnimationKey(referencePath: string) {
  const relative = referencePath.replace(/^@\//, '')
  const key = `../../${relative}`
  return key.endsWith('.ts') ? key : `${key}.ts`
}

function toAssetKey(referencePath: string) {
  return `../../${referencePath.replace(/^@\//, '')}`
}

async function hydrateBlock(raw: RawBlock): Promise<KnowledgeArticleBlock> {
  if (raw.type === 'animation') {
    const ref = raw.animationRef as { path: string; exportName: string } | undefined
    if (!ref) throw new Error(`动画块 ${raw.id} 缺少 animationRef`)
    const loader = animationModules[toAnimationKey(ref.path)]
    if (!loader) throw new Error(`动画模块不存在：${ref.path}`)
    const module = (await loader()) as Record<string, unknown>
    const animation = module[ref.exportName] as ManimWebAnimation | undefined
    if (!animation) throw new Error(`动画模块 ${ref.path} 未导出 ${ref.exportName}`)
    const { animationRef: _ignored, ...rest } = raw
    return { ...(rest as object), animation } as KnowledgeArticleBlock
  }

  if (raw.type === 'image') {
    const srcRef = raw.srcRef as string | undefined
    const src = srcRef ? assetUrls[toAssetKey(srcRef)] : undefined
    if (srcRef && !src) console.warn(`[content] 图片资源未找到：${srcRef}`)
    const { srcRef: _ignored, ...rest } = raw
    return { ...(rest as object), src: src ?? srcRef ?? '' } as KnowledgeArticleBlock
  }

  return raw as unknown as KnowledgeArticleBlock
}

/** 把一篇 JSON 文章里的资源引用全部解析出来。 */
export async function hydrateArticle(raw: RawArticle): Promise<KnowledgeArticleData> {
  const subpoints = await Promise.all(
    raw.subpoints.map(async (subpoint) => ({
      id: subpoint.id,
      title: subpoint.title,
      blocks: await Promise.all(subpoint.blocks.map(hydrateBlock)),
    })),
  )
  return { pointId: raw.pointId, subpoints }
}
