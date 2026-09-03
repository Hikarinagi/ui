---
title: Button
description: 触发一次操作的按钮。变体决定视觉样式，色调决定语义。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/button/Button.vue
---

<Demo name="button/hero" />

## 用法 {#usage}

```ts
import { Button } from '@hina-ui/vue'
```

同一界面中仅设置一个主操作，其余操作采用较轻的变体，取消类操作采用中性色调。

<Demo name="button/basic" />

## 示例 {#examples}

### 变体 {#variants}

共五种视觉样式，从实心到纯文字，视觉重量依次减轻。`link` 只保留文字与下划线，没有底色与按下效果。

<Playground
  name="Button"
  label="按钮"
  :controls="[
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost', 'link'] },
    { prop: 'tone', options: ['accent', 'neutral', 'danger'] },
  ]"
/>

### 色调 {#tones}

accent 用于主操作，neutral 用于次要操作与取消，danger 用于不可撤销的操作。色调与变体相互独立。

<Playground
  name="Button"
  label="确认"
  :controls="[
    { prop: 'tone', options: ['accent', 'neutral', 'danger'] },
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost'] },
  ]"
/>

### 尺寸 {#sizes}

共三种尺寸，高度与内边距随密度缩放。

<Playground
  name="Button"
  label="按钮"
  :controls="[
    { prop: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
    { prop: 'variant', options: ['solid', 'soft', 'outline'] },
  ]"
/>

### 密度 {#density}

密度在容器上声明，对容器内的所有控件生效。上排为默认密度，下排为紧凑密度。

<Demo name="button/density" />

### 图标 {#icons}

`#icon` 用于放置前置图标，`#trailing` 用于放置后置图标。

<Demo name="button/icons" />

### 仅图标 {#icon-only}

仅包含图标时使用 `IconButton`。该组件要求提供 `label`，该值同时用作无障碍名称与悬停提示文字。

<Demo name="button/icon-only" />

### 按钮组 {#group}

`ButtonGroup` 将多个按钮拼接为一个整体，相邻的圆角与边框会自动合并。设置 `divider` 可以在相邻按钮之间添加分隔线。

<Demo name="button/group" />

### 状态 {#states}

设置 `loading` 显示加载指示器并阻止点击，设置 `disabled` 禁用按钮。

<Playground
  name="Button"
  label="保存"
  :controls="[
    { prop: 'loading' },
    { prop: 'disabled' },
    { prop: 'variant', options: ['solid', 'soft', 'outline', 'ghost'] },
  ]"
/>

加载指示器优先替换前置图标；无前置图标时替换后置图标；两者均无时居中覆盖于文字之上。此时文字仅设为透明而保留在原位，按钮宽度保持不变。

<Demo name="button/loading" />

### 提交中 {#pending}

点击后进入加载状态，期间不再响应点击，文案随之切换。

<Demo name="button/loading-state" />

### 第三方登录 {#sign-in}

设置 `block` 使按钮占满容器宽度，品牌图标放置于前置插槽。

<Demo name="button/sign-in" />

### 形状与宽度 {#shape}

设置 `pill` 使按钮呈胶囊形，设置 `block` 使其占满容器宽度。

<Playground
  name="Button"
  label="继续"
  :controls="[{ prop: 'pill' }, { prop: 'block' }, { prop: 'size', options: ['sm', 'md', 'lg'], default: 'md' }]"
/>

### 作为链接 {#link}

通过 `as` 将按钮渲染为 `a` 元素或者 `NuxtLink`，外观与交互保持一致。

<Demo name="button/link" />

仅需链接外观而不需要按钮语义时，应使用 `Link` 组件，而非 `variant="link"`。

如果目标组件需要自行渲染根元素，改用 `asChild`：按钮不渲染自身，而是将类名与行为合并至唯一的子元素。

```vue
<template>
  <Button as-child>
    <NuxtLink to="/guide/installation">开始使用</NuxtLink>
  </Button>
</template>
```

## 自定义样式 {#styling}

### Tailwind 类名 {#class}

传入的 `class` 经 tailwind-merge 合并，同一属性以后声明者为准，无需 `!important`。

