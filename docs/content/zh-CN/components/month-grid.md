---
title: MonthGrid
description: 在月份网格中展示日程、签到、价格或每日状态。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/month-grid/MonthGrid.vue
---

<Demo name="month-grid/hero" />

## 用法 {#usage}

```ts
import { MonthGrid } from '@hina-ui/vue'
```

`v-model:month` 绑定显示月份，格式为 `YYYY-MM`。默认插槽接收每天的信息，渲染在日期数字下方，可以放文本、状态或独立的操作入口。

```vue
<MonthGrid v-model:month="month" today="2026-09-21" label="团队日程">
  <template #default="{ date }">
    <Text v-for="event in eventsByDate[date]" :key="event.id" size="xs">
      {{ event.title }}
    </Text>
  </template>
</MonthGrid>
```

| 场景                               | 组件                  |
| ---------------------------------- | --------------------- |
| 选择一个日期，写入表单             | Calendar / DatePicker |
| 按月查看每天的内容或执行当天的操作 | MonthGrid             |

MonthGrid 没有选中日期、选中高亮或整格点击事件。需要按钮、链接或浮层时，在日期插槽中组合；不会生成嵌套按钮，也不会拦截这些控件的键盘事件。

## 示例 {#examples}

### 保留日期的局部定制 {#check-in}

`#day-trailing` 在日期旁附加状态、节假日或数量，默认日期的格式、今天标记和无障碍名称仍由组件负责。只修改日期数字的呈现时用 `#date`，内容会渲染在原有 `time` 内；这个插槽适合文本与装饰，不要放交互控件。

下面隐藏内置头部，使用 `cellClass` 为已签到和休息日铺满整格背景。签到按钮使用默认内容插槽，签到记录由业务保存。

<Demo name="month-grid/check-in" />

### 自定义整格与价格日历 {#prices}

`#day` 替换整个内容区，包括日期头部和默认内容。表格的 `td` 和内部布局容器仍由组件保留。用 `dayPadding=0` 消除组件内边距，再由插槽按钮负责内边距，就能让操作铺满内容区。

这个示例组合了日期、价格、库存、售罄与业务选择状态；按钮自行管理禁用和 `aria-pressed`。MonthGrid 不持有预订值。

<Demo name="month-grid/prices" />

### 保留默认导航的工具栏 {#actions}

顶部日程示例通过 `#header-actions` 添加分类筛选。月份标题、月份／年份选择器和翻页逻辑完整保留；窄容器下操作区自动换到下一行。插槽接收与 `#header` 相同的上下文。

```vue
<MonthGrid v-model:month="month">
  <template #header-actions>
    <Select v-model="category" :options="categories" aria-label="日程分类" />
  </template>
</MonthGrid>
```

使用 `#header` 时整体接管头部，`#header-actions` 不再自动渲染。`:show-header="false"` 会移除整块头部及其间距，表格仍保留可访问名称。

### 单元格样式与布局 {#customization}

| 入口           | 作用位置           | 常见用途                             |
| -------------- | ------------------ | ------------------------------------ |
| `cellClass`    | 日期的 `td`        | 铺满整格的状态背景、边框、单元格间距 |
| `dayClass`     | `td` 内的内容容器  | 内容对齐、间距、布局方式             |
| `dayMinHeight` | 内容容器的最小高度 | 独立于头部控件大小调整日格           |
| `dayPadding`   | 内容容器的内边距   | 紧凑排版或整格操作入口               |

两个 class 属性都接受字符串或 `(day: MonthGridDay) => string | undefined`。回调获得与日期插槽相同的上下文，对相邻月份及被隐藏的空格也会执行。调用方样式经过合并，可以覆盖默认样式，不需要后代选择器。

两个尺寸属性接受数值（px）或 CSS 长度，如 `112`、`'7rem'`、`'var(--my-calendar-spacing)'`；`dayPadding` 也接受 `'4px 8px'`。未设置时使用 Hina 默认尺寸与响应式间距。最小高度不截断内容，内容增多时仍会撑高所在行；限制展示数量和“更多”入口由业务实现。

