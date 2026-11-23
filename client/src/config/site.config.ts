/**
 * 站点配置（唯一事实来源）
 * ============================================================
 * 这里集中了「换一个站点 / 换一个人部署」时需要改动的全部信息：
 * 站名、标题、描述、首页文案、GitHub 仓库地址、共建者、联系方式、
 * 备案号、学科标签、功能开关、部署路径。
 *
 * 组件里不再出现写死的“408 简纲 / github.com/liangbohan/... / ICP 号”，
 * 一律从这里读取。改完保存即可，无需逐文件搜索替换。
 *
 * 注意：本文件不依赖任何 `@/` 别名，方便 vite.config.ts 与 Node 脚本直接读取。
 */

/** 联系方式 / 共建者可能出现的平台，图标由组件负责映射 */
export type SocialPlatform = 'bilibili' | 'douyin' | 'xhs' | 'github' | 'mail'

export type ContributorConfig = {
  /** 展示名 */
  name: string
  platform: SocialPlatform
  /** 主页或仓库地址 */
  url: string
}

export type SiteConfig = {
  /** 站点身份：浏览器标题、SEO、品牌名 */
  identity: {
    /** 品牌短名，用于 Logo、页脚版权，例如「408 简纲」 */
    name: string
    /** 浏览器标题（<title>） */
    title: string
    /** SEO 描述 */
    description: string
    /** SEO 关键词 */
    keywords: string[]
    /** html lang */
    lang: string
    /** 品牌小标语，首页顶部与页脚共用 */
    tagline: string
  }

  /** 首页主视觉文案：把 <accent> 学薄一点 */
  hero: {
    before: string
    accent: string
    after: string
    /** 打字机轮播的副标题，按顺序循环 */
    subtitles: string[]
  }

  /** 右上角版本徽标 */
  version: {
    enabled: boolean
    /** 徽标文案，例如「BETA v0.0.4」 */
    label: string
    /** 鼠标悬浮提示 */
    note: string
  }

  /** 源码仓库：首页入口、贡献者列表、页脚链接都由它推导 */
  repository: {
    owner: string
    name: string
    /** 默认分支，仅用于展示/文档，不影响构建 */
    branch: string
    /** 仓库入口文案，例如「Github 开源仓库」 */
    label: string
    /** 是否展示首页的仓库入口与「查看全部贡献者」 */
    showContributorsLink: boolean
  }

  /** 首页两个主按钮 */
  cta: {
    knowledge: {
      label: string
      /** 路由，一般不用改 */
      to: string
    }
    exams: {
      label: string
      to: string
    }
  }

  /** 搜索框文案 */
  search: {
    placeholder: string
    /** 搜索结果页的占位文案，可留空复用 placeholder */
    pagePlaceholder: string
  }

  /** 共建者滚动栏 */
  contributors: {
    title: string
    subtitle: string
    moreLabel: string
    list: ContributorConfig[]
  }

  /** 页脚：联系方式、版权、备案 */
  footer: {
    contactLabel: string
    socials: Array<{ platform: SocialPlatform; url: string }>
    /** 版权前缀，年份自动追加，例如「© 2026 408 简纲」 */
    copyright: string
    /** ICP 备案号，留空则不展示 */
    icp: string
    icpUrl: string
    /** 页脚第二行的补充标语 */
    motto: string
  }

  /** 功能开关：关掉后首页入口与路由入口都隐藏 */
  features: {
    knowledge: boolean
    exams: boolean
    search: boolean
  }

  /** 部署信息：base 与站点地址 */
  deploy: {
    /** Vite base，GitHub Pages 项目仓库为 /<仓库名>/，自定义域名可设 '/' */
    basePath: string
    /** 线上访问地址，用于 README / meta */
    siteUrl: string
  }
}

export const siteConfig: SiteConfig = {
  identity: {
    name: '408 简纲',
    title: '408 简纲 · AI 原生的考研408教材',
    description: '408 计算机学科知识体系与历年真题学习站，极简、精炼、可视化',
    keywords: ['408', '考研', '计算机', '数据结构', '计算机组成原理', '操作系统', '计算机网络'],
    lang: 'zh-CN',
    tagline: '极简 · 精炼 · 可视化',
  },

  hero: {
    before: '把',
    accent: '408',
    after: '学薄一点',
    subtitles: [
      '用更少的内容，建立更清晰的知识体系',
      '开源 · 共建 · 共享，新时代的 AI 原生电子教材',
      'Less is more ：只收录 408 应试知识最小集',
      '用图像和交互式动画，帮助你快速掌握复杂的知识',
    ],
  },

  version: {
    enabled: true,
    label: 'BETA v0.0.4',
    note: '网站正在公测阶段，部分功能可能尚不稳定，如遇问题欢迎反馈',
  },

  repository: {
    owner: 'liangbohan',
    name: 'postgraduate-exam-website',
    branch: 'master',
    label: 'Github 开源仓库',
    showContributorsLink: true,
  },

  cta: {
    knowledge: { label: '浏览知识简纲', to: '/knowledge' },
    exams: { label: '查看历年真题', to: '/exams' },
  },

  search: {
    placeholder: '搜索知识点或章节（如 CPU 流水线 / GBN / 中断隐指令）',
    pagePlaceholder: '搜索知识点或章节',
  },

  contributors: {
    title: '一起把 408 学薄一点',
    subtitle: '感谢每一位参与共建、纠错与分享的朋友',
    moreLabel: '查看全部贡献者 →',
    list: [
      { name: '11408考研良子', platform: 'bilibili', url: 'https://space.bilibili.com/385409016' },
      { name: '恐惧之鲸', platform: 'github', url: 'https://github.com/TerrifyingWhale' },
      { name: 'Spr_Aachen', platform: 'github', url: 'https://github.com/Spr-Aachen' },
      { name: 'JustJustGood', platform: 'bilibili', url: 'https://space.bilibili.com/278414435' },
      { name: 'Verthandii', platform: 'github', url: 'https://github.com/Verthandii' },
      { name: 'panko12138', platform: 'github', url: 'https://github.com/panko12138' },
    ],
  },

  footer: {
    contactLabel: '联系作者',
    socials: [{ platform: 'bilibili', url: 'https://space.bilibili.com/385409016' }],
    copyright: '© {year} 408 简纲',
    icp: '鄂ICP备2026046017号-1',
    icpUrl: 'https://beian.miit.gov.cn/',
    motto: '开源共享 · 持续更新 · 一起进步',
  },

  features: {
    knowledge: true,
    exams: true,
    search: true,
  },

  deploy: {
    basePath: '/',
    siteUrl: 'https://simple408.cn/',
  },
}

/* ---------------- 派生值：组件直接用，避免各处拼字符串 ---------------- */

/** 仓库地址，例如 https://github.com/owner/name */
export const repositoryUrl = `https://github.com/${siteConfig.repository.owner}/${siteConfig.repository.name}`

/** 贡献者列表页 */
export const contributorsUrl = `${repositoryUrl}/graphs/contributors`

/** 首页仓库入口的文案 */
export const repositoryLabel = siteConfig.repository.label