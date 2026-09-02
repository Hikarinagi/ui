# Hina UI 文档站

[`@hina-ui/vue`](../) 的文档站：组件说明、可交互示例与 API 参考，中英双语。站点用本库自己的组件搭建，因此它同时是这套组件的第一个消费方。

## 开发

```bash
pnpm --filter @hikarinagi/docs dev        # 端口 3730
pnpm --filter @hikarinagi/docs build
pnpm --filter @hikarinagi/docs lint:check
```

组件库源码在 `../src`，改动会直接热更新到站点，不需要构建产物。

## 内容组织

| 目录                           | 内容                                              |
| ------------------------------ | ------------------------------------------------- |
| `content/<locale>/components/` | 每个组件一份 Markdown                             |
| `app/demos/<locale>/<组件>/`   | 示例，由正文中的 `<Demo name="组件/示例" />` 引入 |
| `app/nav.ts`                   | 侧栏条目与分类归属                                |
| `i18n/locales/`                | 界面文案与组件的一句话描述                        |

Markdown 经 `markdown.ts` 编译为 Vue 组件：标题自动生成锚点与页面目录，正文中的原生标签映射到本库的排版组件。

写文档页的约定见 [DESIGN.md](../DESIGN.md) 的「文档站」一节。
