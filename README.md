# 小遗博客部署仓库

这个仓库用于部署 [https://233xyz.github.io/](https://233xyz.github.io/) 博客网站。

> 正确仓库是 `233XYZ/233XYZ.github.io`，请勿与 `233XYZ/XYZ233.github.io` 混淆。

## 以后怎样写文章

博客的 Hexo 源码放在 `blog/`，文章放在 `blog/source/_posts/`。以后只写 Markdown，首页、归档、分类、标签和搜索索引都会自动生成，不需要再手工修改各处 HTML。

第一次使用：

```powershell
cd blog
npm install
```

新建和预览文章：

```powershell
npm run new -- "文章标题"
npm run preview
```

打开 `http://localhost:4000/` 查看。写完后在仓库根目录提交并推送：

```powershell
git add blog
git commit -m "post: 添加文章标题"
git push origin main
```

GitHub Actions 会自动构建 Hexo 并更新正式网站。更完整的写作说明见 [blog/README.md](blog/README.md)。

## 目录说明

- `blog/source/_posts/`：今后维护的 Markdown 文章，是文章内容的真实来源。
- `blog/scaffolds/post.md`：执行新建文章命令时使用的中文模板。
- `blog/_config.yml`：Hexo 站点配置。
- `blog/_config.kratos-rebirth.yml`：主题、播放器、导航和外观配置。
- `blog/tools/prepare-theme.js`：准备固定版本主题并应用本站补丁。
- `blog/tools/verify-build.js`：构建后的完整性检查。
- `.github/workflows/deploy-pages.yml`：自动构建与发布流程。

仓库现在**只保留 Hexo 源码**。2023 年那批手工生成的静态页面（根目录的 `index.html`、`archives/`、`vendors/` 等，共 395 个文件）已经删除，避免和自动生成的产物混淆。它们仍可在 Git 历史中找回，线上网站不受影响——GitHub Pages 发布的是 Actions 从 `blog/public` 构建出来的结果。

## 发布前自检

```powershell
cd blog
npm run build
```

该命令会生成 `public/` 并运行完整性校验。所有检查项显示 `PASS` 后再提交推送。
