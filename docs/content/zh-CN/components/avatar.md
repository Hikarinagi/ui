---
title: Avatar
description: 代表一个用户或实体的圆形头像。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/avatar/Avatar.vue
---

<Demo name="avatar/hero" />

## 用法 {#usage}

```ts
import { Avatar } from '@hina-ui/vue'
```

`src` 是头像图片，`name` 是对应的名称。图片加载成功时显示图片，加载失败或没有图片时显示名称的首字母，没有名称时显示通用图标。

<Demo name="avatar/basic" />

## 示例 {#examples}

### 尺寸 {#sizes}

三档分别是 24、32 和 40 像素。头像始终为圆形，不提供方形和圆角档位。

<Demo name="avatar/sizes" />

### 回退 {#fallback}

首字母按书写系统区分：中日韩文的名称取第一个字，西文的名称取前两段的首字母。图片加载失败时同样回退到首字母，加载失败的图片不会显示出来。

<Demo name="avatar/fallback" />

### 头像组 {#group}

`AvatarGroup` 把多个头像叠在一起。`max` 限制显示的数量，超出的部分合并为一个 `+N`。`AvatarGroup` 的 `size` 统一整组的尺寸，单个头像自身的 `size` 优先。

<Demo name="avatar/group" />

叠放间距和分隔环直接作用于组内的外层元素。自定义头像即使包了一层触发器，也不需要把组的布局类名转发给内层头像。包装元素的圆角和装饰仍由自定义组件控制。

自定义子组件可以从包根导入 `useAvatarGroup`，响应式读取整组的尺寸；未放在头像组内时返回 `null`。例如在自定义头像组件中保留「自身尺寸优先」的规则：

```ts
import { computed } from 'vue'
import { useAvatarGroup, type AvatarVariants } from '@hina-ui/vue'

const props = defineProps<{ size?: AvatarVariants['size'] }>()
const group = useAvatarGroup()
const size = computed(() => props.size ?? group?.value.size ?? 'md')
```

`max` 按默认插槽提供的条目计数，支持直接写在插槽中的 `v-for`。自定义组件内部渲染的多个头像不会分别计数；需要准确的 `+N` 时，让每个插槽条目代表一个头像。

### 自定义内容 {#custom}

默认插槽覆盖内置的回退内容，可以是图标或短文本。

<Demo name="avatar/custom" />

## 行为 {#behavior}

- 头像由 [Image](/components/image) 渲染，因此地址同样经过 `provideImageResolver`，加载期间由骨架占位。
- 图片按 `object-fit: cover` 填满圆形，长宽比不同的图片不会变形。
- 没有 `src` 或图片加载失败时显示回退内容，失败的图片会被移除。
- Image 的其余属性可以直接写在 Avatar 上，例如 `fallback`、`lazy`、`eager`，会原样透传。

## 无障碍 {#a11y}

- 有图片时 `alt` 是它的替代文本，未设置 `alt` 时取 `name`。
- 首字母和图标只是装饰，屏幕阅读器读出的是周围的名称文本，不重复播报头像本身。

## API {#api}

| 属性    | 类型                   | 默认值 | 说明                            |
| ------- | ---------------------- | ------ | ------------------------------- |
| `src`   | `string`               | —      | 头像图片地址                    |
| `alt`   | `string`               | —      | 图片的替代文本，缺省时取 `name` |
| `name`  | `string`               | —      | 用于生成首字母的名称            |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸                            |
| `class` | `string`               | —      | 追加至根元素的类名              |

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 覆盖内置的回退内容 |

### AvatarGroup {#group-api}

| 属性    | 类型                   | 默认值 | 说明                           |
| ------- | ---------------------- | ------ | ------------------------------ |
| `max`   | `number`               | —      | 最多显示的数量，其余合并为计数 |
| `size`  | `'sm' \| 'md' \| 'lg'` | —      | 整组的尺寸，单个头像可以覆盖   |
| `class` | `string`               | —      | 追加至容器的类名               |

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 一组头像 |

### useAvatarGroup {#group-context}

`useAvatarGroup()` 返回 `ComputedRef<AvatarGroupContext> | null`。`AvatarGroupContext` 也从包根导出。

| 字段   | 类型                     | 说明                                             |
| ------ | ------------------------ | ------------------------------------------------ |
| `size` | `AvatarVariants['size']` | 最近的头像组设置的尺寸；组未指定时为 `undefined` |