### 自定义头部与日期范围 {#header}

`#header` 提供当前月份、显示区间和受范围约束的翻页方法，可换成下拉框或自己的工具栏。下面同时演示了非固定周数、相邻月份显隐和周日起始。

`min` / `max` 使用 `YYYY-MM-DD`。翻页不会超出边界月份，日格通过 `isDisabled` 标出范围外的日期。**插槽里的按钮需要自己绑定 `:disabled="isDisabled"`**，组件不会干预业务内容。

<Demo name="month-grid/header" />

### 月份与年份跳转 {#navigation}

默认头部提供上／下月、回到本月和月份标题。点击标题打开月份选择器，点击年份继续切换年份，复用 Calendar 的月份／年份视图。选择后返回原按钮，不移动页面；Esc 从年份退回月份，再关闭选择器。

`:show-today="false"` 可隐藏回到本月的入口。`disabled` 停用默认导航，同时将所有日期的 `isDisabled` 设为 `true`。自定义头部应使用 `canPrev`、`canNext`、`canToday`。

### 数据加载 {#data}

`range-change` 在客户端挂载后首次发出，之后在月份、一周起始日或周数改变时发出。参数包含显示月份及整个表格的起止日期，均为 ISO 字符串，可据此请求包括相邻月份在内的数据。

```vue
<MonthGrid v-model:month="month" @range-change="loadRange">
  <template #default="{ date }">
    <Text size="xs">{{ summaries[date] }}</Text>
  </template>
</MonthGrid>
```

请求、加载提示、错误和过期响应处理由调用方管理。SSR 数据应在页面层按已知月份预取，不能依赖只在客户端发出的 `range-change`。范围始终描述整张表格，即使相邻月份的内容被隐藏。

## 首屏与布局 {#rendering}

- 服务端直接输出星期标题、完整日期格和插槽内容；布局没有浏览器测量阶段。
- 默认以 UTC 计算今天，避免服务器与浏览器本地时区不同。业务有固定时区时传 `timeZone`；要求跨午夜水合也完全一致时，由页面传入同一份 `today` 和 `month`。
- 默认固定六周，切换月份时行数保持不变。`fixedWeeks=false` 时为当月所需的四至六周。
- `size` 提供日格和控件的默认尺寸，`dayMinHeight`、`dayPadding` 可独立覆盖日格布局。内容可以自然撑高；窄屏默认减少格内间距。长日程建议限制条数或显示数量，再通过 Popover 或 Dialog 展开。
- 使用 Gregorian 日期与本地化的月份、星期名称。一周的起始日默认跟随语言，中文从周一开始。方向继承页面，支持 RTL。
- 无法解析的月份回退到今天所在月，合法但越界的月份显示最近的边界月；非法日期边界被忽略，反向的范围整体忽略。回退不自动改写调用方的模型。

## 无障碍 {#a11y}

展示区使用原生 table、caption 和带 `scope="col"` 的星期表头。默认日期使用具备完整日期名称的 time 节点，今天带有 `aria-current="date"`。日期格不是可选择的 ARIA grid，没有额外的 Tab 停靠点。

插槽中的按钮、链接正常参与 Tab 顺序。替换整格时，保留日期名称，并为图标或操作补齐可访问名称。

## API {#api}

### Props {#props}

