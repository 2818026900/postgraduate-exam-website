# 站点配置指南

改造后，**换站名、换仓库、换文案、加减教材、关掉某个模块，都只改配置，不用动组件代码**。

配置只有一个入口：

| 文件 | 管什么 |
| --- | --- |
| `client/src/config/site.config.ts` | 站点身份、首页文案、仓库链接、CTA、搜索文案、共建者、页脚/备案、功能开关、部署路径 |
| `client/src/config/books.config.ts` | 有哪些教材、名称、学科标签、默认教材、显示顺序、启用开关 |

组件统一从 `@/config` 读取；`index.html` 里的标题/描述/语言由 Vite 构建期注入，也来自配置。

---

## 场景一：把站点改成自己的

编辑 `client/src/config/site.config.ts`：

```ts
identity: {
  name: '我的考研笔记',                    // Logo、页脚品牌名
  title: '我的考研笔记 · 计算机基础',      // 浏览器标题
  description: '……',                     // SEO 描述
  keywords: ['考研', '计算机'],
  lang: 'zh-CN',
  tagline: '极简 · 精炼 · 可视化',         // 首页顶部与页脚小标语
},

hero: {
  before: '把',
  accent: '408',
  after: '学薄一点',
  subtitles: ['第一句轮播文案', '第二句'],
},

repository: {
  owner: '你的GitHub用户名',              // 会自动拼出仓库地址、贡献者页
  name: '你的仓库名',
  branch: 'master',
  label: 'Github 开源仓库',
  showContributorsLink: true,
},
```

改完 `identity.name` / `identity.title` 后，Logo、页脚、浏览器标题、SEO 会同步变化，无需再全局搜索“408 简纲”。

---

## 场景二：换部署地址 / 绑定自定义域名

`deploy.basePath` 是 Vite 的 `base`：

- GitHub Pages **项目仓库**（`https://<user>.github.io/<repo>/`）：`basePath` 设为 `/<仓库名>/`
- **自定义域名或根路径部署**：设为 `/`

`VITE_BASE_PATH` 环境变量优先级更高，GitHub Actions 里已经按 `/${{ github.event.repository.name }}/` 自动推导，**fork 后不用改 workflow**。

`deploy.siteUrl` 只用于文档与 `og:url` 元信息。

---

## 场景三：共建者与联系方式

同一文件里：

```ts
contributors: {
  title: '一起把 408 学薄一点',
  subtitle: '感谢每一位参与共建、纠错与分享的朋友',
  moreLabel: '查看全部贡献者 →',
  list: [
    { name: '某某', platform: 'github', url: 'https://github.com/xxx' },
    { name: '某某', platform: 'bilibili', url: 'https://space.bilibili.com/xxx' },
  ],
},

footer: {
  contactLabel: '联系作者',
  socials: [{ platform: 'bilibili', url: 'https://space.bilibili.com/xxx' }],
  copyright: '© {year} 你的站名',   // {year} 会自动替换成当前年份
  icp: '你的ICP备案号',              // 留空则不展示备案
  icpUrl: 'https://beian.miit.gov.cn/',
  motto: '开源共享 · 持续更新 · 一起进步',
},
```

`platform` 目前支持 `bilibili` / `douyin` / `xhs` / `github`，图标在组件里按平台名映射。

---

## 场景四：加减教材、调整顺序

`client/src/config/books.config.ts`：

```ts
export const booksConfig: BooksConfig = {
  defaultBookId: 'computer-network',   // 裸访问 /knowledge 时打开的教材
  books: [
    { id: 'computer-network', label: '计算机网络', examSubject: 'cn', knowledgeSubject: 'NETWORK', enabled: true, order: 1 },
    // ...
  ],
}
```

- `order` 越小越靠前，知识页目录、真题筛选侧栏都按它排序
- `enabled: false` 会把这本书从目录、真题筛选项、默认教材里移除（数据仍保留）
- 新增教材：在 `client/src/content/knowledge-tree.ts` 里加一份 `Book` 数据，并在 `books.config.ts` 登记一行；正文按 `knowledge-articles/books/` 现有结构补模块
- `label` 是真题筛选里显示的学科名，`examSubject` 对应题库 `subject` 字段（`ds/co/os/cn`）

---

## 场景五：关掉某个模块

```ts
features: {
  knowledge: true,
  exams: false,      // 首页不再显示“查看历年真题”入口
  search: true,
},
```

开关只控制首页入口显隐，路由本身仍保留，方便以后重新打开。

---

## 场景六：二次开发时的约定

- 新增文案、链接、名单，**先加配置字段，再在组件里引用**，不要在 `.vue` 里写死
- 配置读取统一用 `import { siteConfig } from '@/config'`
- 版权等需要年份的文案用 `{year}` 占位，渲染时用 `resolveTemplate()` 替换
- `site.config.ts` / `books.config.ts` 刻意不依赖 `@/` 别名，方便 `vite.config.ts` 和 Node 脚本直接读取
