---
title: 颜色
description: 以中性色组织内容，以语义色表达状态。颜色跟随主题，含义保持一致。
---

<script setup lang="ts">
  import DesignColors from '~/components/design/Colors.vue'
</script>

## 颜色体系 {#system}

Hina 使用无色偏的中性色、青绿色品牌色和五组语义色。默认品牌色 `brand-500` 为 `#39c5bb`。页面优先使用语义 token，让明暗主题共用同一套组件结构。

下方色块直接读取当前主题的变量。每组左侧展示实心底色与其前景色，右侧展示浅色底与文字色；可通过页头切换主题进行对照。

<DesignColors />

## 语义与用量 {#roles}

| 角色    | 含义                     | 使用原则                                         |
| ------- | ------------------------ | ------------------------------------------------ |
| accent  | 主要操作、选中与当前状态 | 在同一操作组内保持明确的主次，不用它装饰所有内容 |
| success | 成功、完成与有效状态     | 搭配文字或图标说明结果                           |
| warning | 需要注意、尚可继续       | 说明影响，不与危险操作混用                       |
| danger  | 错误、破坏性操作         | 用于需要明确识别的风险与失败                     |
| info    | 中性的信息提示           | 不代表成功或失败                                 |
| neutral | 日常内容与次要操作       | 承担界面的主要面积，降低视觉干扰                 |

[Button](/components/button) 的 `tone` 决定含义，`variant` 决定视觉强度；[Tag](/components/tag)、[Alert](/components/alert) 与 [Text](/components/text) 沿用对应的语义。仅靠颜色不能完整传达状态，应同时提供可读的名称、图标或错误信息。

## 正确配对 {#pairing}

| 用途       | 背景                                  | 前景                                    |
| ---------- | ------------------------------------- | --------------------------------------- |
| 实心强调色 | `--hn-accent` / `bg-accent`           | `--hn-accent-on` / `text-accent-on`     |
| 轻量强调色 | `--hn-accent-soft` / `bg-accent-soft` | `--hn-accent-text` / `text-accent-text` |
| 普通表面   | `--hn-surface` / `bg-surface`         | `--hn-fg-default` / `text-fg`           |
| 补充说明   | 沿用所在表面                          | `--hn-fg-muted` / `text-muted`          |

`success`、`warning`、`danger`、`info` 同样提供实心色、`-on`、`-soft` 和 `-text`。不要把实心底色直接当作小字号文字色，也不要默认认为实心按钮上的文字一定是白色。`text-faint` 用于非关键信息，禁用文字使用 `text-disabled`。

## 表面与边界 {#surfaces}

`bg-canvas` 是页面背景，`bg-surface` 是内容表面，`bg-subtle` 提供轻量分区，`bg-inset` 提供更明显的内嵌区域。浅色主题的 surface 为纯白，深色主题为纯黑；这些角色不是按亮度排序的层级编号。

常规边界使用 `border-line`，需要更清晰的轮廓时使用 `border-line-strong`。弹层遮罩使用 `--hn-bg-scrim`，与内容表面的颜色分开控制。不要通过不断加深背景来堆叠层次。

## 自定义主题 {#customization}

引入样式后覆盖 CSS 变量。修改品牌时同时定义底色、底色上的文字、普通文字、浅底与焦点色，并分别检查明暗主题中的可读性。只覆盖 `--hn-accent` 不会自动更新其余角色。

```css
:root {
  --hn-accent: #39c5bb;
  --hn-accent-on: #0a0a0a;
  --hn-accent-text: #1f827b;
  --hn-accent-soft: color-mix(in oklab, var(--hn-accent) 12%, var(--hn-surface));
  --hn-accent-border: color-mix(in oklab, var(--hn-accent) 34%, transparent);
  --hn-focus-ring: #2ba79e;
}

.dark {
  --hn-accent: #45d4c9;
  --hn-accent-on: #000000;
  --hn-accent-text: #45d4c9;
  --hn-accent-soft: color-mix(in oklab, var(--hn-accent) 24%, var(--hn-surface));
  --hn-accent-border: color-mix(in oklab, var(--hn-accent) 30%, transparent);
  --hn-focus-ring: #45d4c9;
}
```

以上是默认强调色的完整配对，可作为调整起点。完整接入方法见[安装](/guide/installation)，焦点和交互状态见[交互与动效](/design/motion)。
