---
title: Stepper
description: 带有步骤状态与切换校验的步骤导航。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/stepper/Stepper.vue
---

<Demo name="stepper/hero" />

## 用法 {#usage}

```ts
import { Stepper, type StepperItem } from '@hina-ui/vue'
```

`items` 定义步骤，`v-model` 是从 **1** 开始的当前步骤编号。默认从第一步开始；不绑定 `v-model` 时由组件管理当前步骤，可用 `defaultValue` 设置初始值。

<Demo name="stepper/basic" />

## 示例 {#examples}

### 线性与自由切换 {#linear}

`linear` 默认为 `true`：可以回到之前的步骤，也可以进入紧邻的下一步，但不能直接跳过中间步骤。设为 `false` 后，可进入任意未禁用步骤。

线性限制只决定可切换的范围，不代表数据已经通过校验。需要校验时使用 `beforeChange`。直接从外部设置 `v-model` 是调用方主动更新状态，不经过切换限制和校验。

<Demo name="stepper/linear" />

### 纵向 {#vertical}

`orientation="vertical"` 将文字放在节点旁，连线随说明长度延伸。横向布局将文字放在节点下方，各步骤等宽；方向变化同时影响方向键导航。

<Demo name="stepper/vertical" />

### 状态 {#states}

当前步骤之前的步骤默认显示完成标记；`completed` 可显式标记完成，包括最后一步。`error` 优先显示错误标记，当前步骤仍保留其当前位置语义。

单项 `disabled` 禁止进入该步骤，根 `disabled` 禁止所有用户切换。`next()`、`prev()` 不会跳过禁用项；相邻项被禁用时，对应方法返回 `false`。

<Demo name="stepper/states" />

### 内容与导航 {#content}

默认插槽接收当前步骤与导航方法。可组合 [Card](/components/card)、[Button](/components/button) 等组件；只有使用插槽时才渲染内容区。

内容插槽始终挂载，如何切换、保留或重置内部内容由调用方决定。组件实例也暴露 `next()`、`prev()`、`goTo(step)`，与插槽内的方法行为一致。

<Demo name="stepper/content" />

### 切换前校验 {#guard}

`beforeChange(nextStep, previousStep)` 在点击步骤、键盘激活或调用导航方法时执行。返回 `false` 阻止切换；返回 `true` 或不返回值允许切换，也可返回 Promise。

等待期间保持当前步骤并阻止重复切换。抛错或 Promise 拒绝时保留当前步骤，通过 `error` 事件交给调用方处理。外部修改当前步骤、步骤结构或禁用状态，以及组件卸载后，旧校验结果不会再推进步骤。

示例使用 [FormField](/components/form-field) 和 [Input](/components/input)。点击第二步的标题与点击“下一步”会经过同一个校验函数。

<Demo name="stepper/guard" />

### 自定义指示器与文字 {#custom}

`#indicator`、`#title`、`#description` 接收原始 `item`、从 0 开始的 `index`、从 1 开始的 `step`、`state`、`active`、`pending` 与 `disabled`。自定义字段会保留类型推导。

示例用图标替换默认编号，并在标题中加入 [Tag](/components/tag)。这些插槽位于步骤按钮内部，应只放非交互内容；输入框、链接和其他按钮放在默认内容插槽中。

<Demo name="stepper/custom" />

### 尺寸 {#sizes}

`size` 调整指示器与文字大小。节点尺寸和间距使用 Hina 变量，随密度设置变化。

<Demo name="stepper/sizes" />

### RTL {#rtl}

方向继承外层 `dir` 或配置提供器，也可用 `dir="rtl"` 指定。横向排列、连线和方向键导航共同反转。

<Demo name="stepper/rtl" />

## 行为与无障碍 {#a11y}

