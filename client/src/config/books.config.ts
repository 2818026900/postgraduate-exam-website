/**
 * 教材（书籍）注册表
 * ============================================================
 * 控制「有哪些教材、叫什么名字、什么学科、显示顺序」。
 *
 * 原来的写法是把书名、学科标签、默认教材散落在
 * knowledge-tree.ts / examRepository.ts / useKnowledgeReader.ts 三处，
 * 新增或删减一本教材要改好几个文件。现在统一在这里登记：
 *
 *   - 新增教材：在 books 数组里加一条，并保证 knowledge-tree.ts 里有对应数据
 *   - 暂时下线某本：把 enabled 设为 false（目录、筛选项、默认教材都会跳过它）
 *   - 调整顺序：改 order（数字越小越靠前），或直接调整数组位置
 *
 * 本文件不依赖 `@/` 别名，Node 脚本与 vite.config.ts 均可直接读取。
 */

export type ExamSubjectCode = 'ds' | 'co' | 'os' | 'cn'

export type BookSetting = {
  /** 与 knowledge-tree.ts 里的 Book.id 一致 */
  id: string
  /** 真题筛选、侧栏展示用的学科短标签 */
  label: string
  /** 真题 subject 代码 */
  examSubject: ExamSubjectCode
  /** 与 Book.subject 一致的知识体系枚举值 */
  knowledgeSubject: string
  /** 是否启用；false 时该教材从目录/筛选/默认教材中移除 */
  enabled: boolean
  /** 展示顺序，数字小的在前 */
  order: number
}

export type BooksConfig = {
  /** 默认打开的教材（知识页裸访问 /knowledge 时使用） */
  defaultBookId: string
  books: BookSetting[]
}

export const booksConfig: BooksConfig = {
  defaultBookId: 'computer-network',
  books: [
    {
      id: 'computer-network',
      label: '计算机网络',
      examSubject: 'cn',
      knowledgeSubject: 'NETWORK',
      enabled: true,
      order: 1,
    },
    {
      id: 'data-structures',
      label: '数据结构',
      examSubject: 'ds',
      knowledgeSubject: 'DATA_STRUCTURES',
      enabled: true,
      order: 2,
    },
    {
      id: 'computer-organization',
      label: '计算机组成原理',
      examSubject: 'co',
      knowledgeSubject: 'COMPUTER_ORGANIZATION',
      enabled: true,
      order: 3,
    },
    {
      id: 'operating-systems',
      label: '操作系统',
      examSubject: 'os',
      knowledgeSubject: 'OPERATING_SYSTEMS',
      enabled: true,
      order: 4,
    },
  ],
}

/** 已启用的教材，按 order 升序 */
export const enabledBooks = [...booksConfig.books]
  .filter((book) => book.enabled)
  .sort((a, b) => a.order - b.order)

/** 真题 subject 代码 → 展示名 */
export const examSubjectLabels: Record<string, string> = Object.fromEntries(
  enabledBooks.map((book) => [book.examSubject, book.label]),
)

/** 真题 subject 代码 → 知识体系 subject 枚举 */
export const examSubjectToKnowledgeSubject: Record<string, string> = Object.fromEntries(
  enabledBooks.map((book) => [book.examSubject, book.knowledgeSubject]),
)

/** 默认教材 id（配置的教材被下线时兜底取第一本） */
export const defaultBookId = enabledBooks.some((book) => book.id === booksConfig.defaultBookId)
  ? booksConfig.defaultBookId
  : enabledBooks[0]?.id ?? 'computer-network'