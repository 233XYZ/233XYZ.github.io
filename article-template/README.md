# 文章模板使用说明

完整模板是 [index.html](./index.html)，它保留了博客当前文章页的导航、侧栏、分享、音乐播放器、Live2D 和主题切换功能，并在需要编辑的位置加入了中文注释。

## 新建文章

1. 复制 `article-template/index.html`。
2. 按照 `年/月/日/英文路径/index.html` 创建目录，例如：`2026/09/08/my-diary/index.html`。
3. 在新文件中搜索全角左括号 `【`，替换所有占位内容。
4. 删除正式文章中的 `<meta name="robots" content="noindex, nofollow">`。
5. 正文写在“文章正文开始”和“文章正文结束”注释之间。

常用正文 HTML：

```html
<h2>二级标题</h2>
<p>普通段落。</p>
<blockquote><p>引用内容。</p></blockquote>
<ul>
  <li>列表项目一</li>
  <li>列表项目二</li>
</ul>
<p><img src="/images/example.jpg" alt="图片说明"></p>
```

## 让文章出现在全站入口

这个仓库保存的是 Hexo 已生成的静态网页，不是原始 Hexo 工程。因此只添加文章页面还不够，还需要同步更新：

- 根目录 `index.html`：添加首页文章卡片。
- `archives/index.html`：添加总归档记录。
- `archives/年/index.html` 和 `archives/年/月/index.html`：添加年度、月度归档。
- `categories/分类名/index.html`：添加分类文章卡片。
- 对应的 `tags/标签名/index.html`：添加标签文章卡片。
- `search.json`：添加站内搜索记录。
- 上一篇文章的 `index.html`：补充“下一篇”链接。
- 各页面侧栏：更新文章数量、分类数量和“最新文章”。

如果以后经常写文章，建议找回或重建 Hexo 源码工程。这样只需要写 Markdown，再运行 Hexo 就能自动生成以上页面。

## 上传

```powershell
git add .
git commit -m "post: 添加文章标题"
git push origin main
```

推送后等待 GitHub Pages 发布，再访问正式文章网址检查。
