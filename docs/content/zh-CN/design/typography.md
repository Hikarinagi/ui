---
title: 排版
description: 用字号、字重和留白建立层次，让中西文在同一套节奏中阅读。
---

<script setup lang="ts">
  import DesignTypography from '~/components/design/Typography.vue'
</script>

## 字体与层次 {#hierarchy}

正文使用 Noto Sans SC，等宽内容使用 JetBrains Mono；字体由应用加载，变量中包含系统字体回退。配置方法见[安装](/guide/installation#fonts)。

优先通过字号和留白区分层级，再使用字重强调。正文保持 normal，控件标签可用 medium，标题可用 semibold。避免把所有文字都加粗，也不要把弱化颜色用于必读内容。

<DesignTypography />

## 字号与行高 {#scale}

字号与行高成对定义。下表的像素值按根字号 16px 换算，实际使用 rem，会跟随根字号变化。

| 尺寸 | 字号 | 行高 | 建议用途                 |
| ---- | ---- | ---- | ------------------------ |
| xs   | 13px | 20px | 注释、辅助标记           |
| sm   | 14px | 22px | 控件文字、表格与补充说明 |
| base | 16px | 24px | 正文                     |
| md   | 18px | 28px | 引导文字、小节标题       |
| lg   | 20px | 30px | 分区标题                 |
| xl   | 24px | 34px | 内容标题                 |
| 2xl  | 30px | 40px | 页面标题                 |

使用 `--hn-text-*` 和 `--hn-leading-*`，或对应的 `text-*` 工具类。组件文字使用 [Text](/components/text)，标题使用 [Heading](/components/heading)。Heading 的 `level` 表示文档结构，`size` 表示外观，不应为了字号跳过语义层级。

## 字重与等宽内容 {#weight}

Hina 提供 `normal`（400）、`medium`（500）、`semibold`（600）三档字重。需要修改字体时覆盖 `--hn-font-sans` 与 `--hn-font-mono`，并加载实际使用的字重，避免依赖浏览器合成。

行内代码使用 [Code](/components/code)，多行代码使用 [CodeBlock](/components/code-block)。数字列可添加 `tabular-nums` 保持数位对齐，不需要将整列正文改成等宽字体。

## 长内容与截断 {#overflow}

正文优先允许换行，避免固定高度裁掉内容。标签必须截断时，应保留获取全文的方式，例如 [Tooltip](/components/tooltip)，同时保留可访问名称。不要依赖仅有鼠标悬停才能读到的关键信息。

在弹性布局中为文字所在列设置 `min-w-0`；固定操作区域保持 `shrink-0`。多语言切换后重新检查长标签与换行，不按中文字符数固定宽度。
