---
title: QRCode
description: 将链接或文本生成为可扫描、可导出的二维码。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/qr-code/QRCode.vue
---

<Demo name="qr-code/hero" />

## 用法 {#usage}

```vue
<script setup lang="ts">
  import { QRCode } from '@hina-ui/vue'
</script>

<template>
  <QRCode value="https://hinaui.dev" label="Hina UI 文档站" />
</template>
```

`value` 是要编码的原始字符串，链接、中文和普通文本都可以。组件不访问链接，也不解释查询参数。`label` 为辅助技术描述二维码用途；可访问的页面链接仍应由调用方另外提供。

直接输出 SVG，SSR 首屏就有完整码图和尺寸，水合不需要测量、Canvas 或重新请求二维码。空字符串显示空态；内容超过二维码容量时显示错误态并触发 `error`，修正内容后自动恢复。

## 示例 {#examples}

### 尺寸、颜色与标志 {#appearance}

尺寸包含周围留白，容器较窄时等比缩小。`color` 和 `background` 接受 CSS 颜色或 token；默认使用专用语义 token，在深色主题下仍保持深色码、浅色底，避免自动反色。

中心标志使用 `logo`。未指定 `level` 时，带标志默认采用 `H`，普通二维码默认采用 `M`。`logoSize` 和 `logoMargin` 是设计尺寸内的像素值，会随整体缩放；标志边长最多占总边长的四分之一。图片加载失败时移除标志及其底色，恢复完整码图，并触发 `logo-error`。

<Demo name="qr-code/appearance" />

颜色应保持深码浅底和足够对比度，标志尽量小，并用实际扫码设备验收。较高纠错等级不能保证任意面积的遮挡都可恢复。默认 `:margin="4"` 是四个码格的安静区，采用 [QR Code 官方规定的留白](https://www.qrcode.com/en/howto/code.html)；它不是像素内边距。

### 状态与刷新 {#status}

`status` 由调用方控制。组件没有倒计时、轮询或请求逻辑。加载、过期和已扫描状态隐藏旧码，保留方形占位；过期态的按钮只触发 `refresh`，等待业务请求更新 `value` 和 `status`。

<Demo name="qr-code/status" />

### 自定义状态 {#custom}

`#status` 可完全替换非激活态的内容，提供 `{ status, error, refresh }`。例如分享链接失效后，需要自己的提示文案和操作。`error` 只表示编码失败；外部请求错误由调用方处理。

<Demo name="qr-code/custom" />

### 导出图片 {#export}

通过组件 ref 的 `toBlob()` 导出 PNG，或指定 `type: 'image/svg+xml'` 获取 SVG。组件只生成文件内容，文件名和下载操作由调用方决定。

导出会固定当前颜色并将标志内嵌，文件不依赖页面 CSS 或标志地址。跨域标志需要服务端允许 CORS；读取失败时 Promise 拒绝，不会静默导出一张缺少标志的图片。非激活态不能导出。

<Demo name="qr-code/export" />

```ts
import { ref } from 'vue'
import type { QRCodeExpose } from '@hina-ui/vue'

const code = ref<QRCodeExpose>()
const png = await code.value?.toBlob({ scale: 3 })
const svg = await code.value?.toBlob({ type: 'image/svg+xml' })
```

## API {#api}

### Props {#props}

| 属性         | 类型                                              | 默认值                   | 说明                                              |
| ------------ | ------------------------------------------------- | ------------------------ | ------------------------------------------------- |
| `value`      | `string`                                          | —                        | 要编码的内容，必填                                |
| `label`      | `string`                                          | 本地化“二维码”           | SVG 的无障碍名称                                  |
| `size`       | `number`                                          | `192`                    | 含留白的设计边长，px；最大 4096，窄容器内等比缩小 |
| `level`      | `'L' \| 'M' \| 'Q' \| 'H'`                        | 有 logo 时 `H`，否则 `M` | 纠错等级                                          |
| `margin`     | `number`                                          | `4`                      | 四周留白，单位为码格，0–64 的整数                 |
| `color`      | `string`                                          | `--hn-qr-foreground`     | 码图颜色                                          |
| `background` | `string`                                          | `--hn-qr-background`     | 码图和标志底色                                    |
| `bordered`   | `boolean`                                         | `true`                   | 外轮廓                                            |
| `logo`       | `string`                                          | —                        | 中心图片 URL，也可使用 data URL                   |
| `logoSize`   | `number`                                          | `32`                     | 标志边长，px；上限为设计边长的 25%                |
| `logoMargin` | `number`                                          | `2`                      | 标志四周留白，px；上限为设计边长的 1/32           |
| `status`     | `'active' \| 'loading' \| 'expired' \| 'scanned'` | `'active'`               | 外部状态                                          |
| `class`      | `string`                                          | —                        | 根节点样式                                        |

### Slots {#slots}

| 插槽     | 参数               | 说明                                       |
| -------- | ------------------ | ------------------------------------------ |
| `status` | `QRCodeStatusSlot` | 非激活态内容：`{ status, error, refresh }` |

实际状态 `QRCodeState` 还包括 `empty` 和 `error`，由编码结果决定。根节点通过 `data-state` 暴露实际状态；加载时带 `aria-busy`。

### Events {#events}

| 事件         | 参数    | 说明                     |
| ------------ | ------- | ------------------------ |
| `refresh`    | —       | 请求刷新，不自动改变状态 |
| `error`      | `Error` | 编码失败                 |
| `logo-error` | `Event` | 中心图片加载失败         |

### Expose {#expose}

| 名称               | 类型                         | 说明                               |
| ------------------ | ---------------------------- | ---------------------------------- |
| `element`          | `HTMLElement \| undefined`   | 根节点                             |
| `svg`              | `SVGSVGElement \| undefined` | 当前激活码图                       |
| `toBlob(options?)` | `Promise<Blob>`              | 浏览器中导出当前二维码；失败时拒绝 |

`QRCodeExportOptions` 提供 `type`（默认 `'image/png'`）和 PNG 的 `scale`（默认 2，范围 1–8）。PNG 按 `size × scale` 导出，单边最大 8192px；SVG 按 `size` 导出。`QRCodeProps`、`QRCodeLevel`、`QRCodeStatus`、`QRCodeState`、`QRCodeStatusSlot`、`QRCodeExportOptions` 和 `QRCodeExpose` 均从包根导出。
