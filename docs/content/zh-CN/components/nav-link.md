---
title: NavLink
description: 导航列表中的一项，标示当前所在的页面。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/nav-link/NavLink.vue
---

<Demo name="nav-link/hero" />

## 用法 {#usage}

```ts
import { NavLink } from '@hina-ui/vue'
```

`NavLink` 是纵向导航列表中的一项，默认渲染为链接，整行都是点击区域。它自己不提供列表容器，外层用 `Stack` 或 `nav` 排布。

<Demo name="nav-link/basic" />

它与 `Link` 的分工是明确的：`Link` 是正文行内的文字链接，随文字流动；`NavLink` 是导航结构中的一行，有固定行高与整行热区。正文里不要用 `NavLink`。

## 示例 {#examples}

### 当前项 {#active}

`active` 标出读者当前所在的页面：字色回到正色并加重，背景同时浮现一层选中态底色。它还会给元素加上 `aria-current="page"`，屏幕阅读器据此播报当前位置。

一组导航中同时只应有一项为 `active`。

<Demo name="nav-link/active" />

悬停于选中项时，悬停底色叠加在选中态底色之上，而非替换它，对比度只升不降，因此选中状态在悬停过程中不会丢失。

### 图标 {#icon}

`icon` 插槽放在文字之前，尺寸由组件统一为 4 个单位，不需要在图标上写尺寸类。图标是装饰，文字才是可读名称。

<Demo name="nav-link/icon" />

### 路由链接 {#router}

`as` 指定渲染为何种元素，默认为 `a`。传入路由组件即可获得客户端跳转，`to` 等属性会透传过去。当前项由调用方根据路由判断后传入 `active`，组件不自行匹配路由。

<Demo name="nav-link/router" />

### 不可用 {#disabled}

`disabled` 用于暂时不可进入的入口：该项降到半透明、不接受鼠标点击、退出键盘 tab 序列，并带上 `aria-disabled="true"`。

导航项长期不可用时应当直接移除，而不是保留一个不可用的入口。

<Demo name="nav-link/disabled" />

### 收起态 {#rail}

`NavLink` 放进 `Sidebar` 后会感知侧栏状态。侧栏收成 rail（只剩图标）时，文字淡出，`label` 的内容改由悬停提示给出，同时作为该项的无障碍名。

因此放进 Sidebar 的 `NavLink` 都应当写 `label`，否则收起后这一项既没有可见文字，也没有可读名称。脱离 `Sidebar` 时 `label` 不起作用，也不会渲染提示。用法见 Sidebar 的文档。

## 无障碍 {#a11y}

- 当前项带 `aria-current="page"`，位置信息不依赖颜色。
- 不可用项带 `aria-disabled="true"` 并退出 tab 序列。
- 图标由组件标为装饰，不进入朗读序列；可读名称来自默认插槽的文字。
- 收起成 rail 时，文字虽然不可见，但 `label` 会作为 `aria-label` 保留，朗读不受影响。
- 组件本身不渲染 `nav` 地标，外层容器需要自行提供。

## API {#api}

### Props {#props}

| 属性       | 类型                  | 默认值  | 说明                                   |
| ---------- | --------------------- | ------- | -------------------------------------- |
| `active`   | `boolean`             | `false` | 是否为当前页面                         |
| `disabled` | `boolean`             | `false` | 是否不可用                             |
| `label`    | `string`              | —       | 侧栏收起为 rail 时的提示文字与无障碍名 |
| `as`       | `string \| Component` | `'a'`   | 渲染成的元素或组件                     |
| `asChild`  | `boolean`             | `false` | 由插槽根元素承担渲染                   |
| `class`    | `string`              | —       | 追加到根元素的类                       |

其余属性透传到实际渲染的元素上，例如 `href` 或路由组件的 `to`。

### Slots {#slots}

| 插槽      | 说明                   |
| --------- | ---------------------- |
| `default` | 项的文字，也是可读名称 |
| `icon`    | 文字之前的图标         |
