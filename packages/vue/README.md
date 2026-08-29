# Hina UI

包名 `@hikarinagi/ui`,token 前缀 `--hn-`。产物是源码,不出构建产物 —— 消费方的 Tailwind 直接扫描本包。

设计语言、工程裁定与机检规则的完整记录在 [DESIGN.md](./DESIGN.md);基调纲领与技术路线见对应 artifact。本文只写接入与开发入口。

## 接入

```css
@import 'tailwindcss';
@import '@hikarinagi/ui/styles/tokens.css';

@source '../../node_modules/@hikarinagi/ui/src/**/*.{vue,ts}';
```

`@source` 是强制项。Tailwind v4 默认不扫描 `node_modules`,漏了这行的症状是**组件渲染出来但完全没样式,且构建不报错**。pnpm 的软链会让路径解析更微妙,以实际 `node_modules` 下的解析结果为准。

深色模式走 `.dark` 类选择器,由消费方在根元素上切换。

`styles/tokens.css` 是稳定入口,内部按关注点拆分为 `palette` / `semantic` / `density` / `mappings` / `motion` / `interaction` / `typography` / `spoiler` / `scroll` / `base` 十个文件,经 `@import` 汇总 —— 消费方只认入口,不要直接引用内部文件。

## 开发

```bash
pnpm --filter @hikarinagi/ui dev          # 预览工作台,端口 3720
pnpm --filter @hikarinagi/ui test         # 单元测试 + 约束机检(happy-dom)
pnpm --filter @hikarinagi/ui test:browser # 浏览器测试(Chromium / Playwright)
```

测试分层的原因、约束机检清单、浏览器测试的一次性环境准备与常见坑,见 [DESIGN.md](./DESIGN.md) 的「测试」一节。
