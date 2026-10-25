# dccif's Blog

[![Build and Deploy](https://github.com/dccif/blog/actions/workflows/main.yml/badge.svg)](https://github.com/dccif/blog/actions/workflows/main.yml)

基于 **Astro 7 + Svelte 5 + Tailwind CSS 4 + Fuwari** 的中文静态博客：[blog.dccif.top](https://blog.dccif.top)。文章使用 Content Layer，Markdown 使用 remark/rehype 插件。Svelte 用于全文搜索、明暗模式切换和主题色设置；归档列表由 Astro 静态渲染。

## 开发

使用 Node 24 和 pnpm 12.15.0（版本见 `mise.toml`、`.node-version`、`package.json`）。mise 跟随 Node 24 的更新，CI 使用 `.node-version` 中固定的版本。

```sh
mise install
pnpm install --frozen-lockfile
pnpm dev
```

如果全局 pnpm 版本不同，可使用 `npx pnpm@12.15.0` 代替下面命令中的 `pnpm`。

```sh
pnpm check
pnpm type-check
pnpm build
pnpm verify
pnpm preview
```

全文搜索使用构建时生成的 Pagefind 索引，需在 `build` 后用 `preview` 验证。搜索索引在输入关键词时才加载；无需搜索服务或 API 密钥。

`pnpm check` 依次检查 Astro、Svelte 和 TypeScript 文件。项目 TypeScript 文件使用原生 TypeScript 7.0.2 编译器（`typescript-native` npm 别名）；Astro/Svelte 检查工具仍依赖旧的编译器 API，因此保留 TypeScript 6.0.3。`.ncurc.json` 暂时排除这个兼容依赖，`ncu -i` 仍会更新 `typescript-native`。上游支持 TypeScript 7 后可合并两者，详情见 [Astro 类型检查兼容性](https://github.com/withastro/roadmap/discussions/1321)。`pnpm type-check` 可单独运行 TypeScript 7 检查。

Tailwind 4 使用 `@tailwindcss/vite`，配置集中在 `src/styles/global.css`，主题工具类使用 `@utility`。原 PostCSS 导入、嵌套和前缀插件已移除，迁移依据见 [Tailwind 4 升级指南](https://tailwindcss.com/docs/upgrade-guide)。

pnpm 配置统一放在 `pnpm-workspace.yaml`。`allowBuilds` 明确允许 `@parcel/watcher`、`esbuild`、`sharp` 的安装脚本，避免本地和 CI 安装出现 `ERR_PNPM_IGNORED_BUILDS`；以后新增需要构建的依赖时，可运行 `pnpm approve-builds` 更新清单。

依赖树通过 `overrides` 统一使用 KaTeX 0.19.1 和 postcss-selector-parser 7.1.7，修复旧间接依赖的已知问题，详情见 [KaTeX 安全公告](https://github.com/advisories/GHSA-238p-pmpm-9mq7) 和 [PostCSS 安全公告](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)。更新依赖后运行 `pnpm audit`，并保留这些覆盖规则，直到上游依赖使用已修复的版本。

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
