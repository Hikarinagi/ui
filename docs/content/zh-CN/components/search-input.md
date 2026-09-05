---
title: SearchInput
description: 输入关键词进行搜索的输入框。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/search-input/SearchInput.vue
---

<Demo name="search-input/hero" />

## 用法 {#usage}

```ts
import { SearchInput } from '@hina-ui/vue'
```

搜索输入框起始处带搜索图标，有内容时末尾出现清除按钮，`v-model` 绑定关键词。按 Enter 发出 `search` 事件并附带当前值，按 Esc 清空。未声明的属性都会传给 `input`。

<Demo name="search-input/basic" />

## 示例 {#examples}

### 加载中 {#loading}

`loading` 把搜索图标换成加载指示器，用于展示搜索请求正在进行。

<Demo name="search-input/loading" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="search-input/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="search-input/variants" />

### 状态 {#states}

`disabled` 不可编辑。关闭 `clearable` 后不显示清除按钮。

<Demo name="search-input/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向输入框，错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)，回车提交与提交按钮的行为保持默认。

<Demo name="search-input/form" />

## 行为 {#behavior}

- 清除按钮只在有内容且未禁用时出现，点击后不会让输入区失焦。
- Esc 只在有内容时清空，内容为空时不做处理。
- 悬停、聚焦与禁用的表现与输入框相同。

## 无障碍 {#a11y}

- 输入区为 `type="search"`，移动端键盘的确认键显示为搜索。
- 清除按钮可以用 Tab 到达，名称随语言包本地化。`loading` 时根元素设置 `aria-busy`。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。

## API {#api}

### Props {#props}

| 属性         | 类型                       | 默认值      | 说明               |
| ------------ | -------------------------- | ----------- | ------------------ |
| `modelValue` | `string`                   | `''`        | 关键词             |
| `clearable`  | `boolean`                  | `true`      | 是否显示清除按钮   |
| `loading`    | `boolean`                  | `false`     | 是否显示加载指示器 |
| `variant`    | `'primary' \| 'secondary'` | `'primary'` | 形态               |
| `size`       | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸               |
| `disabled`   | `boolean`                  | `false`     | 是否禁用           |
| `class`      | `string`                   | —           | 追加至根元素的类名 |

| 事件                | 参数            | 说明              |
| ------------------- | --------------- | ----------------- |
| `update:modelValue` | `value: string` | 关键词变化        |
| `search`            | `value: string` | 按 Enter 提交搜索 |
| `clear`             | —               | 关键词被清空      |
