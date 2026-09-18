---
title: DataList
description: 统一条目排版、列表与卡片布局、分页及加载状态的数据视图。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/data-list/DataList.vue
---

<Demo name="data-list/hero" />

## 使用 {#usage}

DataList 提供媒体、标题、描述、元信息和操作区的条目结构。同一份内容可以切换为横向列表或纵向卡片；分页、加载占位和空态由组件协调。它保留列表语义，不附加整行点击或选择行为。需要表头和列对齐时使用 [DataTable](/components/data-table)。

传入 `items`、唯一且稳定的 `itemKey` 和标题字段 `itemTitle`，即可渲染基本列表。标题和描述也接受函数。

```vue
<DataList :items="items" item-key="id" item-title="name" item-description="description" />
```

按需提供 `#media`、`#title`、`#description`、`#meta` 和 `#actions`。这些插槽接收 `{ item, index, key, layout }`，保留完整条目类型。开启分页时，`index` 包含当前页偏移量。提供默认插槽可替换整个条目内容，同时保留列表容器、分页和状态管理。

示例使用 [Hikarinagi](https://www.hikarinagi.org) 的公开作品数据快照（2026-09-18），包含名称、开发商、发行日期与封面；详情链接指向原始条目。分页、筛选和远程分页示例使用 1,000 条，虚拟滚动示例使用 5,000 条；排版示例展示其中少量条目。封面由 [Image](/components/image) 展示，操作使用 [Button](/components/button)，长文本提示使用 [Tooltip](/components/tooltip)。

## 示例 {#examples}

### 条目结构与布局 {#layout}

`layout-toggle` 显示内置布局切换器，也可以通过 `v-model:layout` 或状态插槽的 `setLayout` 控制。切换时保留仍在渲染范围内的条目节点。

列表中媒体位于文字前方，操作区在宽容器中靠后、窄容器中移至文字下方；卡片中媒体在上，操作区在下。标题和描述默认完整换行，元信息自动换行。需要截断时，可在对应插槽中使用 [Text](/components/text) 的截断能力。

`mediaRatio` 统一两种布局的媒体比例，省略时列表默认正方形，卡片默认 16:10。`gridMin` 设置最小卡片宽度，容器不足时使用单列；`gridGap` 设置间距。示例通过 [Link](/components/link) 自定义标题，通过 [Toggle](/components/toggle) 添加操作。

<Demo name="data-list/layout" />

### 本地分页 {#pagination}

开启 `pagination` 后传入完整数组。组件截取当前页，并使用 [Pagination](/components/pagination) 渲染分页。通过 `v-model:page` 和 `v-model:page-size` 控制页码与每页条数；数据减少导致页码越界时，自动回到最后一页。只有一页或没有数据时，默认分页自动隐藏；自定义 `#pagination` 不受此限制。

`#footer` 与分页共用底部一行，空间不足时换行。翻页只重置列表自身的滚动位置，不滚动外层页面。

状态插槽提供 `setPage` 和 `setPageSize`，处理加载状态和页码边界；修改每页条数会回到第一页。示例使用 [Select](/components/select) 修改条数。

<Demo name="data-list/pagination" />

### 筛选与排序 {#filter}

筛选和排序由调用方计算，再将结果传给 `items`。查询变化时重置页码。示例组合 [SearchInput](/components/search-input) 与 [Select](/components/select)。

<Demo name="data-list/filter" />

### 远程分页 {#remote}

同时开启 `manual` 和 `pagination` 时，`items` 是服务端返回的当前页，组件不会再次切片。提供 `total` 显示完整分页；总数未知时省略它，并传入 `hasNextPage`，分页将只显示上一页、下一页和当前页码。

示例实际请求按页保存的静态 JSON 快照，可运行于静态部署；它不实时查询作品库，也没有人为等待。使用 [Switch](/components/switch) 切换已知／未知总数。请求期间保留上一页，取消过期请求；失败时通过 [Empty](/components/empty) 显示重试入口。

<Demo name="data-list/remote" />

### 加载与空态 {#states}

首次加载默认使用与条目结构对应的 [Skeleton](/components/skeleton)，`placeholderCount` 控制数量。默认只为已配置的内容区生成占位；虚拟模式默认渲染 3 个占位，普通分页默认与每页条数一致。自定义整个条目时，可用 `#placeholder="{ index, layout }"` 提供对应骨架，不需要伪造业务数据。

已有条目时，`loading` 会保留内容、禁止内容交互和翻页，并通过 [LoadingOverlay](/components/loading-overlay) 延迟显示加载提示。`#loading` 可替换整片首次加载内容以及刷新提示；`#empty` 或 `emptyText` 自定义空态。

`minHeight` 为内容区预留最小高度，自动高度列表在清空数据加载时保留上一轮高度；`height` 则固定内容区高度，并在内容超出时使用 [ScrollArea](/components/scroll-area)。

<Demo name="data-list/states" />

### 自定义分页 {#custom-pagination}

`#pagination` 接收与头部、页脚相同的状态和操作方法，可以接入 [Pagination](/components/pagination) 的附属选项。

```vue
<DataList :items="items" item-key="id" item-title="name" pagination>
  <template #pagination="{ page, pageSize, total, loading, setPage, setPageSize }">
    <Pagination
      :model-value="page"
      :page-size="pageSize"
      :total="total ?? 0"
      :pending="loading"
      :page-size-options="[10, 20, 50]"
      show-info
      @change="value => value.pageSize === pageSize ? setPage(value.page) : setPageSize(value.pageSize)"
    />
  </template>
</DataList>
```

### 虚拟滚动 {#virtual}

`virtualize` 支持列表和网格，与 [VirtualList](/components/virtual-list) 复用窗口计算能力。网格按行虚拟化，以该行最高条目作为行高，列数随容器宽度调整。`estimateSize` 是列表行或网格整行的估算高度；`overscan` 是窗口前后额外保留的行数。高度会在渲染后动态测量。

`height` 指定滚动视口高度，虚拟模式默认 320px；百分比高度需要父容器具有明确高度。与分页组合时只虚拟化当前页。需要跨卸载保留的条目状态应按 ID 存在组件外部。

下方使用 5,000 条不同的真实条目，在列表与网格间切换，并显示当前可见范围。仅渲染当前窗口及缓冲区内的条目。

<Demo name="data-list/virtual" />

## SSR {#ssr}

列表、卡片、分页和首次加载骨架都支持服务端渲染。虚拟模式输出可读的初始窗口，挂载后校准视口和行高，不需要 client-only 包装。

虚拟网格可通过 `initialColumns` 指定服务端估算列数，默认 1。服务端和客户端初始值必须一致；实际列数由 CSS 和容器宽度决定。初始窗口之外的条目仍需在滚动后渲染。

## API {#api}

### 属性 {#props}

| 属性                            | 类型                                                                | 默认值               | 说明                                     |
| ------------------------------- | ------------------------------------------------------------------- | -------------------- | ---------------------------------------- |
| `items`                         | `readonly T[]`                                                      | 必填                 | 完整数组；手动模式下为当前页             |
| `itemKey`                       | 键字段或 `(item, index) => string \| number`                        | 必填                 | 唯一、稳定的键                           |
| `itemTitle` / `itemDescription` | 文本字段或 `(item, index) => string \| number \| null \| undefined` | —                    | 标题／描述；对应插槽优先                 |
| `mediaRatio`                    | `number`                                                            | —                    | 媒体宽高比                               |
| `layoutToggle`                  | `boolean`                                                           | `false`              | 显示布局切换器                           |
| `gridMin`                       | `string`                                                            | `'14rem'`            | 期望的网格最小列宽                       |
| `gridGap`                       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                    | `'md'`               | 网格间距                                 |
| `size`                          | `'sm' \| 'md' \| 'lg'`                                              | `'md'`               | 列表媒体大小、条目间距及卡片内边距       |
| `divided`                       | `boolean`                                                           | `true`               | 列表分隔线                               |
| `pagination`                    | `boolean`                                                           | `false`              | 显示分页                                 |
| `manual`                        | `boolean`                                                           | `false`              | 当前页数据不再切片                       |
| `total`                         | `number`                                                            | —                    | 远程总条数；本地模式使用数组长度         |
| `hasNextPage`                   | `boolean`                                                           | `false`              | 总数未知时是否有下一页                   |
| `loading`                       | `boolean`                                                           | `false`              | 加载状态，禁止内容交互和分页             |
| `placeholderCount`              | `number`                                                            | `3` 或每页条数       | 首次加载骨架数量                         |
| `emptyText`                     | `string`                                                            | 语言包               | 默认空态文字                             |
| `label`                         | `string`                                                            | —                    | 列表与滚动区的可访问名称                 |
| `virtualize`                    | `boolean \| DataListVirtualOptions`                                 | `false`              | 启用列表或网格虚拟化                     |
| `height`                        | `number \| string`                                                  | 自动；虚拟模式 `320` | 内容区固定高度                           |
| `minHeight`                     | `number \| string`                                                  | `160`                | 未设置固定高度时的内容区最小高度         |
| `class`                         | `string`                                                            | —                    | 根节点类名                               |
| `bodyClass`                     | `string`                                                            | —                    | 内容区外框，涵盖加载与空态               |
| `contentClass`                  | `string`                                                            | —                    | 所有布局和渲染模式下均作用于条目列表容器 |
| `itemClass`                     | `string \| ((item, index) => string \| undefined)`                  | —                    | 单个条目类名                             |

`DataListVirtualOptions` 包含 `estimateSize`（列表默认 112px、网格默认 280px）、`overscan`（默认 3 行）和 `initialColumns`（默认 1）。其他属性，包括 `dir` 和 `style`，透传到根节点。

### 双向绑定 {#models}

| 模型       | 类型               | 默认值   |
| ---------- | ------------------ | -------- |
| `layout`   | `'list' \| 'grid'` | `'list'` |
| `page`     | `number`           | `1`      |
| `pageSize` | `number`           | `10`     |

### 插槽 {#slots}

| 插槽                                                   | 参数                  | 说明                       |
| ------------------------------------------------------ | --------------------- | -------------------------- |
| `media` / `title` / `description` / `meta` / `actions` | `DataListItemSlot<T>` | 条目对应区域               |
| `default`                                              | `DataListItemSlot<T>` | 替换整个条目内容           |
| `placeholder`                                          | `{ index, layout }`   | 单个首次加载骨架           |
| `header` / `footer`                                    | `DataListState<T>`    | 列表上方／底部与分页同一行 |
| `pagination`                                           | `DataListState<T>`    | 替换分页                   |
| `empty`                                                | `DataListState<T>`    | 非加载状态下的空态         |
| `loading`                                              | `DataListState<T>`    | 整片首次加载内容／刷新指示 |

`DataListState<T>` 包含当前页 `items`、`page`、`pageSize`、`total`、`pageCount`、`layout`、`loading`、`refreshing`、`hasPreviousPage`、`hasNextPage`、`setPage(page)`、`setPageSize(size)` 和 `setLayout(layout)`。未知总数时 `total` 和 `pageCount` 为 `undefined`。

### 事件与实例 {#events}

| 名称                             | 参数／类型                                                                  | 说明                                          |
| -------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------- |
| `pageChange`                     | `{ page, pageSize }`                                                        | 分页操作或越界修正                            |
| `rangeChange`                    | `{ startIndex, endIndex }`                                                  | 虚拟模式可见范围，包含分页偏移；无范围时为 -1 |
| `viewport`                       | `HTMLElement \| undefined`                                                  | 设置高度或虚拟化时的滚动容器                  |
| `scrollToIndex(index, options?)` | `align?: 'start' \| 'center' \| 'end' \| 'auto'; behavior?: ScrollBehavior` | 滚动到当前页内的条目，index 使用全局下标      |

`scrollToIndex` 在存在内部滚动容器时只滚动该容器；没有内部容器时，这个显式调用才会滚动外层祖先，让目标条目进入视口。

直接修改分页模型不会再次触发 `pageChange`；远程请求应监听模型。所有数据类型均从包根导出，包括 `DataListProps<T>`、`DataListItemSlot<T>`、`DataListState<T>`、`DataListVirtualOptions` 和 `DataListExpose`。
