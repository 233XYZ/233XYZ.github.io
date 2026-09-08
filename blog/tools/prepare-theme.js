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

const targetDarkScript = path.join(
  targetTheme,
  "source",
  "js",
  "kr-dark.min.js"
);
fs.copyFileSync(overrideDarkScript, targetDarkScript);

console.log("Kratos-Rebirth 2.1.5 已准备，并已应用播放器与主题开关修复。");