<Demo name="button/custom" />

### 全局覆盖 {#global}

按钮的颜色、圆角与焦点环均取自语义变量。在任意作用域中重新声明这些变量，该作用域内按钮的外观会随之改变。

```css
.brand-purple {
  --hn-accent: oklch(0.55 0.22 300);
  --hn-accent-on: #ffffff;
  --hn-focus-ring: oklch(0.5 0.22 300);
}
```

## 样式参考 {#style-reference}

### 尺寸变量 {#size-tokens}

| 变量                 | 默认       | 紧凑       |
| -------------------- | ---------- | ---------- |
| `--hn-control-h-sm`  | `1.75rem`  | `1.5rem`   |
| `--hn-control-h-md`  | `2.25rem`  | `1.875rem` |
| `--hn-control-h-lg`  | `2.75rem`  | `2.25rem`  |
| `--hn-control-px-sm` | `0.625rem` | `0.375rem` |
| `--hn-control-px-md` | `1rem`     | `0.5rem`   |
| `--hn-control-px-lg` | `1.25rem`  | `0.75rem`  |
| `--hn-control-gap`   | `0.375rem` | `0.25rem`  |

紧凑密度适用于后台表格一类的密集界面。密度不随设备类型变化，如果触摸屏上需要更大的点击目标，应当显式使用默认密度。

### 状态属性 {#state-attrs}

渲染为原生 `button` 时直接使用原生的 `disabled`。渲染为其他元素时不具备原生的禁用语义，改由以下属性表示状态。

| 属性            | 含义                         |
| --------------- | ---------------------------- |
| `data-loading`  | 加载中                       |
| `aria-busy`     | 加载中，供屏幕阅读器播报     |
| `data-disabled` | 不可用                       |
| `aria-disabled` | 不可用，供屏幕阅读器播报     |
| `tabindex="-1"` | 不可用，键盘不会聚焦到该按钮 |

加载中的按钮同样视为不可用。

### 悬停与按下 {#interaction}

- 焦点环仅在键盘聚焦时出现，鼠标点击不留下轮廓。
- 悬停与按下时会叠加一层半透明色，而不是替换底色；触摸设备上不会残留悬停状态。
- 波纹自按下的位置扩散，此时半透明层的按下效果不再叠加。`link` 变体没有波纹。

## 无障碍 {#a11y}

- 仅包含图标的按钮必须提供无障碍名称，未提供时开发环境将输出告警。建议直接使用 `IconButton`。
- 加载中的按钮带有 `aria-busy`，屏幕阅读器会播报忙碌状态。

## API {#api}

### Props {#props}

| 属性       | 类型                                                  | 默认值     | 说明                              |
| ---------- | ----------------------------------------------------- | ---------- | --------------------------------- |
| `as`       | `string \| Component`                                 | `'button'` | 渲染的元素或组件                  |
| `asChild`  | `boolean`                                             | `false`    | 不渲染自身，合并至唯一的子元素    |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'solid'`  | 视觉样式                          |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'accent'` | 语义色调                          |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | `'md'`     | 尺寸                              |
| `type`     | `'button' \| 'submit' \| 'reset'`                     | `'button'` | 原生 button 类型                  |
| `iconOnly` | `boolean`                                             | `false`    | 是否为正方形且仅包含图标          |
| `block`    | `boolean`                                             | `false`    | 是否占满容器宽度                  |
| `pill`     | `boolean`                                             | `false`    | 是否呈胶囊形                      |
| `loading`  | `boolean`                                             | `false`    | 是否处于加载状态                  |
| `disabled` | `boolean`                                             | `false`    | 是否禁用                          |
| `ripple`   | `boolean`                                             | `true`     | 是否启用按下波纹，link 变体不生效 |
| `class`    | `string`                                              | —          | 追加至根元素的类名                |

### Slots {#slots}

| 插槽       | 说明                             |
| ---------- | -------------------------------- |
| `default`  | 按钮内容                         |
| `icon`     | 前置图标，加载时被指示器替换     |
| `trailing` | 后置图标，仅在无前置图标时被替换 |
