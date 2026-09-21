---
title: Autocomplete
description: 保留自由文本，支持光标处片段补全。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/autocomplete/Autocomplete.vue
---

<Demo name="autocomplete/hero" />

## 用法 {#usage}

```ts
import { Autocomplete } from '@hina-ui/vue'
```

`v-model` 始终是输入框里的完整字符串。选择候选可以修改这段文本，失焦不会回滚或清空。需要把值限定在选项集合内时，使用 [Combobox](/components/combobox)。

`options` 原样作为候选列表，组件不额外筛选。未提供 `getCompletion` 时，选择候选会用 `option.label` 替换整段文本并关闭列表。键入任意内容也有效。

<Demo name="autocomplete/basic" />

## 示例 {#examples}

### 光标处连续补全 {#completion}

首个示例演示查询片段补全。输入 `sta` 后用方向键选中 `status:`，回车确认；列表保持打开，继续提供 `ok`、`error`、`timeout`。选择值后关闭列表，再按回车应用整条查询。也可以把光标移回已有片段进行替换，后面的文本会保留。

`@query` 提供当前文本与选区，输入、移动光标、改变选区和完成补全时都会通知。`getCompletion(option, context)` 同步返回替换范围与插入文本；范围采用原生输入框的 UTF-16 偏移，左闭右开。组件完成替换后把光标放到插入文本末尾。

```ts
function complete(option, context) {
  const range = locateToken(context)
  return {
    range,
    text: option.label,
    keepOpen: option.kind === 'key',
  }
}
```

`locateToken`、键值判断和候选生成由应用提供。`keepOpen: true` 可连续补全，完成后新的 `query` 事件携带更新后的文本与光标。不要缓存旧选区后再用于替换，应使用 `getCompletion` 本次收到的 `context`。范围超出当前文本时抛出 `RangeError`。

### 远程候选 {#remote}

`loading` 显示加载指示和列表中的状态提示，保留输入文字。异步替换 `options` 会清除旧高亮，新结果不会自动选中第一项。无候选时可以通过 `#empty` 自定义提示；加载文案使用 `#loading`。

请求、防抖、取消和过期响应处理由调用方负责。示例请求随文档部署的静态 JSON，在调用方筛选结果；改为实际搜索接口时保留相同的数据流即可。

<Demo name="autocomplete/remote" />

### 尺寸与状态 {#states}

输入面沿用 [Input](/components/input) 的尺寸与形态。放进 [FormField](/components/form-field) 后自动关联标签、说明、错误和禁用状态。未声明的属性（如 `name`、`maxlength`、`aria-label`）传给内部输入框。

<Demo name="autocomplete/states" />

### 在表单中 {#form}

通过 `FormField` 的 `name` 关联校验规则，错误与提交期间的禁用状态会自动传给输入框。候选只提供补全建议，用户输入的其他文本也可以提交。

将 `@submit` 接到 `Form` 实例的 `submit()`：回车有高亮候选时只完成补全，没有高亮候选时才触发表单校验与提交；保存按钮也走同一套校验。

<Demo name="autocomplete/form" />

## 键盘与焦点 {#keyboard}

- 聚焦、点击或输入时打开列表，保持输入框焦点，不自动高亮首项。
- 上下方向键移动高亮并跳过禁用项，列表内部滚动到当前项，不滚动外层页面。
- 回车有高亮时仅接受候选；没有高亮时关闭列表并触发 `submit(text)`，不会同时触发浏览器表单提交。
- `selectOnTab` 默认关闭。开启后，Tab 只在有高亮候选时接受它并保留输入焦点；没有高亮、Shift+Tab 仍正常移动焦点。
- Esc 先关闭列表；列表已关闭时清空文本并触发 `clear`。关闭和清空都不会应用查询。
- 中文等输入法组词期间不处理候选选择、提交或清除，组词完成后再更新建议。
- 失焦保留文本。`readonly` 可聚焦、选择和复制文本，但不打开建议；`disabled` 禁止交互。

