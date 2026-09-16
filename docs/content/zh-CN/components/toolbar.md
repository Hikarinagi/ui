---
title: Toolbar
description: 组合按钮、链接和切换组，以统一的键盘顺序操作。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/toolbar/Toolbar.vue
  - label: Toolbar
    href: https://reka-ui.com/docs/components/toolbar
---

<Demo name="toolbar/hero" />

## 用法 {#usage}

`Toolbar` 提供工具栏语义、尺寸和方向键导航。`ToolbarButton` 执行动作，`ToolbarLink` 渲染链接，`ToolbarSeparator` 分隔控件；控件复用 [Button](/components/button) 的视觉样式。

```ts
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '@hina-ui/vue'
```

使用 `label` 或 `aria-labelledby` 命名工具栏。按钮的默认插槽放文字，`#icon` 和 `#trailing` 放前后内容。仅图标按钮设置 `label`，图标放默认插槽；它提供方形尺寸、可访问名称，并在 [TooltipProvider](/components/tooltip#provider) 内显示提示，与 [IconButton](/components/icon-button) 一致。

<Demo name="toolbar/basic" />

## 示例 {#examples}

### 单选与多选 {#toggles}

`ToolbarToggleGroup` 默认 `type="single"`，`v-model` 为字符串或 `undefined`；再次点击选中项会清空。设置 `type="multiple"` 时绑定字符串数组，各项独立切换。`default-value` 设置非受控初始值。

每个 `ToolbarToggleItem` 的 `value` 在组内唯一。方向键只移动焦点，点击、Enter 或 Space 才切换选中状态。

<Demo name="toolbar/toggles" />

### 纵向 {#vertical}

`orientation="vertical"` 改为纵向排列和上下方向键导航。分隔线自动转向；图标提示的位置由控件的 `side` 设置。

<Demo name="toolbar/vertical" />

### 外观 {#variants}

`primary` 带边框和表面背景，`secondary` 使用凹陷背景，`bare` 去掉背景、边框和内边距。

<Demo name="toolbar/variants" />

### 尺寸 {#sizes}

工具栏的 `size` 由按钮、链接和切换项继承，也可以在单个控件上覆盖。间距与控件高度跟随密度 token。

<Demo name="toolbar/sizes" />

### 禁用 {#disabled}

`Toolbar.disabled` 禁用全部控件，`ToolbarToggleGroup.disabled` 禁用组内切换项，单项的 `disabled` 只影响自身。禁用项会退出方向键导航；`loading` 也会暂停该项的操作。

<Demo name="toolbar/disabled" />

### 组合控件 {#composition}

将 `ToolbarButton` 放入 [DropdownMenu](/components/dropdown-menu) 或 [Popover](/components/popover) 的触发器插槽，可保留浮层与工具栏各自的键盘行为。

`as-child` 把行为和属性合并到唯一子控件，不额外嵌套按钮。示例复用 [Toggle](/components/toggle)。自定义子控件需要把属性和事件转发到实际可聚焦元素；禁用、加载状态应设置在 `ToolbarButton` 上，使其同步退出方向键导航。

<Demo name="toolbar/composition" />

### RTL {#rtl}

`dir="rtl"` 同时调整排列和左右方向键。未传入时继承 [ConfigProvider](https://reka-ui.com/docs/utilities/config-provider) 的方向，或最近祖先的 `dir`。

<Demo name="toolbar/rtl" />

## 行为与无障碍 {#accessibility}

工具栏以 `role="toolbar"` 呈现，切换组使用 `role="group"`，切换项通过 `aria-pressed` 表达状态。默认按钮为 `type="button"`，不会提交所在表单。

| 按键              | 行为                                         |
| ----------------- | -------------------------------------------- |
| Tab / Shift + Tab | 进入或离开工具栏，重新进入时恢复最近的焦点项 |
| ← / →             | 横向工具栏中移动焦点，RTL 时反转             |
| ↑ / ↓             | 纵向工具栏中移动焦点                         |
| Home / End        | 移至首个 / 最后一个可用项                    |
| Enter / Space     | 执行按钮或链接，切换选中项                   |

`loop` 默认开启，允许从末项回到首项。横向控件可自然换行，方向键仍按 DOM 顺序移动，不使用二维网格导航。

需要独立使用同轴方向键的控件，例如输入框或 [Slider](/components/slider)，应保留自身的键盘操作；不要通过 `ToolbarButton` 将它们加入这组方向键导航。

## API {#api}

### Toolbar

| Prop          | 类型                                 | 默认值         | 说明                                 |
| ------------- | ------------------------------------ | -------------- | ------------------------------------ |
| `label`       | `string`                             | —              | 可访问名称，也可传 `aria-labelledby` |
| `orientation` | `'horizontal' \| 'vertical'`         | `'horizontal'` | 排列及导航方向                       |
| `dir`         | `'ltr' \| 'rtl'`                     | 继承           | 阅读方向                             |
| `loop`        | `boolean`                            | `true`         | 首尾循环导航                         |
| `disabled`    | `boolean`                            | `false`        | 禁用全部控件                         |
| `size`        | `'sm' \| 'md' \| 'lg'`               | `'md'`         | 控件尺寸                             |
| `variant`     | `'primary' \| 'secondary' \| 'bare'` | `'primary'`    | 容器外观                             |
| `class`       | `string`                             | —              | 根节点样式                           |

默认插槽放置工具栏部件。根节点接收原生属性。

### ToolbarButton / ToolbarLink / ToolbarToggleItem

| Prop       | 类型                                                  | 默认值                          | 说明                                   |
| ---------- | ----------------------------------------------------- | ------------------------------- | -------------------------------------- |
| `label`    | `string`                                              | —                               | 仅图标控件的名称与提示内容             |
| `tooltip`  | `boolean`                                             | `true`                          | 有 label 与 TooltipProvider 时显示提示 |
| `side`     | `'top' \| 'right' \| 'bottom' \| 'left'`              | `'top'`                         | 提示方向                               |
| `size`     | `'sm' \| 'md' \| 'lg'`                                | 继承                            | 控件尺寸                               |
| `variant`  | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | `'ghost'`                       | Button 外观                            |
| `tone`     | `'accent' \| 'neutral' \| 'danger'`                   | `'neutral'`                     | 表现色                                 |
| `disabled` | `boolean`                                             | `false`                         | 禁用该项                               |
| `loading`  | `boolean`                                             | `false`                         | 加载状态，同时禁用                     |
| `ripple`   | `boolean`                                             | `true`                          | 按压波纹                               |
| `as`       | `string \| Component`                                 | 按钮为 `'button'`，链接为 `'a'` | 底层元素                               |
| `asChild`  | `boolean`                                             | `false`                         | 合并到唯一子控件                       |
| `class`    | `string`                                              | —                               | 控件样式                               |

`ToolbarLink` 额外接收 `href`、`target`、`rel`。`ToolbarToggleItem` 额外要求 `value: string`，且必须放入 `ToolbarToggleGroup`。默认插槽、`#icon`、`#trailing` 与 Button 相同，原生属性和事件转发到控件元素。

### ToolbarToggleGroup

| Prop           | 类型                              | 默认值     | 说明           |
| -------------- | --------------------------------- | ---------- | -------------- |
| `v-model`      | `string \| string[] \| undefined` | —          | 当前选择       |
| `defaultValue` | `string \| string[]`              | —          | 非受控初始值   |
| `type`         | `'single' \| 'multiple'`          | `'single'` | 单选或多选     |
| `label`        | `string`                          | —          | 组名称         |
| `disabled`     | `boolean`                         | `false`    | 禁用组内切换项 |
| `class`        | `string`                          | —          | 组容器样式     |

默认插槽放置切换项，`update:modelValue` 在选中状态改变时触发。组内控件仍属于外层 Toolbar 的同一条焦点序列。

### ToolbarSeparator

| Prop         | 类型      | 默认值 | 说明               |
| ------------ | --------- | ------ | ------------------ |
| `decorative` | `boolean` | `true` | 是否为纯装饰分隔线 |
| `class`      | `string`  | —      | 分隔线样式         |

分隔线始终垂直于工具栏的排列方向，不参与键盘导航。
