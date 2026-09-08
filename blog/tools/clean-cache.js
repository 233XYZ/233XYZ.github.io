"use strict";

const fs = require("fs");
const path = require("path");

const blogRoot = path.resolve(__dirname, "..");
const targets = ["node_modules", "public", "themes", "db.json"];

for (const name of targets) {
  const target = path.resolve(blogRoot, name);
  if (!target.startsWith(blogRoot + path.sep)) {
    throw new Error(`拒绝清理 blog 目录之外的路径：${target}`);
  }
  fs.rmSync(target, { recursive: true, force: true });
  console.log(`已清理：${name}`);
}
