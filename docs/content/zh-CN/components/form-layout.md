---
title: FormLayout
description: 把字段分组排成栅格，带有标题与说明。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/form-layout/FormLayout.vue
---

<Demo name="form-layout/hero" />

## 用法 {#usage}

```ts
import { FormLayout } from '@hina-ui/vue'
```

表单布局把一组相关的字段放进一个 `fieldset`，`legend` 是这组字段的标题，`description` 是说明；`columns` 决定字段排成几列，窄屏时自动收成一列。它通常放在 [Form](/components/form) 里，把长表单分成几个部分；单独使用也可以。

<Demo name="form-layout/basic" />

## 示例 {#examples}

### 标签列对齐 {#aligned}

在布局上统一设置 `orientation`、`label-width` 和 `description-placement`，内部 FormField 会继承这些设置，也可以逐项覆盖。嵌套 FormLayout 继承外层配置，其覆盖值只作用于自己的后代。`columns` 仍表示一行放几个字段，不表示标签与控件的列数。

响应式模式下，每个字段的可用宽度小于 `32rem` 时改为纵向排列。没有标签和标签侧说明的字段占满整行，适合包装自带文案的 Switch 或 Checkbox。

<Demo name="form-layout/aligned" />

### 多列 {#columns}

`columns` 取 1 到 4；需要占满一行的字段给它加上 `sm:col-span-2` 这类跨列的类。

<Demo name="form-layout/columns" />

### 分组 {#sections}

一个表单里放多个布局，每组各有标题与说明，表单的间距把各组隔开。

<Demo name="form-layout/sections" />

### 禁用一组 {#disabled}

`disabled` 禁用这一组里的所有字段；表单整体禁用时，每一组也随之禁用。

<Demo name="form-layout/disabled" />

## 行为 {#behavior}

- 栅格从 `sm` 断点起按 `columns` 分列，更窄的屏幕上是一列；四列在 `sm` 到 `lg` 之间先收成两列。
- 组内字段照常通过 `name` 从表单取得错误，布局不改变字段与表单的关系。
- `disabled` 同时写到 `fieldset` 上并传给组内的字段。

## 无障碍 {#a11y}

- 根元素是 `fieldset`，标题是 `legend`，辅助技术会把组名读在每个字段之前。
- 说明文字通过 `aria-describedby` 关联到 `fieldset`。

## API {#api}

### Props {#props}

| 属性                   | 类型                                         | 默认值       | 说明                           |
| ---------------------- | -------------------------------------------- | ------------ | ------------------------------ |
| `legend`               | `string`                                     | —            | 这组字段的标题                 |
| `description`          | `string`                                     | —            | 说明文字                       |
| `columns`              | `1 \| 2 \| 3 \| 4`                           | `1`          | 栅格列数                       |
| `orientation`          | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | 后代字段的默认布局             |
| `descriptionPlacement` | `'label' \| 'control'`                       | `'control'`  | 后代字段的默认说明位置         |
| `labelWidth`           | `string \| number`                           | `'10rem'`    | 统一标签列宽：CSS 长度或像素数 |
| `disabled`             | `boolean`                                    | `false`      | 是否禁用整组字段               |
| `class`                | `string`                                     | —            | 追加至根元素的类名             |

### 插槽 {#slots}

| 插槽          | 说明     |
| ------------- | -------- |
| default       | 字段     |
| `legend`      | 标题内容 |
| `description` | 说明内容 |