输入框、列表和候选分别使用 `combobox`、`listbox`、`option` 语义，活动项由 `aria-activedescendant` 关联。为组件提供 [FormField](/components/form-field)、关联的标签或 `aria-label`。候选内容插槽用于展示，不应嵌入按钮、链接等独立交互控件。

## API {#api}

### Props {#props}

`T extends AutocompleteOption` 从 `options` 推断，额外业务字段在回调和插槽中保留类型。

| 属性            | 类型                                                        | 默认值      | 说明                                                         |
| --------------- | ----------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| `modelValue`    | `string`                                                    | `''`        | 完整文本，支持 `v-model`                                     |
| `open`          | `boolean`                                                   | `false`     | 浮层状态，支持 `v-model:open`                                |
| `options`       | `readonly T[]`                                              | —           | 当前候选，`value` 在列表中唯一且稳定                         |
| `getCompletion` | `(option: T, context: CompletionContext) => CompletionEdit` | —           | 返回同步文本编辑；默认整段替换为 `label`                     |
| `loading`       | `boolean`                                                   | `false`     | 加载状态；已有候选仍可选，新请求需清除过期候选时由调用方置空 |
| `selectOnTab`   | `boolean`                                                   | `false`     | Tab 接受高亮候选                                             |
| `placeholder`   | `string`                                                    | —           | 占位文字                                                     |
| `variant`       | `'primary' \| 'secondary'`                                  | `'primary'` | 输入面形态                                                   |
| `size`          | `'sm' \| 'md' \| 'lg'`                                      | `'md'`      | 尺寸                                                         |
| `disabled`      | `boolean`                                                   | `false`     | 禁用                                                         |
| `readonly`      | `boolean`                                                   | `false`     | 只读                                                         |
| `invalid`       | `boolean`                                                   | `false`     | 校验失败                                                     |
| `class`         | `string`                                                    | —           | 输入面样式                                                   |

### 插槽 {#slots}

| 插槽       | 参数                             | 说明                                           |
| ---------- | -------------------------------- | ---------------------------------------------- |
| `leading`  | —                                | 左侧图标等附加内容                             |
| `trailing` | —                                | 右侧快捷键提示或状态标记；RTL 下随逻辑方向排列 |
| `option`   | `{ option: T, active: boolean }` | 候选展示内容，行的交互与无障碍由组件负责       |
| `empty`    | —                                | 无候选提示                                     |
| `loading`  | —                                | 列表内加载提示                                 |

### 事件 {#events}

| 事件                | 参数                       | 说明                                       |
| ------------------- | -------------------------- | ------------------------------------------ |
| `update:modelValue` | `string`                   | 文本变化                                   |
| `update:open`       | `boolean`                  | 浮层开关变化                               |
| `query`             | `CompletionContext`        | 聚焦或重新打开、文本或选区变化、补全完成   |
| `select`            | `AutocompleteSelection<T>` | 候选被接受，包含编辑前上下文和所应用的编辑 |
| `submit`            | `string`                   | 没有高亮候选时回车应用完整文本             |
| `clear`             | —                          | 列表关闭时按 Esc 清空非空文本              |

### 实例 {#expose}

`input` 暴露内部 `HTMLInputElement`，可使用 `setSelectionRange()` 操作选区；`focus()`、`blur()` 分别聚焦和失焦。实例仅在挂载后可用。

### 类型 {#types}

```ts
interface AutocompleteOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface CompletionContext {
  text: string
  selectionStart: number
  selectionEnd: number
}

interface CompletionEdit {
  range: [number, number]
  text: string
  keepOpen?: boolean
}

interface AutocompleteSelection<T extends AutocompleteOption = AutocompleteOption> {
  option: T
  context: CompletionContext
  edit: CompletionEdit
}
```
