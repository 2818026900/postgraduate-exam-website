# 知识正文的内容层

知识正文（每个知识点的讲解、公式、图示、动画）不再写在 `client/src` 的 TS 模块里，
而是放在仓库根目录的 `content/knowledge/`，以 Markdown 为源，构建时编译成运行时 JSON。

## 目录结构

```text
content/knowledge/
├── computer-network/
│   ├── kp-layering.md
│   ├── kp-crc.md
│   └── ...
├── data-structures/
├── computer-organization/
└── operating-systems/
```

- 一个知识点一个文件，文件名必须等于 `pointId`（如 `kp-layering.md`）。
- 教材目录名必须是知识树里的 `book.id`。
- 知识树（章 / 节 / 知识点标题与层级）暂时仍在 `client/src/content/knowledge-tree.ts`，
  下一次可以继续把树本身也迁成数据文件。

## Markdown 约定

```markdown
---
pointId: kp-layering
---

## 网络的层次化设计 {#layering-purpose}

<!-- kb-layering-purpose-1 -->
计算机网络采用**分层体系结构**：每一层只解决一类通信问题……
（这里就是普通 Markdown，支持多段、列表、表格、$行内公式$）

<!-- kb-layering-subnet-3 -->
:::callout{title="传输层的位置" tone="orange"}
传输层既不属于通信子网，也不属于资源子网。
:::

<!-- kb-layering-osi-8 -->
:::html
<svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg">...</svg>
:::

<!-- kb-crc-formula -->
:::formula{caption="CRC 生成多项式"}
G(x) = x^4 + x + 1
:::

:::image{src="@/assets/computer-organization/external-storage/hdd-structure.webp" alt="机械硬盘结构"}
:::animation{ref="@/animations/computer-networks/data-link-layer/crc-division#crcDivisionAnimation"}
```

要点：

1. **小节** 用 `## 标题 {#小节id}`。小节 id 在知识点内唯一。
2. **每个内容块前** 用 `<!-- kb-xxx -->` 标记块 ID。这个 ID 会被真题的
   `knowledgeBlockIds` 引用，必须全局唯一且稳定；改正文时不要删注释。
3. 普通段落直接写 Markdown；一个块内可以有多段（空行保留）。
4. 特殊块用指令：`:::callout` / `:::html` / `:::formula` 有结束的 `:::`；
   `:::image` 和 `:::animation` 是单行，不需要结束标记。
5. 图片与动画只存**引用**：图片用 `@/assets/...`，动画用
   `@/animations/...#导出名`，由前端在运行时解析成真实资源。

## 命令

```bash
# 首次迁移：把旧 TS 正文导出成 Markdown（已存在则跳过，--force 覆盖）
npm run content:migrate

# 编译 Markdown → client/src/content/knowledge-articles/generated/*.json
npm run content:build

# 校验（知识点覆盖、块 ID 唯一、真题引用）+ 真题校验
npm run validate

# 完整构建（含上面的编译与校验）
npm run build
```

`generated/` 是构建产物，已在 `.gitignore` 中忽略，不要手改。

## 迁移期兼容

`client/src/content/knowledge-articles/registry.ts` 会同时加载：

1. `generated/<bookId>.json`（Markdown 编译产物，优先）；
2. `books/<bookId>.ts`（旧 TS 正文，兜底）。

同名 `pointId` 以 Markdown 为准。因此可以按教材、按知识点渐进迁移，随时构建。
当某一本教材的 Markdown 全部就位后，就可以删掉对应的旧 TS 目录与 `books/*.ts`。

## 新增 / 修改一个知识点

1. 在 `content/knowledge/<book>/<pointId>.md` 编辑正文；
2. 新块自己起一个 `kb-*` ID（全局唯一，别和已有重复）；
3. 如果新增了知识点，先在 `knowledge-tree.ts` 里加节点（树迁移前仍需改这处）；
4. `npm run validate && npm run build` 本地过一遍，再提交。

## 自动迁移工作流

`.github/workflows/migrate-content.yml` 提供一次性迁移任务：

- 手动触发（Actions → Migrate knowledge content → Run workflow）；
- 或在推送该工作流文件时自动跑一次。

它会执行 `content:migrate` → `content:build` → `validate` → 构建 → 删除旧 TS 正文 →
提交并推送回 `master`。如果仓库未启用 Actions，本地执行同样的命令即可。
