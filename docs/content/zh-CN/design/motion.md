---
title: 交互与动效
description: 状态变化应清晰、连贯。动效交代来源与去向，不延迟用户完成操作。
---

<script setup lang="ts">
  import DesignMotion from '~/components/design/Motion.vue'
</script>

## 交互状态 {#states}

组件的语义色表达含义，状态层表达 hover 与 pressed，焦点轮廓表达键盘所在位置。不要在悬停时替换整个语义配色，也不要把焦点轮廓当成选中状态。

默认 hover 状态层不透明度为浅色 6%、深色 9%；pressed 为浅色 10%、深色 13%。使用已有的 [Button](/components/button)、[NavLink](/components/nav-link) 等交互组件保持一致，不必为每个入口重新设计反馈。

禁用表示当前不可操作，应同时具有语义上的 disabled 状态。loading 表示正在处理，是否阻止操作取决于组件和任务本身；不要将所有 loading 状态都直接当作 disabled。

## 时长与节奏 {#timing}

<DesignMotion />

| Token                | 默认时长 | 用途                   |
| -------------------- | -------- | ---------------------- |
| `--hn-duration-fast` | 200ms    | 短促的状态反馈         |
| `--hn-duration-base` | 300ms    | 常规过渡               |
| `--hn-duration-slow` | 450ms    | 需要交代结构变化的过渡 |
| `--hn-duration-exit` | 200ms    | 退场                   |

缓动按方向选择：进入使用 `--hn-ease-enter`，退出使用 `--hn-ease-exit`，位置变化使用 `--hn-ease-move`。小幅位移提供 `--hn-travel-sm`（4px）与 `--hn-travel-md`（10px）。控件的反馈应即时开始，连续操作能够中断或衔接当前动画。

## 连续性与性能 {#continuity}

优先对 opacity、transform 做动画。涉及尺寸变化时，检查长内容和复杂子树，避免每帧测量布局或重新渲染所有子项。动画过程中保持触发器与浮层的空间关系，退场内容不应继续接收交互并意外重新打开。

使用 [Accordion](/components/accordion)、[Dialog](/components/dialog) 和 [Highlight](/components/highlight) 等已有能力前，先检查各组件提供的控制范围。组件已经承担的过渡不要在外层重复叠加。

## 焦点、键盘与减少动效 {#accessibility}

所有操作都需要清晰名称。纯图标按钮通过 [IconButton](/components/icon-button) 的 `label` 提供名称；表单通过 [FormField](/components/form-field) 关联标签和错误信息。不要移除可见焦点，也不要只用鼠标事件实现可操作元素。

Hina 的焦点轮廓默认使用 `--hn-focus-ring`、2px 宽度与 2px 偏移。自定义配色时保留焦点与相邻表面的辨识度。浮层关闭后应恢复到仍存在且合理的焦点目标，删除触发项时尤其需要检查。

系统启用 `prefers-reduced-motion: reduce` 时，常规时长 token 降至 1ms，位移和错峰 token 归零。持续加载类动画各有自己的减少动效处理；自定义动画同样需要尊重系统设置，不应把必要信息只放在动画过程里。
