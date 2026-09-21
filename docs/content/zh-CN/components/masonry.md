---
title: Masonry
description: 保留内容自然高度的瀑布流，适合封面、图片和卡片集合。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/masonry/Masonry.vue
---

<Demo name="masonry/hero" />

## 用法 {#usage}

```ts
import { Masonry } from '@hina-ui/vue'
```

传入数据、稳定的 `get-key` 和条目插槽。默认按当前最短列排列，列数根据**容器宽度**计算。

```vue
<Masonry :items="photos" :get-key="photo => photo.id" :min-column-width="200" label="照片">
  <template #default="{ item }">
    <Image :src="item.src" :alt="item.title" :ratio="item.width / item.height" />
  </template>
</Masonry>
```

Masonry 负责布局，不增加卡片外观、点击行为或内部滚动条。用 Card、Image 或自己的内容构成条目；放入 ScrollArea 可使用容器滚动。需要内容对齐、逐行比较时，使用 Grid、DataList 或 DataTable 更合适。

## 示例 {#examples}

### 首次布局占位 {#pending}

SSR 场景建议提供 `#pending`，用骨架屏或其他占位内容遮住初始化排版。SSR 与客户端初始渲染显示同一份占位，真实条目仍挂载在相同宽度下完成测量，但不可见、不可交互，也不会进入 Tab 顺序；首次布局完成后直接展示已经排好的内容。

CSR 也使用同一套行为。**这是组件管理的插槽，没有额外的 `pending` prop。** 首批请求期间传 `loading`，直到数据返回：没有可展示内容时使用 `#pending`，已有布局时使用末尾的 `#loading`，不会把已有列表重新盖住。清空后再次请求视为新的首批加载。

<Demo name="masonry/pending" />

示例的骨架采用 CSS 多列，卡片高度错落排列，间距跟随 Masonry 的 token。它不需要 JavaScript 测量，SSR 首屏即可呈现瀑布流占位；占位自身不会再经历从 Grid 到瀑布流的切换。

`#pending` 等待的是首次布局，不会等待图片下载、字体加载或任意插槽的后续异步请求。图片有尺寸时使用 `ratio` 预留空间；占位与最终列表的总高度仍可能不同，需要控制页面位移时，应为占位设计接近的高度或设置外层最小高度。

未提供 `#pending` 时沿用可见 Grid 的 SSR 回退。提供后，需要客户端脚本完成初始化才会展示条目；无需针对 SSR / CSR 写两套模板。

### 自适应列数与方向 {#responsive}

`min-column-width` 是每列期望的最小宽度，单位 px。空间不足时退到一列并缩到容器宽度。显式传入 `columns` 后固定列数，忽略最小列宽；小屏场景优先使用自动列数。

支持继承方向或显式设置 `dir`，列位置使用逻辑方向。

<Demo name="masonry/responsive" />

### 内容展开 {#dynamic}

图片、文本换行或 Collapsible 引起的高度变化会自动参与布局。条目保留稳定的 DOM 节点，尺寸变化不会重建内部组件。

<Demo name="masonry/dynamic" />

### 排列顺序 {#order}

默认将下一项放到最短列，适合尽量紧凑地展示内容。`sequential` 按第 1、2、3 列轮流放置，保留每一轮的横向顺序，但各列总高度可能更不均匀。

两种方式都保留**数据的 DOM 顺序和 Tab 顺序**，不会生成多个列容器重新组织节点。瀑布流的视觉位置仍有高低差；有严格阅读先后关系的内容应优先用普通列表。

<Demo name="masonry/order" />

### 追加加载与空状态 {#loading}

`loading` 保留现有内容，在列表末尾显示加载提示；没有数据且未加载时显示 `#empty`。请求、分页和何时加载更多由调用方决定。追加时使用稳定 key，已有条目不会重建或主动滚动。

<Demo name="masonry/loading" />

## 首屏与性能 {#rendering}

- 提供 `#pending` 时，SSR 和首次布局阶段显示占位，真实条目保持可测量；完成定位后切换为可见内容。容器暂时隐藏或宽度为零时继续等待。
- 未提供 `#pending` 时，SSR 输出完整的响应式 Grid，挂载后转为瀑布流，下方条目的位置可能变化。没有 JavaScript 时保留这份 Grid；使用 `#pending` 则保留占位。不支持 ResizeObserver 的客户端会结束占位并回退到 Grid。
- 使用 ResizeObserver 缓存每项高度。同一帧的变化合并处理，只写入变化的几何属性；闲置和滚动时不做逐帧轮询。
- 渲染全部数据，不提供虚拟化。特别长的集合先分页或分批加载；需要虚拟化的普通列表使用 VirtualList。
- 不为重排加入位移或缩放动画。布局变化不会改变条目的焦点顺序；重新排序仍存在的焦点节点时保留焦点，不额外滚动。
- `itemClass` 用于条目外观；间隔使用 `gap`，不要给条目添加外边距或覆盖其定位和宽度。外框的 padding、border 和背景放在根节点 `class` 上。

## API {#api}

### Props {#props}

| 属性             | 类型                                                          | 默认值               | 说明                                             |
| ---------------- | ------------------------------------------------------------- | -------------------- | ------------------------------------------------ |
| `items`          | `readonly T[]`                                                | 必填                 | 条目数据                                         |
| `getKey`         | `(item: T, index: number) => string \| number`                | 必填                 | 唯一、稳定的业务标识；可增删或排序时不要使用下标 |
| `columns`        | `number`                                                      | —                    | 固定列数；不传则根据容器计算                     |
| `minColumnWidth` | `number`                                                      | `240`                | 自动列数的最小列宽，单位 px                      |
| `gap`            | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`              | `'md'`               | Hina 间距；md 跟随密度 token                     |
| `sequential`     | `boolean`                                                     | `false`              | 按列轮流排列，代替最短列优先                     |
| `loading`        | `boolean`                                                     | `false`              | 列表繁忙状态及末尾加载提示                       |
| `emptyText`      | `string`                                                      | 当前语言的“暂无内容” | 空状态文字                                       |
| `label`          | `string`                                                      | —                    | 列表的无障碍名称                                 |
| `dir`            | `'ltr' \| 'rtl'`                                              | 继承                 | 排列方向                                         |
| `class`          | `string`                                                      | —                    | 根节点样式；原生属性及 style 也落到根节点        |
| `itemClass`      | `string \| ((item: T, index: number) => string \| undefined)` | —                    | 条目包装节点样式                                 |

### Slots {#slots}

| 插槽      | 参数                         | 说明                                           |
| --------- | ---------------------------- | ---------------------------------------------- |
| `default` | `{ item: T, index: number }` | 条目内容                                       |
| `empty`   | —                            | 空状态                                         |
| `pending` | —                            | 首次布局及首批请求的占位；外层提供加载状态语义 |
| `loading` | —                            | 替换末尾加载提示，外层保留 `role="status"`     |

### Events {#events}

| 事件     | 参数                                  | 说明                                                    |
| -------- | ------------------------------------- | ------------------------------------------------------- |
| `layout` | `{ columns: number, height: number }` | 首次测量完成，或列数、列表高度变化；height 不含加载提示 |

### Expose {#expose}

| 名称      | 类型                       | 说明                                           |
| --------- | -------------------------- | ---------------------------------------------- |
| `element` | `HTMLElement \| undefined` | 根节点                                         |
| `measure` | `() => void`               | 请求下一帧重新测量；普通内容、尺寸变化无需调用 |

间距 token 的变化通过独立的尺寸探针自动同步，无需观察整棵应用 DOM 的样式变化。
