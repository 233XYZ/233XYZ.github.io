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
const hello = read("2023/09/20/hello-world/index.html");
const archive = read("archives/index.html");
const search = JSON.parse(read("search.json"));

// 文章数量随写作持续增加，这里按 source/_posts 实际文件数动态计算，
// 避免每发一篇新文章都要手工改这个校验文件。
const postDir = path.join(blogRoot, "source", "_posts");
const postCount = fs
  .readdirSync(postDir)
  .filter((name) => name.endsWith(".md")).length;
// 首页和归档都受 _config.yml 的 per_page 限制，只显示最近若干篇。
const perPage = 10;
const listCount = Math.min(postCount, perPage);

// 主题会把 jsconfig 序列化成 public/config/main.json，封面图配置从这里读。
let coverBaseUrl = "";
try {
  coverBaseUrl = String(JSON.parse(read("config/main.json")).cover.baseUrl || "");
} catch (error) {
  coverBaseUrl = "";
}
const thumbDir = path.join(publicRoot, "images", "thumb");
const thumbCount = fs.existsSync(thumbDir) ? fs.readdirSync(thumbDir).length : 0;

const checks = {
  "文章导航链接正确":
    hello.includes('href="/2023/09/23/cs/"') && !hello.includes('href="//2023/'),
  "侧栏位于文章左侧":
    home.indexOf('id="kratos-widget-area"') < home.indexOf('class="col-md-8"'),
  "未使用的主题依赖已剔除":
    exists("vendors/aplayer@1.10.1/dist/APlayer.min.js") &&
    !exists("vendors/mermaid@9.1.1"),
  "首页包含《回归》": home.includes("/2026/09/08/return/"),
  "首页文章数与源文章数一致":
    (home.match(/class="kratos-entry-border-new clearfix"/g) || []).length ===
    listCount,
  "《回归》标题正确": article.includes(">回归<"),
  "《回归》正文正确": article.includes(
    "毕业后，突然想起了，以前搭建的这个博客"
  ),
  "《回归》标签正确": article.includes("生活") && article.includes("记录"),
  "归档文章数与源文章数一致":
    (archive.match(/class="post-title-link"/g) || []).length === listCount,
  "搜索索引收录全部文章": search.length === postCount,
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
  "交互增强样式已注入": home.includes("css/custom-ui.css"),
  "交互增强脚本已注入": home.includes("js/custom-ui.js"),
  "交互增强资源存在":
    exists("css/custom-ui.css") && exists("js/custom-ui.js"),
  "封面缩略图使用本地资源": coverBaseUrl.startsWith("/images/thumb"),
  "本地缩略图数量齐全": thumbCount >= 20,
};

for (const [name, passed] of Object.entries(checks)) {
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
}

if (Object.values(checks).some((passed) => !passed)) {
  process.exitCode = 1;
}
