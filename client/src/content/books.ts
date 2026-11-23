import type { Book } from '@/types'
import { knowledgeBooks as rawBooks } from './knowledge-tree'
import { enabledBooks } from '@/config'

/**
 * 面向 UI 的教材视图：
 * 顺序与启用状态由 @/config/books.config.ts 决定，原始数据仍在 knowledge-tree.ts。
 */
export const knowledgeBooks: Book[] = enabledBooks
  .map((setting) => rawBooks.find((book) => book.id === setting.id))
  .filter((book): book is Book => Boolean(book))

export const allKnowledgePoints = knowledgeBooks.flatMap((book) =>
  book.chapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.points)),
)
