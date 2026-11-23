# 知识正文目录

正文源已搬到仓库根目录的 `content/knowledge/`，以 Markdown 编写，构建时编译成
`generated/*.json` 给页面用。完整约定见 [`docs/CONTENT.md`](../../../../docs/CONTENT.md)。

这里只保留运行时加载与轻量索引：

```text
knowledge-articles/
├── registry.ts              # 按教材加载正文（JSON 优先，旧 books/*.ts 兜底）
├── articleAssets.ts         # 解析 Markdown 里引用的动画 / 图片
├── generated/               # content/knowledge 编译产物（git 忽略，勿手改）
├── block-index.generated.ts # 块 ID 反查索引（构建时生成）
└── types.ts
```

迁移期间旧的 `books/*.ts` 与按教材拆分的 TS 正文目录仍然存在，用于兜底；
Markdown 覆盖同名知识点后，这些旧文件可以删除。
