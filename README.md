# dccif's Blog

[![Build and Deploy](https://github.com/dccif/blog/actions/workflows/main.yml/badge.svg)](https://github.com/dccif/blog/actions/workflows/main.yml)

基于 **Astro 7 + Fuwari** 的中文静态博客：[blog.dccif.top](https://blog.dccif.top)。已将 Fuwari 的文章集合适配为 Content Layer，并保留 Tailwind 3 主题样式与 remark/rehype Markdown 插件。

## 开发

使用 mise 管理的 Node 24.21.0 和 pnpm 9.14.4（版本见 `mise.toml`、`.node-version`、`package.json`）。

```sh
mise install
pnpm install --frozen-lockfile
pnpm dev
```

如果全局 pnpm 版本不同，可使用 `npx pnpm@9.14.4` 代替下面命令中的 `pnpm`。

```sh
pnpm check
pnpm build
pnpm verify
pnpm preview
```

全文搜索使用构建时生成的 Pagefind 索引，需在 `build` 后用 `preview` 验证。搜索索引在输入关键词时才加载；无需搜索服务或 API 密钥。

## 写文章

```sh
pnpm new-post my-new-post
```

编辑 `src/content/posts/my-new-post.md`。常用字段：

```yaml
title: 我的新文章
published: 2026-09-22T10:00:00+08:00
description: 用一两句话概括文章内容
tags: [编程]
category: 编程
draft: false
lang: zh-CN
```

新文章默认地址为 `/posts/文件名/`。迁移文章的 `slug` 已保留原日期路径，请勿随意修改。日期按上海时区显示。`draft: true` 不会发布到生产站点或 RSS。

文章图片可放在 `public/image/` 并使用 `/image/文件名.webp` 引用。构建会补充本地图片尺寸及懒加载属性，降低阅读时的布局跳动。

站点标题、导航、头像、背景和主题色在 `src/config.ts`；关于页在 `src/content/spec/about.md`。原有 CC BY-NC-SA 4.0 文章许可保持不变，Fuwari 模板许可见 `LICENSE`。

## 部署

推送到 `main` 自动运行：安装锁定依赖 → 类型检查 → 静态构建与搜索索引 → 链接验证 → GitHub Pages 发布。

仓库 Pages 的 Source 使用 **GitHub Actions**；部署采用官方 Pages artifact 和 OIDC，不需要 `GH_TOKEN`。Pull Request 只检查构建，不发布。域名由 `public/CNAME` 和仓库 Pages 设置共同维护，站点 URL 在 `astro.config.mjs`。

## Hexo 迁移记录

- 保留的 20 篇文章及素材在 `source/` 中存有迁移参考；该目录不会被 Astro 发布。以后只编辑 `src/content/`。
- 原 Hexo 配置归档于 `legacy/hexo/`；旧 npm 锁文件已移除，统一使用 pnpm 锁文件。
- 旧站已发布页面清单保存在 `src/data/legacy-paths.json`，逐篇映射在 `src/data/migration.json`。
- 两篇旧文章路径比源文件日期早一天，沿用实际已发布路径；一篇带尾随空格的旧路径跳转到清理后的地址。
- 旧归档、标签、分类及分页地址生成静态跳转页，支持无 JavaScript 的 meta refresh。GitHub Pages 不提供可配置的服务端 301。
- `pnpm verify` 检查全部旧地址、本地链接/资源、文章 SEO、RSS 数量、搜索产物及自定义域名；新增文章无需修改迁移清单。
- Fuwari 上游版本记录在 `src/data/fuwari-upstream.json`。更新主题时请保留本项目的路由、SEO、搜索和迁移兼容改动。

原始 Hexo 版本可从 Git 历史恢复。迁移前的 `gh-pages` 分支保留为回退参考；当前发布工作流不再覆盖该分支。
