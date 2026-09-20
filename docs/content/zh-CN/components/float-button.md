---
title: FloatButton
description: 将一个常用操作放在页面或容器的边角，滚动时仍能找到。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/float-button/FloatButton.vue
---

<Demo name="float-button/hero" />

## 用法 {#usage}

```ts
import { FloatButton } from '@hina-ui/vue'
```

默认固定在视口的逻辑右下角。通过 `label` 提供操作名称，默认插槽放图标。浮动按钮适合新建、帮助这类跨内容区域的常用操作；行内操作继续使用 `Button` 或 `IconButton`。

```vue
<FloatButton label="新建笔记" @click="createNote"><Plus /></FloatButton>
```

整页使用时放在应用壳外层，避免祖先的 `transform` 改变固定定位的参照。组件不传送到 `body`，保留当前位置的主题、方向和组件上下文。上面的演示使用 `position="absolute"`，将按钮限制在预览面板内。

## 示例 {#examples}

### 外观 {#appearance}

支持实底、浅底和描边，`shape="square"` 使用圆角方形。图标按钮沿用现有 Tooltip；应用需提供 `TooltipProvider`，`AppShell` 已包含它。`label` 始终作为无障碍名称，不依赖 Tooltip。

<Demo name="float-button/appearance" />

### 尺寸与文字 {#sizes}

`sm`、`md`、`lg` 分别对应 40、48、56px 的默认高度。`extended` 将 `label` 显示在图标旁，此时不会重复显示 Tooltip。长文案在可用宽度内截断。

<Demo name="float-button/sizes" />

### 定位与方向 {#placement}

`placement` 使用逻辑方向，`start` / `end` 随 RTL 切换。`absolute` 相对最近的定位祖先，`static` 参与正常布局，适合与 `Stack` 组合成一组操作。`offset` 控制边距；固定定位时还会避开设备安全区。

<Demo name="float-button/placement" />

### 状态与显隐 {#states}

`visible` 控制出现和退场，退场期间按钮不能交互。`loading` 保留按钮尺寸并阻止重复操作，`disabled` 禁用按钮。

<Demo name="float-button/states" />

### 应用内导航 {#link}

将 `as` 设置为路由组件，`to` 等属性透传到实际操作节点。这样可以保留 SPA 导航。

```vue
<FloatButton :as="NuxtLink" :to="localePath('/components')" label="组件文档">
  <BookOpen />
</FloatButton>
```

## API {#api}

### Props {#props}

| 属性          | 类型                                                         | 默认值         | 说明                                                  |
| ------------- | ------------------------------------------------------------ | -------------- | ----------------------------------------------------- |
| `label`       | `string`                                                     | 必填           | 操作名称，同时用于无障碍和 Tooltip                    |
| `visible`     | `boolean`                                                    | `true`         | 显示按钮，变化时播放过渡                              |
| `position`    | `'fixed' \| 'absolute' \| 'static'`                          | `'fixed'`      | 定位方式                                              |
| `placement`   | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'bottom-end'` | 定位角落，静态布局时无效                              |
| `offset`      | `number \| string`                                           | `6 × spacing`  | 边距，数字单位为 px；固定定位取边距与安全区中的较大值 |
| `size`        | `'sm' \| 'md' \| 'lg'`                                       | `'md'`         | 按钮尺寸                                              |
| `shape`       | `'circle' \| 'square'`                                       | `'circle'`     | 圆形或圆角方形                                        |
| `extended`    | `boolean`                                                    | `false`        | 显示文字标签                                          |
| `variant`     | `'solid' \| 'soft' \| 'outline'`                             | `'solid'`      | 按钮外观                                              |
| `tone`        | `'accent' \| 'neutral' \| 'danger'`                          | `'accent'`     | 按钮色调                                              |
| `tooltip`     | `boolean`                                                    | `true`         | 图标形态下显示 Tooltip                                |
| `tooltipSide` | `'top' \| 'right' \| 'bottom' \| 'left'`                     | `'top'`        | Tooltip 首选方向                                      |
| `loading`     | `boolean`                                                    | `false`        | 加载中并禁止操作                                      |
| `disabled`    | `boolean`                                                    | `false`        | 禁用操作                                              |
| `ripple`      | `boolean`                                                    | `true`         | 涟漪反馈                                              |
| `as`          | `string \| Component`                                        | `'button'`     | 实际操作元素或组件                                    |
| `type`        | `'button' \| 'submit' \| 'reset'`                            | `'button'`     | 按钮类型                                              |
| `class`       | `string`                                                     | —              | 按钮类名                                              |
| `style`       | `StyleValue`                                                 | —              | 按钮样式                                              |

原生属性和事件透传到按钮，例如 `id`、`form` 和 `@click`。

### Slots {#slots}

| 插槽      | 说明                                |
| --------- | ----------------------------------- |
| `default` | 操作图标；`extended` 时放在文字前面 |

### Expose {#expose}

| 名称      | 类型                       | 说明           |
| --------- | -------------------------- | -------------- |
| `element` | `HTMLElement \| undefined` | 当前操作节点   |
| `focus`   | `() => void`               | 聚焦可用的按钮 |
