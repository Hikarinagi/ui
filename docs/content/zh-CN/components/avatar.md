---
title: Avatar
description: 代表一个用户或者实体的圆形头像。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/avatar/Avatar.vue
  - label: Tag
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/tag/Tag.vue
---

<Demo name="avatar/hero" />

## 用法 {#usage}

```ts
import { Avatar } from '@hikarinagi/ui'
```

`src` 是头像图片，`name` 是这个人的名字。图片加载成功时显示图片，否则按名字显示首字母，连名字也没有时显示一个通用图标。

<Demo name="avatar/basic" />

## 示例 {#examples}

### 尺寸 {#sizes}

三档分别是 24、32 与 40 像素。头像恒为圆形，不提供方形与圆角档位。

<Demo name="avatar/sizes" />

### 回退 {#fallback}

首字母按书写系统区分：中日韩文的名字取第一个字，西文的名字取前两段的首字母。图片加载失败时同样回退到首字母，坏掉的图片不会露出来。

<Demo name="avatar/fallback" />

### 头像组 {#group}

`AvatarGroup` 把多个头像叠在一起。`max` 限制显示的数量，多出来的折成一个 `+N`。组上的 `size` 统一整组的尺寸，子头像自己写的 `size` 优先。

<Demo name="avatar/group" />

### 自定义内容 {#custom}

默认插槽覆盖内置的回退内容，可以放图标或者任意短文本。

<Demo name="avatar/custom" />

## 行为 {#behavior}

- 图片按 `object-fit: cover` 填满圆形，长宽比不同的图不会被拉变形。
- 图片加载期间显示回退内容，加载成功后换成图片。
- `delayMs` 推迟回退内容的出现，用于避免图片很快加载完时首字母一闪而过。

## 无障碍 {#a11y}

- 有图片时 `alt` 是它的替代文本，不写 `alt` 时取 `name`。
- 首字母与图标形态是纯装饰，屏幕阅读器读出的是周围的名字文本，头像本身不重复播报。

## API {#api}

| 属性      | 类型                   | 默认值 | 说明                            |
| --------- | ---------------------- | ------ | ------------------------------- |
| `src`     | `string`               | —      | 头像图片地址                    |
| `alt`     | `string`               | —      | 图片的替代文本，缺省时取 `name` |
| `name`    | `string`               | —      | 用于生成首字母的名字            |
| `size`    | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸                            |
| `delayMs` | `number`               | —      | 推迟回退内容出现的毫秒数        |
| `class`   | `string`               | —      | 追加至根元素的类名              |

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 覆盖内置的回退内容 |

### AvatarGroup {#group-api}

| 属性    | 类型                   | 默认值 | 说明                           |
| ------- | ---------------------- | ------ | ------------------------------ |
| `max`   | `number`               | —      | 最多显示几个，其余折成计数     |
| `size`  | `'sm' \| 'md' \| 'lg'` | —      | 整组的尺寸，子头像可以各自覆盖 |
| `class` | `string`               | —      | 追加至容器的类名               |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 一组头像 |
