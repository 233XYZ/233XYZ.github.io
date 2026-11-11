"use strict";

const fs = require("fs");
const path = require("path");

const blogRoot = path.resolve(__dirname, "..");
const packageTheme = path.join(
  blogRoot,
  "node_modules",
  "hexo-theme-kratos-rebirth"
);
const themesRoot = path.join(blogRoot, "themes");
const targetTheme = path.join(themesRoot, "kratos-rebirth");
const overrideDarkScript = path.join(
  blogRoot,
  "overrides",
  "js",
  "kr-dark.min.js"
);

if (!fs.existsSync(packageTheme)) {
  throw new Error("主题依赖尚未安装，请先运行 npm install。");
}
if (!targetTheme.startsWith(blogRoot + path.sep)) {
  throw new Error("拒绝操作 blog 目录之外的路径。");
}

fs.rmSync(targetTheme, { recursive: true, force: true });
fs.mkdirSync(themesRoot, { recursive: true });
fs.cpSync(packageTheme, targetTheme, { recursive: true });

// 只保留本站实际启用的前端依赖，避免把评论系统、Mermaid 等未用资源
// 一并复制到每次部署的静态产物中。
const usedVendorDirs = new Set([
  "@fancyapps",
  "aplayer@1.10.1",
  "bootstrap@3.3.4",
  "font-awesome@4.7.0",
  "jquery@3.6.0",
  "meting@2.0.1",
  "nprogress@0.2.0",
  "qrcode_js@1.0.0",
]);
const vendorsRoot = path.join(targetTheme, "source", "vendors");
for (const entry of fs.readdirSync(vendorsRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !usedVendorDirs.has(entry.name)) {
    fs.rmSync(path.join(vendorsRoot, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

const playerTemplate = path.join(
  targetTheme,
  "layout",
  "_tools",
  "player.ejs"
);
let player = fs.readFileSync(playerTemplate, "utf8");
const metingTag = "    <meting-js\n";
if (!player.includes(metingTag)) {
  throw new Error("未找到播放器模板插入位置。");
}
player = player.replace(
  metingTag,
  '    <meting-js\n        api="https://meting-api-omega.vercel.app/api?server=:server&amp;type=:type&amp;id=:id&amp;r=:r"\n'
);
fs.writeFileSync(playerTemplate, player, "utf8");

const footerTemplate = path.join(
  targetTheme,
  "layout",
  "_partial",
  "footer.ejs"
);
let footer = fs.readFileSync(footerTemplate, "utf8");
footer = footer.replace(
  "https://github.com/Candinya/Kratos-Rebirth",
  "https://github.com"
);
fs.writeFileSync(footerTemplate, footer, "utf8");

const postTemplate = path.join(targetTheme, "layout", "post.ejs");
let post = fs.readFileSync(postTemplate, "utf8");
const navigationFixes = [
  ["config.root + page.next.path", "url_for(page.next.path)"],
  ["config.root + page.prev.path", "url_for(page.prev.path)"],
];
for (const [before, after] of navigationFixes) {
  if (!post.includes(before)) {
    throw new Error(`未找到文章导航模板：${before}`);
  }
  post = post.replace(before, after);
}
fs.writeFileSync(postTemplate, post, "utf8");

const targetDarkScript = path.join(
  targetTheme,
  "source",
  "js",
  "kr-dark.min.js"
);
fs.copyFileSync(overrideDarkScript, targetDarkScript);

// 主题自带的雪花脚本会在整屏上盖一层浅灰底，透明度失效时会糊成白屏，
// 这里用本站重写的版本替换。
const overrideSnowScript = path.join(
  blogRoot,
  "overrides",
  "js",
  "snow.min.js"
);
const targetSnowScript = path.join(targetTheme, "source", "js", "snow.min.js");
fs.copyFileSync(overrideSnowScript, targetSnowScript);

console.log(
  "Kratos-Rebirth 2.1.5 已准备，并已应用播放器、主题开关与雪花特效修复。"
);
