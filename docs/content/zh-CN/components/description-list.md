---
title: DescriptionList
description: 成组的名称与取值，用于详情页的属性罗列。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/description-list/DescriptionList.vue
---

<Demo name="description-list/hero" />

## 用法 {#usage}

```ts
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@hina-ui/vue'
```

`DescriptionList` 渲染为原生的 `dl`，名称用 `DescriptionTerm`（`dt`），取值用 `DescriptionDetails`（`dd`）。默认自上而下排列，名称使用中等字重。

<Demo name="description-list/basic" />

## 示例 {#examples}

### 两列布局 {#columns}

`orientation="horizontal"` 把名称与取值排成左右两列：名称一列，取值一列。后台详情页多用这种形态。

<Demo name="description-list/columns" />

名称列的宽度取最长的名称。`--hn-dl-term-width` 可以改成固定宽度，多个列表上下对齐时使用。

::: vue

```vue
<DescriptionList orientation="horizontal" class="[--hn-dl-term-width:8rem]">…</DescriptionList>
```

:::

::: react

```tsx
<DescriptionList orientation="horizontal" className="[--hn-dl-term-width:8rem]">
  …
</DescriptionList>
```

:::

### 一个名称多个取值 {#multiple}

一个 `dt` 后面可以跟多个 `dd`。取值中也可以放入其他组件。

<Demo name="description-list/multiple" />

### 正文中的描述列表 {#prose}

`Prose` 会为其中的原生 `dl` 应用同一套样式。渲染 Markdown 或者富文本时不需要替换标签。

<Demo name="description-list/prose" />

## 无障碍 {#a11y}

- 组件渲染为原生的 `dl`，屏幕阅读器会把名称与取值作为一组朗读。
- `dt` 与 `dd` 必须是 `dl` 的直接子元素，中间不要插入其他容器，否则这层关系会断开。

## API {#api}

### DescriptionList {#props}

| 属性          | 类型                         | 默认值       | 说明                                        |
| ------------- | ---------------------------- | ------------ | ------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向；`horizontal` 时名称与取值各占一列 |
| `class`       | `string`                     | —            | 追加至根元素的类名                          |

| 插槽      | 说明                                           |
| --------- | ---------------------------------------------- |
| `default` | `DescriptionTerm` 与 `DescriptionDetails` 条目 |

### DescriptionTerm {#term}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 名称文字 |

### DescriptionDetails {#details}

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `class` | `string` | —      | 追加至根元素的类名 |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 取值内容 |
