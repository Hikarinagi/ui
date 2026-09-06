---
title: Card
description: 承载一组内容的容器，比页面底色高出一层。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/card/Card.vue
---

<Demo name="card/hero" />

## 用法 {#usage}

```ts
import { Card } from '@hina-ui/vue'
```

卡片由三部分构成视觉：自身的背景色、一条细边框，以及一层静止状态的阴影，三者共同使它比页面底色高出一层。内容置于默认插槽中。

<Demo name="card/basic" />

卡片只负责这一层容器，不决定其中内容如何排布。内容的方向与间距应交由 `Stack`、`Inline` 等布局组件处理。

## 示例 {#examples}

### 内边距 {#padded}

卡片默认带有内边距，取值随密度变化。图片、表格等需要贴合卡片边缘的内容，应将 `padded` 设为 `false`，再由内部容器提供内边距。

<Demo name="card/padded" />

若内容需要随圆角一同裁切，为卡片添加 `overflow-hidden`。

### 语义标签 {#as}

`as` 用于指定渲染的标签，默认为 `div`，仅在需要更准确的语义时替换：独立成篇的内容使用 `article`，页面中的一个区块使用 `section`；一组卡片构成列表时，容器使用 `ul`，每张卡片使用 `li`。

<Demo name="card/as" />

### 可点击的卡片 {#interactive}

卡片自身不带任何可点击的样式，既不会在悬停时改变颜色，也不会提升阴影层级。需要整张卡片可点击时，由调用方组合实现：`as="button"` 替换标签，`hn-interactive` 提供指针样式与焦点环，`hn-state-layer` 提供悬停时的状态层，`hn-press-lg` 将按压时的缩放幅度调整为适合大面积元素的档位，另置入一个 `Ripple`。

<Demo name="card/interactive" />

若卡片中仅有局部可点击，则不应如此处理：应在该处放置 `Button` 或 `Link`，卡片本身保持静态。

### 密度 {#density}

内边距取自密度 token，因此在任意祖先元素上设置 `data-density="compact"`，其范围内的卡片都会随之收紧，无需向卡片传入参数。

<Demo name="card/density" />

## 无障碍 {#a11y}

- 卡片默认渲染为 `div`，不带角色，屏幕阅读器按普通内容朗读。
- 整张卡片可点击时必须替换为 `button` 或链接。不应为 `div` 绑定点击事件，那样键盘无法触达，屏幕阅读器也无法识别其为控件。
- 卡片内的标题使用 `Heading`，并选择恰当的 `level`，使其衔接页面已有的标题层级。

## API {#api}

### Props {#props}

| 属性       | 类型      | 默认值  | 说明                                     |
| ---------- | --------- | ------- | ---------------------------------------- |
| `padded`   | `boolean` | `true`  | 是否带内边距，取值随密度变化             |
| `as`       | `string`  | `'div'` | 渲染的标签                               |
| `as-child` | `boolean` | `false` | 不渲染自身标签，把样式合并到唯一的子元素 |
| `class`    | `string`  | —       | 追加至根元素的类名                       |

### Slots {#slots}

| 插槽      | 说明       |
| --------- | ---------- |
| `default` | 卡片的内容 |
