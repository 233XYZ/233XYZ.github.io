"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const blogRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(blogRoot, "public");
const read = (file) => fs.readFileSync(path.join(publicRoot, file), "utf8");
const exists = (file) => fs.existsSync(path.join(publicRoot, file));
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const home = read("index.html");
const article = read("2026/09/08/return/index.html");
const archive = read("archives/index.html");
const search = JSON.parse(read("search.json"));

const checks = {
  "首页包含《回归》": home.includes("/2026/09/08/return/"),
  "首页包含 3 篇文章":
    (home.match(/class="kratos-entry-border-new clearfix"/g) || []).length === 3,
  "《回归》标题正确": article.includes(">回归<"),
  "《回归》正文正确": article.includes(
    "毕业后，突然想起了，以前搭建的这个博客"
  ),
  "《回归》标签正确": article.includes("生活") && article.includes("记录"),
  "归档包含 3 篇文章":
    (archive.match(/class="post-title-link"/g) || []).length === 3,
  "搜索索引包含 3 篇文章": search.length === 3,
  "播放器使用可用接口": home.includes(
    "https://meting-api-omega.vercel.app/api?server=:server&amp;type=:type&amp;id=:id&amp;r=:r"
  ),
  "看板娘初始化代码存在": home.includes("/live2dw/assets/z16.model.json"),
  "看板娘模型文件存在": exists("live2dw/assets/z16.model.json"),
  "看板娘 moc 文件存在": exists("live2dw/assets/moc/z16.moc"),
  "自定义图片完整": [
    "images/avatar.jpg",
    "images/av2.jpg",
    "images/bas4.jpg",
    "images/background1.jpg",
  ].every(exists),
  "深浅色修复脚本已应用":
    hash(path.join(publicRoot, "js", "kr-dark.min.js")) ===
    hash(path.join(blogRoot, "overrides", "js", "kr-dark.min.js")),
};

for (const [name, passed] of Object.entries(checks)) {
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
}

if (Object.values(checks).some((passed) => !passed)) {
  process.exitCode = 1;
}
