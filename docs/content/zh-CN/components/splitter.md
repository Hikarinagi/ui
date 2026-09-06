---
title: Splitter
description: 可以拖动分隔线调整比例的分栏容器。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/splitter/Splitter.vue
  - label: Splitter
    href: https://reka-ui.com/docs/components/splitter
---

<Demo name="splitter/hero" />

## 用法 {#usage}

```ts
import { Splitter, SplitterHandle, SplitterPanel } from '@hina-ui/vue'
```

`Splitter` 是分栏容器，`SplitterPanel` 是面板，`SplitterHandle` 是面板之间可拖动的分隔线。面板与分隔线按顺序交替排列，两个面板之间放一条分隔线。

容器必须有确定的尺寸。横向分栏需要高度，纵向分栏需要高度与宽度，尺寸通过 `class` 给到 `Splitter` 上。容器没有高度时面板会塌陷成零高，看起来像没有渲染。

<Demo name="splitter/basic" />

面板尺寸一律是百分比，取值 0 到 100，不接受像素值。

## 示例 {#examples}

### 方向 {#direction}

`direction` 决定分栏轴向，默认为 `horizontal`，即左右分栏；`vertical` 为上下分栏。分隔线的朝向、拖动方向与键盘方向键都随之改变，不需要另行配置。

<Demo name="splitter/direction" />

### 尺寸约束 {#sizes}

`defaultSize` 是面板的初始占比，`minSize` 与 `maxSize` 是拖动的下限与上限。三者都是百分比。不指定 `defaultSize` 时，剩余空间在未指定的面板之间均分。

约束用于防止面板被拖到不可用的宽度，例如目录窄到读不出条目。

同一组内要么都给 `defaultSize`，要么都不给。均分是在浏览器里算出来的，服务端不知道容器尺寸，未指定的面板只能退回等分基准；此时若相邻面板给了 `defaultSize`，服务端渲染的第一帧比例会明显失真，进入浏览器后才跳回正确值。都不指定则各占等份，服务端与浏览器一致。

<Demo name="splitter/sizes" />

### 可收起 {#collapsible}

`collapsible` 允许面板被拖到 `collapsedSize` 并停在那里，松手后不会弹回 `minSize`。`collapsedSize` 默认为 `0`，即完全收起。

这与 `minSize` 是两件事：`minSize` 是拖动过程中的下限，`collapsible` 则是越过下限后吸附到收起态。

<Demo name="splitter/collapsible" />

### 嵌套 {#nested}

面板内可以再放一个 `Splitter`，方向通常与外层相反，用于「目录 + 编辑 + 预览」这类三分区布局。内层容器用 `h-full` 撑满所在面板。

<Demo name="splitter/nested" />

### 记住尺寸 {#persist}

`autoSaveId` 会把当前比例存入浏览器本地存储，下次进入页面时恢复。同一页面上的多个分栏要用不同的标识，否则会互相覆盖。

标识一旦发布就不宜更改，改动后用户已保存的比例会失效并退回默认值。

<Demo name="splitter/persist" />

### 分隔线名称 {#label}

分隔线自带无障碍名，随界面语言给出。当页面上有多条分隔线、仅凭默认名称无法区分时，用 `label` 分别命名。

<Demo name="splitter/label" />

## 无障碍 {#a11y}

- 分隔线可获得焦点，聚焦时显示焦点环；方向键按固定步长调整比例，与拖动等效。
- 分隔线的角色与当前比例由底层原语给出，屏幕阅读器会读出名称与当前百分比。
- 默认无障碍名取自界面语言（简体中文为「调整面板大小」），`label` 可覆盖。多条分隔线并存时应当分别命名。
- 分隔线不是装饰，不要用 `aria-hidden` 或负 `tabindex` 把它从焦点序列中移除，那会让键盘用户无法调整比例。

## API {#api}

### Splitter {#props}

| 属性         | 类型                         | 默认值         | 说明                     |
| ------------ | ---------------------------- | -------------- | ------------------------ |
| `direction`  | `'horizontal' \| 'vertical'` | `'horizontal'` | 分栏轴向                 |
| `autoSaveId` | `string`                     | —              | 本地存储中记录比例的标识 |
| `class`      | `string`                     | —              | 追加到根元素的类         |

| 插槽      | 说明                   |
| --------- | ---------------------- |
| `default` | 交替排列的面板与分隔线 |

### SplitterPanel {#panel}

| 属性            | 类型      | 默认值  | 说明                       |
| --------------- | --------- | ------- | -------------------------- |
| `defaultSize`   | `number`  | —       | 初始占比，百分比           |
| `minSize`       | `number`  | —       | 拖动下限，百分比           |
| `maxSize`       | `number`  | `100`   | 拖动上限，百分比           |
| `collapsible`   | `boolean` | `false` | 越过下限后是否吸附到收起态 |
| `collapsedSize` | `number`  | `0`     | 收起态的占比，百分比       |
| `class`         | `string`  | —       | 追加到根元素的类           |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 面板内容 |

### SplitterHandle {#handle}

| 属性    | 类型     | 默认值       | 说明             |
| ------- | -------- | ------------ | ---------------- |
| `label` | `string` | 取自界面语言 | 分隔线的无障碍名 |
| `class` | `string` | —            | 追加到根元素的类 |
