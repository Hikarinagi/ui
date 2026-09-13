---
title: Pagination
description: 切换页码、调整每页条数并浏览省略的页码范围。
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

默认只显示页码、前后翻页按钮和交互省略号。信息区、条数选择器与跳页输入框按需开启。

<Demo name="pagination/basic" />

## 示例 {#examples}

### 页码范围 {#edges}

`sibling-count` 控制当前页两侧显示的相邻页码数。`show-edges` 默认开启，保留第一页、最后一页的页码，中间断开的范围显示省略号。

`show-first-last` 独立控制跳到第一页、最后一页的箭头按钮，默认关闭。

<Demo name="pagination/edges" />

### 省略号 {#ellipsis}

鼠标点击省略号向对应方向跳过 `2 × siblingCount + 1` 页；悬停展开该处省略的页码列表。列表只包含未显示在分页栏中的页码，选择后关闭。触摸点击直接展开列表。

两侧省略号共用一个浮层，切换方向时更新位置和页码。连续点击按组跳页时，展开的范围同步更新。浮层在可用空间不足时翻转方向，长列表可滚动；页数较多时仅渲染可见区域附近的选项。

<Demo name="pagination/ellipsis" />

### 可选控件 {#controls}

`show-info` 显示条目范围、总条数和当前页数。`item-count` 可指定当前页实际展示的条数；未设置时按 `page-size` 计算，并限制到总条数以内。

设置 `page-size-options` 显示条数选择器，使用 `v-model:page-size` 绑定。选择新条数时回到第 `1` 页，`change` 一次传出新的 `{ page, pageSize }`，可以直接用这个事件处理数据更新。

`show-jump` 显示跳页输入框。Enter 或失焦提交，越界值限制到有效范围；空值和无效输入恢复当前页，Escape 取消编辑。

<Demo name="pagination/controls" />

### 总条数与每页条数 {#range}

从外部修改 `total` 或 `page-size` 时，当前页在有效范围内则保持；越界时调整到最后一页，并更新 `v-model`。直接修改有效的受控值不会反向触发 `change`。

<Demo name="pagination/range" />

### 布局与组合 {#layout}

`align` 控制各部分的对齐：`start`、`center`、`end` 或 `between`。默认插槽可组合 `PaginationInfo`、`PaginationContent`、`PaginationSize`、`PaginationJump`，自由调整顺序与分组；这些子组件共享根组件的状态、尺寸、禁用和语言配置。

`PaginationInfo` 的默认插槽提供分页状态，可以改写信息文本。示例用 [Inline](/components/inline) 分组右侧控件。

<Demo name="pagination/layout" />

### 加载 {#loading}

`pending` 禁用分页操作并关闭省略号列表。提供 `#list` 时，列表保留挂载并由 [LoadingOverlay](/components/loading-overlay) 遮罩，列表内容暂停交互。

加载期间总条数暂时变为 `0` 不会重写绑定的页码；加载结束后再校正越界页码。示例用定时器切换加载状态，组件本身不发起请求。

<Demo name="pagination/loading" />

### 单页隐藏 {#hidden}

`hide-single-page` 在总页数不超过 `1` 时隐藏导航栏，`#list` 仍然保留。

<Demo name="pagination/hidden" />

### 尺寸 {#sizes}

`size` 为 `sm`、`md` 或 `lg`，沿用 [Button](/components/button) 的尺寸。位数较多的页码会按内容扩宽。

<Demo name="pagination/sizes" />

### 状态 {#states}

`disabled` 禁用全部控件；第一页的向前按钮、最后一页的向后按钮自动禁用。`total="0"` 时保留第 `1` 页，所有翻页方向按钮禁用。

<Demo name="pagination/states" />

### 方向 {#direction}

`dir` 接受 `ltr` 或 `rtl`，优先于 Reka 的全局方向配置；都未设置时，继承外层元素的方向。RTL 下按钮排列和箭头一起翻转，下一页仍然增加页码。

<Demo name="pagination/direction" />

### 页码内容 {#content}

`#page` 提供 `{ page, selected }`，替换页码按钮内的内容，保留交互和当前页语义。`#ellipsis` 提供 `{ side, expanded }`，替换省略号按钮内容。

示例使用 [Text](/components/text) 设置当前页文字的字重。

<Demo name="pagination/content" />

## 行为 {#behavior}

