---
title: TreeSelect
description: 从树形层级中选择一项。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tree-select/TreeSelect.vue
  - label: Tree
    href: https://reka-ui.com/docs/components/tree
---

<Demo name="tree-select/hero" />

## 用法 {#usage}

```ts
import { TreeSelect } from '@hina-ui/vue'
```

树形选择框的触发器与 `Select` 相同，浮层里是可以逐层展开的树。`items` 提供节点，每个节点是 `{ value, label }`，带 `children` 的节点可以展开；`v-model` 绑定选中节点的值，任何一级的节点都可以选中。

<Demo name="tree-select/basic" />

## 示例 {#examples}

### 默认展开 {#expanded}

`defaultExpanded` 列出打开时默认展开的节点。已选节点所在的路径总会自动展开。

<Demo name="tree-select/expanded" />

### 定制内容 {#custom}

`node` 插槽定制每个节点的内容。

<Demo name="tree-select/custom" />

### 尺寸 {#sizes}

三档尺寸与输入框相同。

<Demo name="tree-select/sizes" />

### 形态 {#variants}

`primary` 直接放在页面底色上，带边框与阴影；`secondary` 放在卡片等表面内，只有一层浅色底。

<Demo name="tree-select/variants" />

### 状态 {#states}

`invalid` 标出校验未通过，`disabled` 禁用整个选择框，节点上的 `disabled` 只禁用该节点。

<Demo name="tree-select/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向触发器，错误信息由字段渲染并关联到它；校验规则与提交交给 [Form](/components/form)。

<Demo name="tree-select/form" />

## 行为 {#behavior}

- 点击节点前的箭头只展开或者收起，点击节点本身则选中它并关闭浮层。
- 键盘上下方向键移动焦点，右方向键展开、左方向键收起，Enter 或者空格选中。
- 浮层贴着触发器展开，宽度与触发器相同，树超出高度时在浮层内滚动。
- 打开期间页面锁定滚动，点击外部或者按 Esc 关闭。

## 无障碍 {#a11y}

- 触发器为 `role="combobox"`，树为 `role="tree"`，节点为 `role="treeitem"` 并带 `aria-level`、`aria-expanded` 与 `aria-selected`。
- 应当配合 `label` 元素或者 `aria-label` 提供名称。`invalid` 同时设置 `aria-invalid`。

## API {#api}

### Props {#props}

| 属性              | 类型                       | 默认值      | 说明                              |
| ----------------- | -------------------------- | ----------- | --------------------------------- |
| `modelValue`      | `string \| number \| null` | —           | 选中节点的值                      |
| `items`           | `TreeSelectNode[]`         | —           | 节点，见下方类型                  |
| `placeholder`     | `string`                   | 语言包      | 无值时显示的文字                  |
| `defaultExpanded` | `Array<string \| number>`  | `[]`        | 打开时默认展开的节点              |
| `open`            | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open` |
| `variant`         | `'primary' \| 'secondary'` | `'primary'` | 形态                              |
| `size`            | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                              |
| `invalid`         | `boolean`                  | `false`     | 是否校验未通过                    |
| `disabled`        | `boolean`                  | `false`     | 是否禁用                          |
| `class`           | `string`                   | —           | 追加至触发器的类名                |

### 插槽 {#slots}

| 插槽   | 参数                       | 说明           |
| ------ | -------------------------- | -------------- |
| `node` | `{ node: TreeSelectNode }` | 每个节点的内容 |

### 事件 {#events}

| 事件                | 参数                      | 说明         |
| ------------------- | ------------------------- | ------------ |
| `update:modelValue` | `value: string \| number` | 选中值变化   |
| `update:open`       | `open: boolean`           | 浮层开合变化 |

### 类型 {#types}

```ts
interface TreeSelectNode {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
  children?: TreeSelectNode[]
}
```
