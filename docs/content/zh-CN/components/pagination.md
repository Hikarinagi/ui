---
title: Pagination
description: 在页码范围内切换当前页。
links:
  - label: Source
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/pagination/Pagination.vue
  - label: Pagination
    href: https://reka-ui.com/docs/components/pagination
---

<Demo name="pagination/hero" />

## 使用 {#usage}

```ts
import { Pagination } from '@hina-ui/vue'
```

用 `v-model` 绑定当前页，从 `1` 开始。`total` 是总条数，`page-size` 是每页条数，页数由二者计算。点击页码或翻页按钮会更新当前页。

<Demo name="pagination/basic" />

## 示例 {#examples}

### 页码范围 {#edges}

`sibling-count` 控制当前页两侧显示的相邻页码数。`show-edges` 默认开启，保留第一页、最后一页的页码，中间断开的范围显示省略号。

`show-first-last` 独立控制跳到第一页、最后一页的箭头按钮，默认关闭。它与 `show-edges` 可以分别设置。

<Demo name="pagination/edges" />

### 总条数与每页条数 {#range}

总条数或每页条数变化后，如果当前页超出新范围，会自动调整到最后一页，并更新 `v-model`。下面的两个按钮分别切换 `total` 和 `page-size`。

<Demo name="pagination/range" />

### 尺寸 {#sizes}

`size` 为 `sm`、`md` 或 `lg`，沿用 [Button](/components/button) 的尺寸。位数较多的页码会按内容扩宽。

<Demo name="pagination/sizes" />

### 状态 {#states}

`disabled` 禁用全部按钮；第一页的向前按钮、最后一页的向后按钮自动禁用。`total="0"` 时保留第 `1` 页，所有翻页方向按钮禁用。

<Demo name="pagination/states" />

### 方向 {#direction}

`dir` 接受 `ltr` 或 `rtl`，优先于 Reka 的全局方向配置；都未设置时，继承外层元素的方向。RTL 下按钮排列和箭头一起翻转，下一页仍然增加页码。

<Demo name="pagination/direction" />

### 页码内容 {#content}

`#page` 提供 `{ page, selected }`，替换页码按钮内的内容，保留按钮的交互和当前页语义。`#ellipsis` 替换省略号内容。

示例使用 [Text](/components/text) 设置当前页文字的字重。

<Demo name="pagination/content" />

## 行为 {#behavior}

- 当前页始终限制在 `1` 到总页数之间；传入越界值时也会更新 `v-model`。
- 页码总数由 `Math.ceil(total / pageSize)` 计算，最少为 `1`。
- 容器不足以放下全部按钮时换行；可通过 `sibling-count` 和 `show-edges` 减少可见页码。
- 组件负责页码状态，数据获取与展示由调用方处理。

## 无障碍 {#a11y}

- 根节点为 `nav`，默认名称随界面语言变化，`label` 可覆盖。
- 当前页使用 `aria-current="page"`；页码及方向按钮都具有本地化名称，箭头与省略号对辅助技术隐藏。
- Tab 在可用按钮间移动，Enter 或空格激活，禁用按钮跳过。
- 所有按钮均为 `type="button"`，不会触发表单提交。

## API {#api}

### Props {#props}

| Prop            | 类型                   | 默认值   | 说明                     |
| --------------- | ---------------------- | -------- | ------------------------ |
| `modelValue`    | `number`               | `1`      | 当前页，支持 `v-model`   |
| `total`         | `number`               | 必填     | 总条数                   |
| `pageSize`      | `number`               | `10`     | 每页条数                 |
| `siblingCount`  | `number`               | `1`      | 当前页两侧的相邻页码数   |
| `showEdges`     | `boolean`              | `true`   | 保留首尾页码及省略号     |
| `showFirstLast` | `boolean`              | `false`  | 显示跳到首尾页的箭头按钮 |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`   | 按钮尺寸                 |
| `disabled`      | `boolean`              | `false`  | 禁用全部按钮             |
| `dir`           | `'ltr' \| 'rtl'`       | —        | 排列方向，未设置时继承   |
| `label`         | `string`               | 界面语言 | 导航区域的无障碍名称     |
| `class`         | `string`               | —        | 附加到根节点的类名       |

其余属性透传到根节点。

### 事件 {#events}

| 事件                | 参数           | 说明                               |
| ------------------- | -------------- | ---------------------------------- |
| `update:modelValue` | `page: number` | 用户切换页码或当前页超出范围时触发 |

### 插槽 {#slots}

| 插槽       | 参数                                  | 说明           |
| ---------- | ------------------------------------- | -------------- |
| `page`     | `{ page: number; selected: boolean }` | 页码按钮的内容 |
| `ellipsis` | —                                     | 省略号内容     |
