---
title: DisclosureIcon
description: 随展开与收起旋转的指示物。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/disclosure-icon/DisclosureIcon.vue
---

<Demo name="disclosure-icon/hero" />

## 用法 {#usage}

```ts
import { DisclosureIcon } from '@hina-ui/vue'
```

指示物是展开控件上随开合旋转的那个箭头，各展开类组件共用同一个组件。多数情况下无需手动放置：`Collapsible` 的触发器已经自带，将来的 `Accordion`、`Select`、`Tree` 同样如此。

需要手动放置的情形只有一种，即触发器由调用方提供。`DropdownMenu` 的触发器可以是任意控件，`Collapsible` 使用 `as-child` 时亦然。

置入触发器即可，无需编写类名，也无需处理过渡：触发器携带识别标记，指示物据此获取状态。

## 示例 {#examples}

### 方向 {#direction}

`down` 静止时朝下，展开时旋转半圈，适用于下拉菜单、手风琴等向下展开的场景；`end` 静止时朝向行末，展开时旋转四分之一圈，适用于侧栏分组、树形节点等展开层级的场景。

<Demo name="disclosure-icon/direction" />

此处使用 `end` 而非 `right`，是为了在从右向左的语言中能够整体翻转。

### 更换字形 {#custom}

默认插槽用于替换字形，旋转仍由组件负责。加号旋转四分之一圈后恰好成为叉号。

<Demo name="disclosure-icon/custom" />

### 状态由外部持有时 {#open}

当状态不在祖先触发器上，而由外部变量持有时，传入 `open`。传入之后，指示物不再读取祖先的状态。

<Demo name="disclosure-icon/open" />

## 边界 {#boundary}

该组件表达的是状态，而非方向。面包屑之间的 `>`、子菜单末尾的箭头都不随状态变化，它们不属于该组件的职责，各自保持静态图标即可。

## 无障碍 {#a11y}

- 指示物始终带有 `aria-hidden`。开合状态已由触发器的 `aria-expanded` 播报，重复播报属于冗余信息。
- 指示物不可聚焦，键盘焦点不会停留其上。

## API {#api}

### Props {#props}

| 属性        | 类型              | 默认值   | 说明                                     |
| ----------- | ----------------- | -------- | ---------------------------------------- |
| `direction` | `'down' \| 'end'` | `'down'` | 静止朝向，同时决定旋转半圈还是四分之一圈 |
| `open`      | `boolean`         | —        | 自行指定状态；不传则读取祖先触发器       |
| `class`     | `string`          | —        | 追加至根元素的类名                       |

### Slots {#slots}

| 插槽      | 说明                       |
| --------- | -------------------------- |
| `default` | 替换字形，旋转仍由组件负责 |
