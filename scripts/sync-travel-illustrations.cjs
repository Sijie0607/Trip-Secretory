#!/usr/bin/env node
/**
 * 从 GitHub 读取 public/travel-illustrations 下所有 .png，生成本地清单。
 * 私有仓库请设置: export GITHUB_TOKEN=ghp_xxx
 * 生成: public/data/travel-illustration-stems.json
 *
 * 可读 URL 形式: https://raw.githubusercontent.com/Sijie0607/wanderlust-weaver/main/public/travel-illustrations/{stem}.webp
 * （与 .png 同名 stem；若仓库仅有 png，页面内 onError 会回退加载 .png）
 */
const fs = require("fs");
const path = require("path");

const REPO = "Sijie0607/wanderlust-weaver";
const BRANCH = "main";
const REMOTE_DIR = "public/travel-illustrations";
const API = `https://api.github.com/repos/${REPO}/contents/${REMOTE_DIR}`;

async function main() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(API, { headers });
  if (!res.ok) {
    console.error("GitHub API error:", res.status, await res.text());
    process.exit(1);
  }

  const items = await res.json();
  if (!Array.isArray(items)) {
    console.error("Unexpected body:", items);
    process.exit(1);
  }

  const stems = items
    .filter((x) => x.type === "file" && /\.png$/i.test(x.name))
    .map((x) => x.name.replace(/\.png$/i, ""))
    .sort();

  const base = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/public/travel-illustrations`;
  const payload = {
    base,
    webpUrlPattern: `${base}/{stem}.webp`,
    stems,
    generatedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "..", "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "travel-illustration-stems.json");
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${stems.length} stems from .png → ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
