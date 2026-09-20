---
title: Editable
description: 在原位置编辑文本，确认或取消修改。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/editable/Editable.vue
---

<Demo name="editable/hero" />

## 用法 {#usage}

```ts
import { Editable } from '@hina-ui/vue'
```

用于名称、标题、备注等平时以文本展示、需要时就地修改的字段。`v-model` 是已确认的值，键入内容只修改内部草稿；保存后才更新，取消恢复原值。需要始终显示输入框、逐字同步表单值时使用 [Input](/components/input) 或 [Textarea](/components/textarea)。

默认单击进入编辑，自动聚焦并选中文字。回车或焦点离开整个组件时保存，Esc 取消。焦点在输入框与保存、取消按钮之间移动不会提交，取消按钮也不会先触发失焦保存。

<Demo name="editable/basic" />

## 示例 {#examples}

### 激活与确认方式 {#activation}

`activationMode` 支持单击、双击与手动触发。单击与双击模式都支持聚焦后用 Enter、空格进入编辑；仅用 Tab 聚焦不会直接修改内容。手动模式通过编辑按钮、`v-model:editing` 或实例的 `edit()` 进入。

`submitMode` 决定快捷提交方式，显式保存按钮始终可用：

| 值       | 行为                                 |
| -------- | ------------------------------------ |
| `both`   | 回车或焦点离开组件时保存，默认值     |
| `enter`  | 回车保存；焦点移出后保留草稿与编辑态 |
| `blur`   | 焦点离开组件时保存；回车不提交       |
| `manual` | 仅显式保存；回车、焦点移出都保留草稿 |

首个示例中的 `multiline` 使用多行输入：Enter 换行，Ctrl / ⌘ + Enter 按 `submitMode` 的回车规则保存。中文等输入法组词期间不处理保存和取消。

多行编辑复用 [Textarea](/components/textarea)，超出 `rows` 后由 [ScrollArea](/components/scroll-area) 接管滚动，输入时保持光标可见。

<Demo name="editable/activation" />

### 异步保存与失败重试 {#async}

通过 `:on-save="save"` 提供保存函数。它接收新值、旧值，可以返回 Promise；成功后才更新 `v-model` 并触发 `submit`。值没有变化时直接结束编辑，不重复保存。

保存期间保留草稿和输入框，显示加载态，禁止重复保存与取消。抛出 `Error` 会显示其 `message`，其他异常使用通用失败提示，并触发 `error`；用户可以修改后重试或取消。修改草稿会清除旧错误。不要在异步 `@submit` 监听器里执行需要组件等待的请求，`submit` 是保存成功后的通知。

外部更新 `modelValue`、关闭 `editing`、设为禁用或只读、卸载组件，都会使旧的保存结果失效，防止旧值回写。网络请求本身是否取消由业务方负责。

<Demo name="editable/async" />

### 自定义展示与操作区 {#custom}

`#preview` 自定义文本的展示形态，不替换组件的激活和焦点逻辑。单击或双击模式下预览由按钮承载，不要在插槽内嵌套按钮、链接等交互元素。`#actions` 接收编辑状态和操作方法，可换成文字按钮。

`:controls="false"` 可隐藏默认操作区；与手动模式组合时，需要通过插槽或实例方法提供进入、保存和取消的入口。

<Demo name="editable/custom" />

### 尺寸与状态 {#states}

三档字号、输入高度和内边距与 Input 对齐。单行预览和输入使用相同宽度与文字起点，操作区显示在下方，编辑时不会挤窄文本。只读内容可以选择与复制，禁用状态禁止进入编辑。

<Demo name="editable/states" />

### 在表单中 {#form}

[FormField](/components/form-field) 自动关联标签、描述、错误和禁用状态。字段完成编辑后，Form 对已确认的值进行校验。示例用 `v-model:editing` 在编辑期间禁用整份表单的提交按钮，避免提交尚未确认的草稿。

`required`、`maxlength` 是 Editable 自身的输入限制；复杂规则使用 Form 的规则，或在 `onSave` 内校验并抛出带提示的异常。`name` 让原生 FormData 收集已确认值。

<Demo name="editable/form" />

## 键盘与焦点 {#keyboard}

