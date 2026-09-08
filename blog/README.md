# Hexo 博客源码

这里是 [小遗博客](https://233xyz.github.io/) 的可维护源码。以后文章只需要写 Markdown，首页、归档、分类、标签和搜索索引都会由 Hexo 自动生成。

## 第一次使用

电脑需要安装 Node.js 18 或更高版本。在本目录运行：

```powershell
npm install
```

## 新建文章

```powershell
npm run new -- "文章标题"
```

新文件会出现在 `source/_posts/`。文件开头是文章信息，示例：

```yaml
---
title: 我的文章
date: 2026-09-08 20:00:00
categories:
  - 记录
tags:
  - 生活
  - 记录
---
```

在第二个 `---` 后使用 Markdown 写正文。常用写法：

```markdown
## 二级标题

普通段落。

> 引用内容

- 列表项目一
- 列表项目二

![图片说明](/images/example.jpg)
```

图片放到 `source/images/`。文章写好后本地预览：

```powershell
npm run preview
```

浏览器打开 `http://localhost:4000/`。停止预览时按 `Ctrl+C`。

也可以只构建和检查：

```powershell
npm run build
```

该命令会生成 `public/`，并自动验证文章、归档、搜索、播放器、看板娘和深浅色修复是否完整。

## 发布

确认文章无误后，在仓库根目录提交并推送：

```powershell
git add blog
git commit -m "post: 添加文章标题"
git push origin main
```

GitHub Actions 会自动运行 Hexo 并更新博客，不再需要手工编辑首页和归档 HTML。可以在仓库的 `Actions` 页面查看部署进度。

## 重要文件

- `source/_posts/`：Markdown 文章。
- `scaffolds/post.md`：新文章中文模板。
- `_config.yml`：Hexo 站点配置。
- `_config.kratos-rebirth.yml`：主题、音乐播放器、导航和外观配置。
- `scripts/live2d.js`：加载本地 z16 看板娘。
- `overrides/js/kr-dark.min.js`：已修复的深浅主题切换脚本。
- `tools/prepare-theme.js`：准备固定版本主题并应用本站补丁。
- `tools/verify-build.js`：构建后的完整性检查。

主题固定为 `hexo-theme-kratos-rebirth@2.1.5`，保持原博客外观。

## 本地目录为什么会变大

运行 `npm install` 和 `npm run build` 后，会产生 `node_modules/`、`public/`、`themes/` 和 `db.json`。它们都是可重新下载或生成的缓存，已在 `.gitignore` 中排除，不会上传到 GitHub。

不需要继续本地预览时，可以运行：

```powershell
npm run clean:cache
```

这会删除上述缓存；下次本地写作前重新运行 `npm install` 即可。博客源码、文章、图片和线上网站不会被删除。
