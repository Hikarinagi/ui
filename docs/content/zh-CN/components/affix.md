---
title: Affix
description: 让工具栏、操作区或分组标题在滚动时留在可视区域边缘。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/affix/Affix.vue
---

<Demo name="affix/hero" />

## 用法 {#usage}

```ts
import { Affix } from '@hina-ui/vue'
```

将需要吸附的内容放进 Affix。默认贴到最近滚动区域的顶部，`offset` 设置与边缘的距离，单位 px。

```vue
<Affix :offset="16">
  <Card>工具栏或操作区</Card>
</Affix>
```

Affix 使用原生 `position: sticky`，保留原来的布局空间、宽度和 DOM 节点。它不添加卡片、背景或滚动容器，也不为吸附加入位移、缩放或淡入淡出动画。外观由插槽内容决定。

## 示例 {#examples}

### 顶部偏移与禁用 {#offset}

顶部示例可以调整偏移、禁用吸附并勾选检查项。`disabled` 使内容恢复普通流，保留内部状态。用 `#default="{ affixed }"` 或 `@change` 获取当前是否贴到指定边缘；例如给已吸附的工具栏添加阴影。

```vue
<Affix v-slot="{ affixed }" :offset="16" :disabled="disabled">
  <Card :class="affixed ? 'shadow-md' : 'shadow-none'">操作区</Card>
</Affix>
```

状态改变时尽量只调整颜色、边框颜色或阴影，避免改变高度和外边距，反复推动吸附阈值。

### 底部操作区 {#bottom}

将底部操作区放在它自然应该出现的位置，设置 `position="bottom"`。当自然位置位于可视区域下方时，它留在底部；滚到原位置后与内容一起移动。底部吸附仍保留在当前父区域内。

<Demo name="affix/bottom" />

### 父区域边界 {#boundary}

每个 Affix 受父布局区域约束。下面每个标题只在自己的分组范围内停留，分组结束时自动离开，不会盖住后面的内容。

<Demo name="affix/boundary" />

## 滚动容器与布局 {#layout}

- 自动使用最近具有滚动机制的祖先；没有这类祖先时跟随页面视口。放进 ScrollArea 的内容区即可，不需要读取 `viewport` 或传入 `target`。
- 父区域需要留有移动空间。不要给 Affix 外面包一个仅与它等高的容器，否则没有可吸附的行程。横向 Flex 中需要侧栏保持自然高度时，给 Affix 设置 `self-start`，不要将它拉伸到整列高度。
- `overflow: auto / scroll / hidden` 会改变吸附参照；用于裁剪但不希望建立滚动区域时，可在适用场景使用 `overflow: clip`。不要跨过一个不滚动的 `overflow: hidden` 祖先去期待页面级吸附。
- 自动跟随容器宽度，保留原来的裁剪、方向和层叠关系。默认层级为 `z-10`，可通过 `class` 调整。需要一直固定在窗口角落的操作入口使用 FloatButton。

```vue
<ScrollArea class="h-96">
  <Stack>
    <Affix :offset="12"><Card>筛选与批量操作</Card></Affix>
    <DataList :items="items" :get-key="item => item.id">
      <template #default="{ item }">{{ item.title }}</template>
    </DataList>
  </Stack>
</ScrollArea>
```

## SSR 与性能 {#rendering}

吸附由 CSS 完成，SSR 首屏与客户端使用相同布局，没有测量后切成 fixed 的阶段。即使 JavaScript 尚未执行，内容仍可读，吸附仍生效。

`affixed` 插槽值在服务端为 `false`，挂载后同步当前边缘状态。滚动与尺寸变化只用于状态检测，同一帧合并处理，状态未改变时不触发事件；不会逐帧写入定位或占位尺寸。父区域结束、离开指定边缘时状态恢复为 `false`。

## API {#api}

### Props {#props}

| 属性       | 类型                | 默认值  | 说明                                      |
| ---------- | ------------------- | ------- | ----------------------------------------- |
| `as`       | `string`            | `'div'` | 根节点标签                                |
| `position` | `'top' \| 'bottom'` | `'top'` | 吸附边缘                                  |
| `offset`   | `number`            | `0`     | 边缘偏移，单位 px；支持负值               |
| `disabled` | `boolean`           | `false` | 停用吸附，恢复普通流                      |
| `class`    | `string`            | —       | 根节点样式；原生属性及 style 也传给根节点 |

### Slots {#slots}

| 插槽      | 参数                   | 说明                     |
| --------- | ---------------------- | ------------------------ |
| `default` | `{ affixed: boolean }` | 当前是否处在指定吸附边缘 |

### Events {#events}

| 事件     | 参数               | 说明                       |
| -------- | ------------------ | -------------------------- |
| `change` | `affixed: boolean` | 边缘吸附状态发生变化时触发 |

### Expose {#expose}

| 名称      | 类型                       | 说明                                           |
| --------- | -------------------------- | ---------------------------------------------- |
| `element` | `HTMLElement \| undefined` | 根节点                                         |
| `affixed` | `boolean`                  | 当前边缘吸附状态                               |
| `update`  | `() => void`               | 下一帧重新检测状态；普通滚动和尺寸变化自动处理 |

根节点提供 `data-position`、`data-affixed` 和 `data-disabled`，便于自定义样式。
