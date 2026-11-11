"use strict";

// 把交互增强层注入到每个页面。
// 样式放在 </head> 之前，保证排在主题样式之后生效；
// 脚本用 defer，等 DOM 解析完再执行，避免阻塞首屏。

const root = hexo.config.root || "/";
const asset = (file) => root + file.replace(/^\//, "");

hexo.extend.injector.register(
  "head_end",
  `<link rel="stylesheet" href="${asset("css/custom-ui.css")}">`
);

hexo.extend.injector.register(
  "body_end",
  `<script src="${asset("js/custom-ui.js")}" defer></script>`
);
