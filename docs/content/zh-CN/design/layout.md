---
title: 布局与密度
description: 用统一的间距、控件尺度和表面层次组织界面，密度由容器传递。
---

<script setup lang="ts">
  import DesignGeometry from '~/components/design/Geometry.vue'
</script>

## 尺寸与密度 {#density}

`size` 调整单个组件的尺寸，`data-density` 调整一个区域内控件的高度、内边距与间距。默认是 `comfortable`，`compact` 提高信息密度，不改变文字的语义层级，也不会自动跟随屏幕宽度切换。

下面两组控件都使用默认 size，分别继承两种密度。

<DesignGeometry />

| Token               | comfortable | compact |
| ------------------- | ----------- | ------- |
| `--hn-control-h-sm` | 28px        | 24px    |
| `--hn-control-h-md` | 36px        | 30px    |
| `--hn-control-h-lg` | 44px        | 36px    |
| `--hn-control-gap`  | 6px         | 4px     |
| `--hn-field-gap`    | 8px         | 6px     |
| `--hn-stack-gap`    | 16px        | 12px    |
| `--hn-inline-gap`   | 12px        | 8px     |
| `--hn-panel-p`      | 20px        | 14px    |
| `--hn-row-h`        | 44px        | 34px    |

像素值按根字号 16px 换算。紧凑布局应保留清晰的操作目标，不能只为了容纳更多内容而缩小所有按钮。浮层通过 Portal 渲染时，需要确认目标容器也继承了密度。全局密度可设置在根元素上；局部密度需要检查浮层的实际挂载范围。

## 间距与对齐 {#spacing}

使用 [Stack](/components/stack) 与 [Inline](/components/inline) 表达同组内容，用 [Grid](/components/grid) 表达列关系。同组内容间距小于组间距；不要同时给父容器加 gap、给子元素加等量 margin，造成重复留白。

默认 gap 使用密度 token。明确选用 `xs`、`sm`、`lg`、`xl` 时，则使用组件定义的固定间距。表单标签、说明和控件的关系交给 [FormField](/components/form-field)；页面骨架可使用 [Page](/components/page) 或 [AppShell](/components/app-shell)。

优先使用 `ms`、`me`、`ps`、`pe`、`start`、`end` 等逻辑方向，保持从右到左布局下的对齐关系。窄屏先调整列数、换行和区域排列，再考虑压缩间距。

## 圆角 {#radius}

| Token              | 默认值 |
| ------------------ | ------ |
| `--hn-radius-xs`   | 4px    |
| `--hn-radius-sm`   | 6px    |
| `--hn-radius-md`   | 8px    |
| `--hn-radius-lg`   | 8px    |
| `--hn-radius-xl`   | 14px   |
| `--hn-radius-full` | 9999px |

圆角表达形态，不代表交互状态。使用组件已有的圆角或 `pill` 能力；不要通过改变圆角表示 hover、选中或错误。嵌套表面需要同时检查内外圆角与留白，避免内层轮廓顶住外层边缘。

## 层次与阴影 {#elevation}

`shadow-sm`、`shadow-md`、`shadow-lg` 映射到主题对应的阴影。优先用间距与边界划分平面内容，再用阴影表达抬升的表面；无需给每个嵌套容器都添加阴影。

[Card](/components/card) 提供内容表面，[Popover](/components/popover)、[Dialog](/components/dialog) 等浮层负责各自的定位、层级和焦点行为。不要通过在业务层随意叠加 z-index 修正浮层顺序。
