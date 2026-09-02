---
title: PasswordInput
description: 输入密码的输入框，可以切换明文显示。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/password-input/PasswordInput.vue
  - label: 变体定义
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/input/input.variants.ts
---

<Demo name="password-input/hero" />

## 用法 {#usage}

```ts
import { PasswordInput } from '@hina-ui/vue'
```

密码输入框在输入区末尾带一个切换明文与密文的按钮，`v-model` 绑定文本。未声明的属性都会传给 `input`，应当传入 `autocomplete`：登录用 `current-password`，注册与修改密码用 `new-password`。

<Demo name="password-input/basic" />

## 示例 {#examples}

### 可见性 {#visible}

`visible` 决定是否显示明文，支持 `v-model:visible`。两个输入框共用同一个值时会一起切换。

<Demo name="password-input/visible" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="password-input/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="password-input/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 不可编辑。

<Demo name="password-input/states" />

## 行为 {#behavior}

- 点击切换按钮不会让输入区失焦，切换后可以继续输入。
- 切换只改变显示方式，不改变值。
- 悬停、聚焦、错误与禁用的表现与输入框相同。

## 无障碍 {#a11y}

- 切换按钮可以用 Tab 到达，名称随状态在「显示密码」与「隐藏密码」之间切换。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性         | 类型                       | 默认值      | 说明                                 |
| ------------ | -------------------------- | ----------- | ------------------------------------ |
| `modelValue` | `string`                   | —           | 文本                                 |
| `visible`    | `boolean`                  | `false`     | 是否显示明文，支持 `v-model:visible` |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | 形态                                 |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                                 |
| `invalid`    | `boolean`                  | `false`     | 是否校验未通过                       |
| `disabled`   | `boolean`                  | `false`     | 是否禁用                             |
| `class`      | `string`                   | —           | 追加至根元素的类名                   |

| 事件                | 参数               | 说明       |
| ------------------- | ------------------ | ---------- |
| `update:modelValue` | `value: string`    | 文本变化   |
| `update:visible`    | `visible: boolean` | 可见性变化 |