- 当前页限制在 `1` 到总页数之间；页码总数由 `Math.ceil(total / pageSize)` 计算，最少为 `1`。
- 用户操作实际改变页码或条数时，`change` 触发一次；重复选择当前值不会触发。自动校正越界页码也会触发 `change`。
- 条数选择器始终包含当前值，去除重复、非整数和小于 `1` 的选项。
- 容器宽度不足时换行；可通过 `sibling-count` 和 `show-edges` 减少可见页码。

## 无障碍 {#a11y}

- 导航区域为 `nav`，默认名称随界面语言变化，`label` 可覆盖。当前页使用 `aria-current="page"`。
- Tab 在可用控件间移动，Enter 或空格激活；禁用控件跳过。按钮不会触发表单提交。
- 省略号获得键盘焦点时展开列表。Enter 或空格按组跳页，↓ / ↑ 分别进入列表的第一项 / 最后一项。
- 列表内 ↑ / ↓ 移动，Home / End 跳到首尾，PageUp / PageDown 按可见范围移动；Enter 或空格选择。
- Escape 关闭列表并恢复焦点。选择后若原省略号消失，焦点移到当前页按钮；Tab 可离开列表。

## API {#api}

### Props {#props}

| Prop              | 类型                                        | 默认值    | 说明                               |
| ----------------- | ------------------------------------------- | --------- | ---------------------------------- |
| `modelValue`      | `number`                                    | `1`       | 当前页，支持 `v-model`             |
| `total`           | `number`                                    | 必填      | 总条数                             |
| `pageSize`        | `number`                                    | `10`      | 每页条数，支持 `v-model:page-size` |
| `itemCount`       | `number`                                    | —         | 当前页实际展示条数                 |
| `siblingCount`    | `number`                                    | `1`       | 当前页两侧的相邻页码数             |
| `showEdges`       | `boolean`                                   | `true`    | 保留首尾页码及省略号               |
| `showFirstLast`   | `boolean`                                   | `false`   | 显示跳到首尾页的箭头按钮           |
| `showInfo`        | `boolean`                                   | `false`   | 显示分页信息                       |
| `showJump`        | `boolean`                                   | `false`   | 显示跳页输入框                     |
| `pageSizeOptions` | `number[]`                                  | —         | 每页条数选项；非空时显示选择器     |
| `hideSinglePage`  | `boolean`                                   | `false`   | 总页数不超过 1 时隐藏导航          |
| `pending`         | `boolean`                                   | `false`   | 加载状态                           |
| `align`           | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | 各部分对齐方式                     |
| `size`            | `'sm' \| 'md' \| 'lg'`                      | `'md'`    | 控件尺寸                           |
| `disabled`        | `boolean`                                   | `false`   | 禁用全部控件                       |
| `dir`             | `'ltr' \| 'rtl'`                            | —         | 排列方向，未设置时继承             |
| `label`           | `string`                                    | 界面语言  | 导航区域的无障碍名称               |
| `class`           | `string`                                    | —         | 附加到根节点的类名                 |

其余属性透传到外层 `div`，导航区域位于其中。

### 事件 {#events}

| 事件                | 参数               | 说明                         |
| ------------------- | ------------------ | ---------------------------- |
| `update:modelValue` | `page: number`     | 用户切换页码或当前页超出范围 |
| `update:pageSize`   | `pageSize: number` | 用户调整每页条数             |
| `change`            | `PaginationChange` | 一次有效的页码或条数变更     |

### 插槽 {#slots}

| 插槽       | 参数                                            | 说明                       |
| ---------- | ----------------------------------------------- | -------------------------- |
| `default`  | `PaginationState`                               | 组合导航控件，替换默认排列 |
| `list`     | `PaginationState`                               | 导航上方的列表内容         |
| `page`     | `{ page: number; selected: boolean }`           | 页码按钮的内容             |
| `ellipsis` | `{ side: 'prev' \| 'next'; expanded: boolean }` | 省略号按钮的内容           |

### 组合组件与类型 {#composition}

`PaginationContent` 提供页码与翻页按钮，支持相同的 `#page`、`#ellipsis` 插槽。`PaginationInfo` 提供 `#default(PaginationState)`。`PaginationSize` 和 `PaginationJump` 分别提供条数选择器与跳页输入框。四个组件均接受 `class`，需放在 `Pagination` 的默认插槽内。

```ts
interface PaginationChange {
  page: number
  pageSize: number
}

interface PaginationState extends PaginationChange {
  total: number
  pageCount: number
  from: number
  to: number
}
```

组件及以上类型均从 `@hina-ui/vue` 导出。