- 步骤组成有名称的列表组，`label` 可替换默认无障碍名称。
- 每一步是真实按钮，标题和可选描述参与命名；当前按钮带 `aria-current="step"`。错误和完成状态同时提供文字，不仅依靠颜色与图标。
- Tab 在可操作步骤和内容之间移动；横向用左右方向键，纵向用上下方向键移动焦点，Enter 或空格激活。移动焦点不会自动切换步骤。
- 导航不会主动抢走内容区焦点，也不会自动提交表单。
- 进度播报随界面语言变化。减弱动态效果设置由 Hina 动效变量统一处理。

## API {#api}

### Props {#props}

| 属性           | 类型                         | 默认值         | 说明                              |
| -------------- | ---------------------------- | -------------- | --------------------------------- |
| `items`        | `T[]`                        | 必填           | 步骤列表，`T extends StepperItem` |
| `v-model`      | `number`                     | —              | 当前步骤，编号从 1 开始           |
| `defaultValue` | `number`                     | `1`            | 非受控初始步骤                    |
| `orientation`  | `'horizontal' \| 'vertical'` | `'horizontal'` | 排布与键盘导航方向                |
| `size`         | `'sm' \| 'md' \| 'lg'`       | `'md'`         | 尺寸                              |
| `linear`       | `boolean`                    | `true`         | 限制顺序切换                      |
| `disabled`     | `boolean`                    | `false`        | 禁止所有用户切换                  |
| `beforeChange` | `StepperBeforeChange`        | —              | 切换前校验                        |
| `label`        | `string`                     | 取自界面语言   | 步骤组的无障碍名                  |
| `dir`          | `'ltr' \| 'rtl'`             | 继承           | 阅读方向                          |
| `class`        | `string`                     | —              | 根元素的类                        |

空列表的显示步骤为 `0`；越界或无效的当前值仅在呈现时收敛到有效范围，不自动写回模型。`defaultValue` 只用于初始化。

### StepperItem {#item}

| 字段          | 类型      | 说明                                                  |
| ------------- | --------- | ----------------------------------------------------- |
| `title`       | `string`  | 必填，步骤标题                                        |
| `description` | `string`  | 可选说明                                              |
| `disabled`    | `boolean` | 禁止进入该步骤                                        |
| `completed`   | `boolean` | 显式显示完成；设为 `false` 不覆盖之前步骤的自动完成态 |
| `error`       | `boolean` | 错误状态，优先于完成态                                |

步骤编号和身份由数组位置决定；`index` 从 0 开始，`step` 从 1 开始。

### Slots {#slots}

| 插槽          | 参数                   | 说明                                   |
| ------------- | ---------------------- | -------------------------------------- |
| `default`     | `StepperNavigation<T>` | 当前内容与导航操作                     |
| `indicator`   | `StepperSlotProps<T>`  | 节点，默认编号、勾、错误图标或等待指示 |
| `title`       | `StepperSlotProps<T>`  | 标题                                   |
| `description` | `StepperSlotProps<T>`  | 说明                                   |

`StepperSlotProps<T>` 为 `{ item, index, step, state, active, pending, disabled }`。`state` 是 `'inactive' | 'active' | 'completed' | 'error'`；`pending` 表示该项正在等待切换校验，`disabled` 表示该项被显式禁用或被线性范围限制。

`StepperNavigation<T>` 为 `{ step, item, total, pending, canNext, canPrev, next, prev, goTo }`。空列表时 `item` 为 `undefined`。导航方法返回 `Promise<boolean>`，实际发起模型更新时为 `true`，被阻止、无变化或校验过期时为 `false`。

### Events {#events}

| 事件                | 参数             | 说明               |
| ------------------- | ---------------- | ------------------ |
| `update:modelValue` | `step: number`   | 请求更新当前步骤   |
| `error`             | `error: unknown` | 切换校验抛出的异常 |

### Expose {#expose}

`step`、`pending`、`canNext`、`canPrev` 和 `next()`、`prev()`、`goTo(step)` 可通过组件引用访问。`beforeChange` 为 `(nextStep: number, previousStep: number) => boolean | void | Promise<boolean | void>`。