| 属性              | 类型                                                     | 默认值       | 说明                                       |
| ----------------- | -------------------------------------------------------- | ------------ | ------------------------------------------ |
| `month`           | `string`                                                 | 今天所在月   | `YYYY-MM`，支持 `v-model:month`            |
| `dir`             | `'ltr' \| 'rtl'`                                         | 继承         | 表格及月份、年份选择器的方向               |
| `today`           | `string`                                                 | 按时区计算   | `YYYY-MM-DD`，指定今天并覆盖自动计算       |
| `timeZone`        | `string`                                                 | `'UTC'`      | 计算今天使用的 IANA 时区                   |
| `min` / `max`     | `string`                                                 | —            | 日期边界，`YYYY-MM-DD`                     |
| `weekStartsOn`    | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                        | 随语言       | 一周起始日，0 为周日                       |
| `weekdayFormat`   | `'narrow' \| 'short' \| 'long'`                          | `'short'`    | 星期显示格式                               |
| `fixedWeeks`      | `boolean`                                                | `true`       | 固定六周                                   |
| `showOutsideDays` | `boolean`                                                | `true`       | 是否渲染相邻月份内容；关闭时保留空格       |
| `showToday`       | `boolean`                                                | `true`       | 默认头部显示回到本月按钮                   |
| `disabled`        | `boolean`                                                | `false`      | 停用默认导航，并传递禁用状态               |
| `size`            | `'sm' \| 'md' \| 'lg'`                                   | `'md'`       | 日期格与默认导航尺寸                       |
| `label`           | `string`                                                 | 本地化“日历” | 表格名称，自动附带当前月份                 |
| `class`           | `string`                                                 | —            | 根节点样式；原生属性及 style 也传到根节点  |
| `showHeader`      | `boolean`                                                | `true`       | 显示内置头部或 header 插槽；关闭时不留间距 |
| `dayMinHeight`    | `number \| string`                                       | 随 size      | 日格最小高度；数值为 px，内容可撑高        |
| `dayPadding`      | `number \| string`                                       | 响应式间距   | 日格内边距；数值为 px，0 适合整格操作      |
| `cellClass`       | `string \| ((day: MonthGridDay) => string \| undefined)` | —            | 日期 td 样式                               |
| `dayClass`        | `string \| ((day: MonthGridDay) => string \| undefined)` | —            | 日期内容容器样式                           |

### Slots {#slots}

| 插槽             | 参数                        | 说明                                                                 |
| ---------------- | --------------------------- | -------------------------------------------------------------------- |
| `default`        | `MonthGridDay`              | 日期头部下方的内容                                                   |
| `day`            | `MonthGridDay`              | 替换内容区，保留 td 与布局容器；优先于 date、day-trailing 和 default |
| `date`           | `MonthGridDay`              | 替换 time 内的日期内容，保留日期语义与今天标记                       |
| `day-trailing`   | `MonthGridDay`              | 默认日期旁的补充内容                                                 |
| `header`         | `MonthGridHeader`           | 替换整个导航栏                                                       |
| `header-actions` | `MonthGridHeader`           | 默认导航旁的操作区；窄屏换行                                         |
| `weekday`        | `{ day, label, fullLabel }` | 星期表头，day 为 0–6                                                 |
| `footer`         | `{ month, start, end }`     | 表格底部补充内容                                                     |

`MonthGridDay` 包含 `date`（ISO 日期）、`day`（日数）、`dayLabel`（本地化日数文本）、`weekday`（0–6，0 为周日）、`label`（完整日期名称）、`isToday`、`isPast`、`isFuture`、`isOutside`、`isDisabled`。过去／未来相对于同一份 `today` 按日期判断；周末、节假日及业务可用性由调用方定义。

`MonthGridHeader` 包含 `month`、`start`、`end`、`label`、`canPrev`、`canNext`、`canToday`、`prev()`、`next()`、`goToToday()`。

### Events {#events}

| 事件           | 参数                    | 说明                             |
| -------------- | ----------------------- | -------------------------------- |
| `update:month` | `string`                | 用户切换显示月份                 |
| `range-change` | `{ month, start, end }` | 客户端初次挂载及显示日期范围改变 |

### Expose {#expose}

| 名称            | 类型             | 说明                                 |
| --------------- | ---------------- | ------------------------------------ |
| `range`         | `MonthGridRange` | 当前月份与表格日期范围               |
| `prev` / `next` | `() => void`     | 切换月份，遵循范围与禁用状态         |
| `goToToday`     | `() => void`     | 回到今天所在月份，遵循范围与禁用状态 |
