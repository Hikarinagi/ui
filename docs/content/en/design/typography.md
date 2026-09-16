---
title: Typography
description: Establish hierarchy through size, weight and spacing, with a shared rhythm for Chinese and Latin text.
---

<script setup lang="ts">
  import DesignTypography from '~/components/design/Typography.vue'
</script>

## Fonts and hierarchy {#hierarchy}

Body text uses Noto Sans SC; monospaced content uses JetBrains Mono. Applications load the fonts, and the font tokens include system fallbacks. See [Installation](/guide/installation#fonts) for setup.

Establish hierarchy with size and spacing before adding weight. Use normal weight for body text, medium for control labels and semibold for headings. Avoid emphasizing everything or using faint colors for required reading.

<DesignTypography />

## Type scale {#scale}

Font sizes and line heights are paired. Pixel values below assume a 16px root font size; the tokens use rem and follow changes to the root size.

| Size | Font size | Line height | Suggested use                        |
| ---- | --------- | ----------- | ------------------------------------ |
| xs   | 13px      | 20px        | Annotations and supporting markers   |
| sm   | 14px      | 22px        | Controls, tables and supporting text |
| base | 16px      | 24px        | Body text                            |
| md   | 18px      | 28px        | Introductions and small headings     |
| lg   | 20px      | 30px        | Section headings                     |
| xl   | 24px      | 34px        | Content headings                     |
| 2xl  | 30px      | 40px        | Page headings                        |

Use `--hn-text-*` and `--hn-leading-*`, or the matching `text-*` utilities. Use [Text](/components/text) for text and [Heading](/components/heading) for headings. Heading's `level` represents document structure; `size` controls appearance. Do not skip semantic levels to obtain a different size.

## Weights and monospaced text {#weight}

Hina provides normal (400), medium (500) and semibold (600) weights. Override `--hn-font-sans` and `--hn-font-mono` to customize fonts, and load the weights you use instead of relying on synthetic bold.

Use [Code](/components/code) for inline code and [CodeBlock](/components/code-block) for blocks. Add `tabular-nums` to numeric columns to align digits without changing all the text to a monospaced font.

## Long content and truncation {#overflow}

Let body text wrap and avoid clipping it with fixed heights. When a label must truncate, provide access to the full text, for example through [Tooltip](/components/tooltip), and retain its accessible name. Essential information should not depend on mouse hover alone.

Apply `min-w-0` to text columns in flex layouts and `shrink-0` to fixed action areas. Check wrapping and long labels across languages rather than sizing text regions by character count.
