---
title: Tree
description: 支持逐级展开、父子联动勾选和半选状态的独立树形列表。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/tree/Tree.vue
  - label: Reka Tree
    href: https://reka-ui.com/docs/components/tree
---

<Demo name="tree/hero" />

## 用法 {#usage}

```ts
import { Tree, type TreeNode, type TreeValue } from '@hina-ui/vue'
```

`Tree` 直接渲染树形列表；需要带触发器的单选浮层时，使用 [TreeSelect](/components/tree-select)。通过 `items` 提供节点，`children` 定义下一级。点击展开箭头只改变展开状态，点击节点文字或按空格、Enter 改变选择。

默认单选，`v-model` 为节点的 `value`，再次点击当前节点会取消选择并写入 `null`。

<Demo name="tree/basic" />

## 示例 {#examples}

### 虚拟滚动 {#virtual}

`virtualize` 按需渲染可见范围附近的条目，与 [VirtualList](/components/virtual-list) 共用测量与滚动底层。默认关闭；可传 `{ estimateSize, overscan }` 调整预估行高和两侧预渲染数量，行高会按实际内容测量。键盘导航覆盖完整数据，禁用项会跳过。 只对展开后的可见节点进行虚拟化，父子导航与勾选状态不依赖节点是否挂载。 `maxHeight` 默认 `320px`，仅开启虚拟化时生效，可传数字或 CSS 长度。 条目离开渲染范围后会卸载；插槽内需要持久保留的状态应按唯一 value 存在外部。

<Demo name="tree/virtual" />

### 多选勾选与半选 {#multiple}

设置 `multiple` 显示勾选框，`v-model` 改为 `TreeValue[]`。勾选父节点会选中所有可用后代，取消父节点会清除这些选择；点击半选父节点会补全勾选。部分后代被选中时，父节点显示横线；全部可用子节点选中后，父节点显示勾选。

状态按完整树计算，折叠不会清除选择或改变半选结果。更新事件返回所有完整勾选节点的值，包含自动勾选的父节点；半选节点不写入数组。已知节点按树的前序排列，未出现在当前 `items` 中的绑定值会保留。

外部回填可以只传叶子值，父节点状态会自动推导；传入父节点值会勾选它的可用后代。组件不会仅因初始化、展开或数据刷新而主动改写绑定值。勾选框沿用 [Checkbox](/components/checkbox) 的视觉与动效。

<Demo name="tree/multiple" />

### 控制展开 {#expanded}

`defaultExpanded` 设置初始展开节点，`v-model:expanded` 可在外部控制展开状态。它们都使用节点的原始 `value`；传入 `expanded` 时优先使用受控值，包含空数组。没有子节点或 `children: []` 的节点不会显示展开箭头。

<Demo name="tree/expanded" />

### 自定义节点 {#custom}

`node` 插槽替换节点文字区域，`trailing` 插槽位于行尾，两者都接收原节点及 `selected`、`indeterminate`、`expanded`、`disabled` 状态。`selected` 仅表示完整选中；半选时为 `false`，`indeterminate` 为 `true`。展开箭头和勾选框由组件保留。

示例通过 [Tag](/components/tag) 显示完整选中和部分选中状态。

<Demo name="tree/custom" />

### 禁用 {#disabled}

节点的 `disabled` 会禁用该节点及其子树，阻止点击、键盘选择和展开。父子勾选联动跳过禁用子树，父节点的全选、半选判断也不计入它们；原有绑定值保留。只有禁用子节点的可用父节点，可以单独勾选。

组件的 `disabled` 禁用整棵树，已有选择仍可见。[FormField](/components/form-field) 的禁用、校验状态、标题和描述关联会自动传递到树上。

<Demo name="tree/states" />

### 滚动 {#scroll}

组件自身不限制高度，也不添加面板背景或边框。需要限制可见高度时，用 [ScrollArea](/components/scroll-area) 包裹树。

<Demo name="tree/scroll" />

### 空状态 {#empty}

没有节点时显示语言包中的空状态文字，可通过 `empty` 插槽替换。空状态使用 `role="status"`，不会产生一个没有节点的 `role="tree"`。

<Demo name="tree/empty" />

## 键盘与无障碍 {#a11y}

- 树为 `role="tree"`，节点为 `role="treeitem"`，保留层级、同级位置和展开状态。使用 `aria-label`、`aria-labelledby` 或 [FormField](/components/form-field) 提供名称。
- 单选用 `aria-selected` 表达选择；多选用 `aria-checked`，半选为 `mixed`。勾选框是节点状态的视觉表现，不会增加额外的 Tab 停靠点。
- 上下方向键移动焦点，Home / End 到达首尾可用节点；空格和 Enter 改变选择。
- 向行尾方向的箭头展开节点或进入子级，向行首方向的箭头收起节点或返回父级；RTL 下左右键互换。禁用节点不进入键盘焦点序列。

## API {#api}

### Props 与双向绑定 {#props}

| 属性              | 类型                               | 默认值  | 说明                                 |
| ----------------- | ---------------------------------- | ------- | ------------------------------------ |
| `items`           | `TreeNode[]`                       | —       | 必填。树节点                         |
| `virtualize`      | `VirtualizeOptions`                | `false` | 虚拟滚动；预估行高按内容，overscan 6 |
| `maxHeight`       | `number \| string`                 | `320`   | 虚拟滚动视口的最大高度               |
| `multiple`        | `boolean`                          | `false` | 启用父子联动的多选勾选               |
| `modelValue`      | `TreeValue \| TreeValue[] \| null` | —       | 单选值或多选值数组，支持 `v-model`   |
| `defaultExpanded` | `TreeValue[]`                      | `[]`    | 初始展开节点                         |
| `expanded`        | `TreeValue[]`                      | —       | 展开节点，支持 `v-model:expanded`    |
| `disabled`        | `boolean`                          | `false` | 禁用整棵树                           |
| `invalid`         | `boolean`                          | `false` | 标记校验失败                         |
| `class`           | `string`                           | —       | 追加到树根节点的类名                 |

### 插槽 {#slots}

| 插槽       | 参数           | 说明                     |
| ---------- | -------------- | ------------------------ |
| `node`     | `TreeNodeSlot` | 节点内容                 |
| `trailing` | `TreeNodeSlot` | 行尾内容，不提供时不占位 |
| `empty`    | —              | 空状态内容               |

### 节点类型 {#types}

```ts
export type TreeValue = string | number

export interface TreeNode {
  value: TreeValue
  label: string
  description?: string
  disabled?: boolean
  children?: TreeNode[]
}

export interface TreeNodeSlot {
  node: TreeNode
  selected: boolean
  indeterminate: boolean
  expanded: boolean
  disabled: boolean
}
```

`value` 必须在整棵树中唯一，数字 `1` 与字符串 `'1'` 是不同的值。`description` 默认显示在节点文字下方；`disabled` 插槽参数包含从祖先和组件继承的禁用状态。

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
