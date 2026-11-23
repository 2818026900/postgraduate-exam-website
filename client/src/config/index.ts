/**
 * 配置统一出口
 * 组件里 `import { siteConfig } from '@/config'` 即可，
 * 不用关心具体落在哪个文件。
 */

import { siteConfig } from './site.config'

export {
  siteConfig,
  repositoryUrl,
  contributorsUrl,
  repositoryLabel,
} from './site.config'
export type { SiteConfig, SocialPlatform, ContributorConfig } from './site.config'

export {
  booksConfig,
  enabledBooks,
  examSubjectLabels,
  examSubjectToKnowledgeSubject,
  defaultBookId,
} from './books.config'
export type { BookSetting, BooksConfig, ExamSubjectCode } from './books.config'

/** 把「{year}」替换成当前年份，支持版权等文案里自动带年份 */
export function resolveTemplate(text: string, now = new Date()): string {
  return text.replace(/\{year\}/g, String(now.getFullYear()))
}

/**
 * 启动时把站点身份写到 document：
 * title / description / keywords / lang / og 标签。
 * 这样 index.html 只需要放占位符，改配置即可换站点。
 */
export function applySiteMeta(doc: Document = document): void {
  const { identity } = siteConfig
  doc.title = identity.title
  doc.documentElement.lang = identity.lang

  const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
    if (!content) return
    let node = doc.querySelector(`meta[${attr}="${name}"]`)
    if (!node) {
      node = doc.createElement('meta')
      node.setAttribute(attr, name)
      doc.head.appendChild(node)
    }
    node.setAttribute('content', content)
  }

  setMeta('description', identity.description)
  setMeta('keywords', identity.keywords.join(','))
  setMeta('og:title', identity.title, 'property')
  setMeta('og:description', identity.description, 'property')
  setMeta('og:type', 'website', 'property')
  if (siteConfig.deploy.siteUrl) {
    setMeta('og:url', siteConfig.deploy.siteUrl, 'property')
  }
}