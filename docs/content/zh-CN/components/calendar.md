---
title: Calendar
description: 按月展示与选择日期。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/calendar/Calendar.vue
  - label: Calendar
    href: https://reka-ui.com/docs/components/calendar
---

<Demo name="calendar/hero" />

## 用法 {#usage}

```ts
import { Calendar } from '@hina-ui/vue'
```

日历按月展示日期网格，点击一格即选中。`v-model` 绑定 `YYYY-MM-DD` 格式的 ISO 8601 字符串，与 `DateField` 相同。标题、星期名称与一周的起始日随当前语言变化，中文从周一开始。网格固定显示六周，切换月份时高度不变。

<Demo name="calendar/basic" />

## 示例 {#examples}

### 范围 {#range}

`min` 与 `max` 限定可选范围，范围之外的日期禁用；到达边界月份时，对应方向的翻页按钮也会禁用。

<Demo name="calendar/range" />

### 不可选的日期 {#unavailable}

`unavailable` 接收 `YYYY-MM-DD` 字符串并返回该日期是否不可选，不可选的日期显示删除线，键盘导航时跳过。

<Demo name="calendar/unavailable" />

### 一周的起始日与星期格式 {#week}

`weekStartsOn` 以 0 到 6 指定一周从周几开始，0 是周日，默认随语言决定。`weekdayFormat` 选择星期名称的格式，`narrow` 是单个字，`short` 是「周一」这样的简称。

<Demo name="calendar/week" />

### 尺寸 {#sizes}

`size` 有 `sm`、`md`、`lg` 三档，日期格的边长等于同档控件的高度，翻页按钮与标题使用同一档尺寸。

<Demo name="calendar/sizes" />

### 状态 {#states}

`readonly` 只读，仍然可以用键盘浏览；`disabled` 禁用整个日历。

<Demo name="calendar/states" />

## 行为 {#behavior}

- 点击日期即选中，再次点击已选中的日期不会取消选中。
- 方向键按天或者按周移动焦点，Home 与 End 移到当周的首日与末日，PageUp 与 PageDown 切换月份，Enter 或者空格选中焦点所在的日期。
- 焦点移出当月时，自动切换到焦点所在的月份。
- 点击标题进入月份视图，再点击年份进入年份视图，年份视图每页显示十二年。选中年份回到月份视图，选中月份回到日期视图并显示该月，Esc 逐级返回。三种视图的宽高相同，切换时布局不变。
- `placeholder` 指定显示的月份，默认是当月；翻页与切换视图后，新视图内的日期会以 `update:placeholder` 交出，可以用 `v-model:placeholder` 跟踪或者控制显示的月份。

## 无障碍 {#a11y}

- 根元素带有语言包给出的名称与当前月份，网格是 `role="grid"`，每个日期是带完整日期名称的按钮。
- 整个网格只占一个 Tab 停靠点，焦点在日期之间用方向键移动；聚焦环只在键盘操作时出现。
- 翻页按钮带有语言包给出的名称。

## API {#api}

### Props {#props}

| 属性            | 类型                              | 默认值     | 说明                                   |
| --------------- | --------------------------------- | ---------- | -------------------------------------- |
| `modelValue`    | `string \| null`                  | `null`     | 选中的日期，`YYYY-MM-DD`               |
| `placeholder`   | `string`                          | 当月       | 显示的月份，支持 `v-model:placeholder` |
| `min`           | `string`                          | —          | 可选范围的下限                         |
| `max`           | `string`                          | —          | 可选范围的上限                         |
| `unavailable`   | `(date: string) => boolean`       | —          | 判定某一天是否不可选                   |
| `weekStartsOn`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 随语言     | 一周从周几开始                         |
| `weekdayFormat` | `'narrow' \| 'short'`             | `'narrow'` | 星期名称的格式                         |
| `fixedWeeks`    | `boolean`                         | `true`     | 是否固定显示六周                       |
| `readonly`      | `boolean`                         | `false`    | 是否只读                               |
| `disabled`      | `boolean`                         | `false`    | 是否禁用                               |
| `class`         | `string`                          | —          | 追加至根元素的类名                     |

### 事件 {#events}

| 事件                 | 参数                    | 说明                                 |
| -------------------- | ----------------------- | ------------------------------------ |
| `update:modelValue`  | `value: string \| null` | 选中变化                             |
| `update:placeholder` | `value: string`         | 显示的月份变化，参数是该视图内的日期 |
