#!/usr/bin/env python3
"""让搜索索引脚本与真题校验脚本读取 content/knowledge 的编译产物。

幂等：已改造过的仓库再次执行会跳过。

由 .github/workflows/migrate-content.yml 在迁移流程里调用。
"""

from pathlib import Path


def read(path):
    return Path(path).read_text(encoding="utf-8")


def write(path, text):
    Path(path).write_text(text, encoding="utf-8")


# 1) .gitignore：忽略 generated 编译产物
gitignore = ".gitignore"
source = read(gitignore)
if "knowledge-articles/generated" not in source:
    anchor = "# 搜索索引（由 scripts/build-search-index.cjs 自动生成，勿跟踪）"
    assert anchor in source, "gitignore anchor missing"
    block = (
        "# 知识正文编译产物（由 content/knowledge 下的 Markdown 编译生成，勿跟踪）\n"
        "client/src/content/knowledge-articles/generated/\n\n"
    )
    write(gitignore, source.replace(anchor, block + anchor, 1))
    print("patched", gitignore)

# 2) 搜索索引：编译出的 JSON 优先，旧 TS 兜底
search = "scripts/build-search-index.cjs"
source = read(search)
if "GEN_DIR" not in source:
    anchor = "const bookOfPoint = {}; // pointId -> 拥有该文章正文的 bookId\n"
    block = "\n".join(
        [
            "// 新版正文（content/knowledge 编译产物，优先）",
            'const GEN_DIR = path.join(CLIENT_ROOT, "src/content/knowledge-articles/generated");',
            'const BOOK_IDS = ["computer-network", "data-structures", "computer-organization", "operating-systems"];',
            "for (const bookId of BOOK_IDS) {",
            '  const jsonPath = path.join(GEN_DIR, bookId + ".json");',
            "  if (!existsSync(jsonPath)) continue;",
            '  const data = JSON.parse(readFileSync(jsonPath, "utf8"));',
            "  for (const [pointId, article] of Object.entries(data.articles || {})) {",
            "    articleMap[pointId] = article;",
            "    bookOfPoint[pointId] = bookId;",
            "  }",
            "}",
            "",
        ]
    )
    assert anchor in source, "search script anchor missing"
    source = source.replace(anchor, anchor + block, 1)
    source = source.replace(
        "for (const rel of BOOK_MODULE_PATHS) {\n  const bookMod",
        "for (const rel of BOOK_MODULE_PATHS) {\n"
        "  if (!existsSync(path.resolve(CLIENT_ROOT, rel))) continue;\n"
        "  const bookMod",
        1,
    )
    source = source.replace(
        "    articleMap[pointId] = article;\n    bookOfPoint[pointId] = bookMod.bookId",
        "    if (articleMap[pointId]) continue;\n"
        "    articleMap[pointId] = article;\n"
        "    bookOfPoint[pointId] = bookMod.bookId",
        1,
    )
    write(search, source)
    print("patched", search)

# 3) 真题校验：知识块 ID 也从生成的 JSON 收集
exam = "scripts/validate_exam_content.mjs"
source = read(exam)
if "generatedRoot" not in source:
    head = "function collectKnowledgeBlockIds() {\n  const ids = new Set()\n"
    tail = "  return ids\n}\n"
    assert head in source and tail in source, "exam validator anchors missing"
    extra = "\n".join(
        [
            "  // 新版 Markdown 编译产物（content/knowledge → generated/*.json）",
            "  const generatedRoot = path.join(articlesRoot, 'generated')",
            "  for (const filePath of collectFiles(generatedRoot, (target) => target.endsWith('.json'))) {",
            "    const source = fs.readFileSync(filePath, 'utf8')",
            '    for (const match of source.matchAll(/(?<=\"id\":\")(kb-[a-z0-9]+(?:-[a-z0-9]+)*)/g)) {',
            "      ids.add(match[1])",
            "    }",
            "  }",
        ]
    )
    at = source.index(head)
    end = source.index(tail, at)
    source = (
        source[:at]
        + head
        + "  // 旧版 TS 正文（迁移期兜底）\n"
        + source[at + len(head) : end]
        + extra
        + "\n"
        + source[end:]
    )
    write(exam, source)
    print("patched", exam)
