---
title: Ripple
description: 从按下位置扩散的涟漪反馈。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/ripple/Ripple.vue
---

<Demo name="ripple/hero" />

## 用法 {#usage}

```ts
import { Ripple } from '@hina-ui/vue'
```

`Ripple` 放进需要按压反馈的元素内部，涟漪从手指或指针的落点扩散开。`Button` 一类的控件已经内置，只有自制的可按压区域才需要手动加。

宿主元素有三个要求：建立定位与层叠上下文（`relative isolate`）、裁切溢出（`overflow-hidden`），以及自身就是响应按压的那一层——组件把指针监听挂在父元素上。涟漪会继承宿主的圆角，不需要重复设置。

<Demo name="ripple/disabled" />

## 行为 {#behavior}

- 涟漪从落点开始扩散，尺寸按宿主对角线计算，因此大小面板都能铺满。
- 按下时间过短时仍会播完最短时长，避免快速点击只看到一闪。
- 触摸操作有一小段延迟才起效，用于区分点击与滑动，滑动时不出现涟漪。
- 指针在按下后移出宿主范围会取消，回到范围内可继续。
- 系统开启减弱动态效果时不播放扩散。
- 强制颜色模式下整体不渲染。

## 无障碍 {#a11y}

- 组件带 `aria-hidden`，是纯装饰，不进入无障碍树。
- 它不提供任何语义或交互，宿主自身必须是可聚焦、可操作的元素，键盘用户的反馈由焦点环与状态层承担。

## API {#api}

### Props {#props}

| 属性       | 类型      | 默认值  | 说明         |
| ---------- | --------- | ------- | ------------ |
| `disabled` | `boolean` | `false` | 是否停用涟漪 |