- 预览态：Tab 聚焦；Enter、空格进入编辑。手动模式使用编辑按钮。
- 单行编辑：Enter 按 `submitMode` 保存；不会意外提交外层表单。
- 多行编辑：Enter 换行，Ctrl / ⌘ + Enter 按 `submitMode` 保存。
- Esc 取消当前草稿，不同时关闭所在的 Dialog；组词和保存期间不取消。
- 保存、取消后，仍在组件内的焦点回到预览；如果用户已移到外部，不抢回焦点。
- 初始 `editing=true` 可以在 SSR 中输出输入态，挂载时不会自动抢焦点。之后进入编辑时才自动聚焦。

## API {#api}

### Props {#props}

| 属性             | 类型                                      | 默认值     | 说明                             |
| ---------------- | ----------------------------------------- | ---------- | -------------------------------- |
| `modelValue`     | `string`                                  | `''`       | 已确认文本，支持 `v-model`       |
| `editing`        | `boolean`                                 | `false`    | 编辑状态，支持 `v-model:editing` |
| `activationMode` | `'click' \| 'dblclick' \| 'manual'`       | `'click'`  | 进入编辑的方式                   |
| `submitMode`     | `'enter' \| 'blur' \| 'both' \| 'manual'` | `'both'`   | 快捷提交方式                     |
| `selectOnFocus`  | `boolean`                                 | `true`     | 进入编辑后全选文字               |
| `multiline`      | `boolean`                                 | `false`    | 使用多行文本框                   |
| `rows`           | `number`                                  | `3`        | 多行输入的初始行数               |
| `controls`       | `boolean`                                 | `true`     | 显示默认操作区                   |
| `onSave`         | `EditableSave`                            | —          | 更新模型前等待的保存回调         |
| `placeholder`    | `string`                                  | 本地化文案 | 空值提示，同时用于输入框         |
| `name`           | `string`                                  | —          | 原生表单字段名，收集已确认值     |
| `required`       | `boolean`                                 | `false`    | 不允许确认空值                   |
| `maxlength`      | `number`                                  | —          | 输入长度上限                     |
| `size`           | `'sm' \| 'md' \| 'lg'`                    | `'md'`     | 尺寸                             |
| `disabled`       | `boolean`                                 | `false`    | 禁用                             |
| `readonly`       | `boolean`                                 | `false`    | 只读，允许复制文本               |
| `invalid`        | `boolean`                                 | `false`    | 标记校验失败                     |
| `class`          | `string`                                  | —          | 根节点样式                       |

其余属性（如 `id`、`aria-label`、`autocomplete`）传给当前预览或输入节点。`class` 作用于外层；`style` 作用于当前预览或输入节点。

### 插槽 {#slots}

| 插槽      | 参数                                | 说明           |
| --------- | ----------------------------------- | -------------- |
| `preview` | `{ value: string, empty: boolean }` | 展示已确认的值 |
| `actions` | `EditableControls`                  | 替换默认操作区 |

### 事件 {#events}

| 事件                | 参数                                   | 说明               |
| ------------------- | -------------------------------------- | ------------------ |
| `update:modelValue` | `string`                               | 保存成功后的新值   |
| `update:editing`    | `boolean`                              | 编辑状态变化       |
| `edit`              | —                                      | 进入编辑           |
| `submit`            | `value: string, previousValue: string` | 修改保存成功       |
| `cancel`            | `draft: string`                        | 取消并丢弃的草稿   |
| `error`             | `unknown`                              | 保存回调抛出的异常 |

### 实例与类型 {#expose}

实例暴露 `edit()`、`submit(): Promise<boolean>`、`cancel()`、`focus()`，以及当前的 `input`、`draft`、`saving`、`error`。`input` 仅在客户端编辑态存在。`submit()` 返回是否成功完成；保存期间 `cancel()` 不生效。

```ts
type EditableSave = (value: string, previousValue: string) => void | Promise<void>

interface EditableControls {
  editing: boolean
  draft: string
  dirty: boolean
  saving: boolean
  disabled: boolean
  error: string
  edit: () => void
  submit: () => Promise<boolean>
  cancel: () => void
}
```
