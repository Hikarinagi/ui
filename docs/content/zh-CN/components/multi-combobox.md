---
title: MultiCombobox
description: 输入搜索并选择多项。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/multi-combobox/MultiCombobox.vue
  - label: Combobox
    href: https://reka-ui.com/docs/components/combobox
---

<Demo name="multi-combobox/hero" />

## 用法 {#usage}

```ts
import { MultiCombobox } from '@hina-ui/vue'
```

多选组合框是 `Combobox` 的多值形态：在同一个输入面里输入文字缩小范围，从列表中选择多项，已选项以标签排在输入区前面，放不下时换行。`v-model` 绑定选中值的数组，`options` 的类型见 [Select](/components/select#types)。未声明的属性都会传给内部的文本输入，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="multi-combobox/basic" />

它与 `MultiSelect` 的区别在于能否输入：多选选择器只能从固定的选项里挑选，浮层打开期间锁定页面滚动；多选组合框通过输入文字缩小范围，浮层不锁定页面滚动，输入区始终可以输入。与 `TagsInput` 的区别在于值的来源：标签输入框接受任意文字，这里的值必须来自选项。

## 示例 {#examples}

### 虚拟滚动 {#virtual}

`virtualize` 按需渲染可见范围附近的条目，与 [VirtualList](/components/virtual-list) 共用测量与滚动底层。默认关闭；可传 `{ estimateSize, overscan }` 调整预估行高和两侧预渲染数量，行高会按实际内容测量。键盘导航覆盖完整数据，禁用项会跳过。 搜索仍处理完整数据。 条目离开渲染范围后会卸载；插槽内需要持久保留的状态应按唯一 value 存在外部。

<Demo name="multi-combobox/virtual" />

### 远程搜索 {#remote}

`ignoreFilter` 关闭本地筛选，`v-model:search` 提供输入文字，远程搜索结果直接传给 `options`。`selectedOptions` 单独提供已选项资料，[Chip](/components/chip) 按 `v-model` 中的值解析名称；这些资料不会自动加入下拉列表，也不会增加选中项。

组件会记住选项名称，替换或清空搜索结果后，已选标签仍显示名称；外部资料异步到达或名称更新时同步显示。同一值同时出现在两份资料中时，标签名称以 `selectedOptions` 为准。搜索结果如果包含已选值，该行正常显示勾选状态。

示例预先回填三个标签，再请求搜索接口。请求的防抖与取消由调用方负责，`loading` 为真时展开箭头显示加载指示器。

示例请求随文档发布的静态 JSON，并在调用方模拟筛选，无需服务端代理。接入实际接口时替换请求地址与结果映射。

<Demo name="multi-combobox/remote" />

### 定制内容 {#custom}

`option` 插槽定制列表中每一项的内容，例如加上封面与编号。

组件从 `options` 推断完整选项类型，插槽中的 `option` 保留额外字段及其类型；`v-model` 仍绑定选项的 `value` 数组。类型定义见 [Select](/components/select#types)。

<Demo name="multi-combobox/custom" />

### 可清除 {#clearable}

`clearable` 在末尾加一个清除按钮，点击后清空全部并把焦点交回输入区。每个标签都有移除按钮，所以默认不显示清除按钮。

<Demo name="multi-combobox/clearable" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，没有已选项时的高度与同档输入框相等。

<Demo name="multi-combobox/sizes" />

### 状态 {#states}

`invalid` 给输入面加上警示色，`disabled` 禁用整组。`variant="secondary"` 是放在 surface 之内的扁平形态。

<Demo name="multi-combobox/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向输入区，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。值是数组，数量限制写在数组层。

<Demo name="multi-combobox/form" />

## 行为 {#behavior}

- 输入即打开列表并筛选；上下方向键移动高亮，Enter 勾选或者取消勾选，列表保持展开，搜索词与筛选结果保留，方便在同一批结果里连续勾选；清空输入即回到完整列表。
- 点击输入面的空白处或者标签正文即聚焦输入区并打开列表，与点击输入区相同。
- 输入区为空时按退格移除最后一个标签。
- Esc 或者点击外部关闭列表。浮层不锁定页面滚动。
- 已选项在列表中保持勾选状态，再次选择即取消。

## 无障碍 {#a11y}

- 文本输入是 `role="combobox"`，列表为 `role="listbox"`，选项为 `role="option"` 并带 `aria-selected`。
- 通过 `aria-label` 或者 `aria-labelledby` 为文本输入命名；标签的移除按钮、清除按钮与展开按钮都有本地化名称。
- `invalid` 会同时在文本输入上设置 `aria-invalid`。

## API {#api}

### Props {#props}

`T extends SelectOption` 从 `options` 与 `selectedOptions` 推断，默认是 `SelectOption`。

| 属性              | 类型                       | 默认值      | 说明                                            |
| ----------------- | -------------------------- | ----------- | ----------------------------------------------- |
| `modelValue`      | `Array<string \| number>`  | `[]`        | 选中的值                                        |
| `options`         | `SelectItems<T>`           | —           | 选项，类型见 [Select](/components/select#types) |
| `virtualize`      | `VirtualizeOptions`        | `false`     | 虚拟滚动；预估行高按内容，overscan 6            |
| `selectedOptions` | `T[]`                      | —           | 已选项资料，仅用于标签回显，不加入候选列表      |
| `placeholder`     | `string`                   | 语言包      | 无已选项时输入区的占位文字                      |
| `search`          | `string`                   | `''`        | 输入区的文字，支持 `v-model:search`             |
| `ignoreFilter`    | `boolean`                  | `false`     | 是否关闭本地筛选，交给调用方远程搜索            |
| `loading`         | `boolean`                  | `false`     | 是否把展开箭头换成加载指示器                    |
| `clearable`       | `boolean`                  | `false`     | 是否显示清空全部的按钮                          |
| `name`            | `string`                   | —           | 表单字段名                                      |
| `open`            | `boolean`                  | `false`     | 浮层是否打开，支持 `v-model:open`               |
| `variant`         | `'primary' \| 'secondary'` | `'primary'` | 形态                                            |
| `size`            | `'sm' \| 'md' \| 'lg'`     | `'md'`      | 尺寸                                            |
| `disabled`        | `boolean`                  | `false`     | 是否禁用                                        |
| `invalid`         | `boolean`                  | `false`     | 是否处于校验未通过状态                          |
| `class`           | `string`                   | —           | 追加至根元素的类名                              |

### 插槽 {#slots}

| 插槽     | 参数            | 说明               |
| -------- | --------------- | ------------------ |
| `option` | `{ option: T }` | 列表中每一项的内容 |

### 事件 {#events}

| 事件                | 参数                             | 说明         |
| ------------------- | -------------------------------- | ------------ |
| `update:modelValue` | `value: Array<string \| number>` | 选中值变化   |
| `update:search`     | `value: string`                  | 输入文字变化 |
| `update:open`       | `open: boolean`                  | 浮层开合变化 |
| `clear`             | —                                | 全部清空     |

```ts
type VirtualizeOptions = boolean | { estimateSize?: number; overscan?: number }
```
