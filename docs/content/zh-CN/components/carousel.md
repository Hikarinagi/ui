---
title: Carousel
description: 通过拖拽、键盘和导航控件浏览一组相关内容。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/carousel/Carousel.vue
---

<Demo name="carousel/hero" />

## 用法 {#usage}

```ts
import { Carousel } from '@hina-ui/vue'
```

传入 `items`、稳定的 `getKey`，用默认插槽渲染每一项。卡片和图片的外观由调用方决定。

```vue
<Carousel v-model:index="index" :items="works" :get-key="work => work.id" indicators>
  <template #default="{ item }">
    <Image :src="item.cover" :alt="item.title" :ratio="16 / 9" :draggable="false" />
  </template>
</Carousel>
```

`index` 表示从零开始的**停靠位置**，不一定等于数据下标。一屏一项时两者相同；多卡片、分组翻页或部分露出的布局可能产生更少的停靠点。`snapCount` 和导航方法都对应测量后的停靠列表；`visibleItems` 才是当前可见的数据下标。

## 示例 {#examples}

### 不等宽卡片与动态分组 {#grouped}

示例混排竖版、方形和横版封面，按原图比例计算各张卡片的宽度，用 `item-class="basis-auto"` 让项目跟随内容尺寸。宽图在窄容器内最多占满一屏，不超出视口。

`slides-to-scroll="auto"` 根据容器和每张卡片的实际宽度分组，每组不固定张数。拖动滑块可连续调整容器宽度，停靠点数量和前后导航会随尺寸变化重新计算；不需要业务方监听宽度或手动调用 `refresh()`。卡片自身尺寸改变也会触发重算。

`controls` 插槽替换整个默认控制区，提供当前状态和导航方法。默认插槽提供原始数据、数据下标、是否可见和是否完成初始化。切换 RTL 后，拖拽方向和键盘方向一起改变。

<Demo name="carousel/grouped" />

### 自定义指示器 {#indicators}

默认指示器使用胶囊样式突出当前项，各项的点击区域保持固定，切换不会推动左右按钮。过渡使用 Hina 动效 token，并尊重减少动态效果的系统偏好。

- `#indicator="{ index, active, snapCount }"` 只替换单项外观，可以放缩略图、数字或自定义图形。按钮、点击切换、键盘焦点和无障碍名称由 Carousel 保留；不要在里面嵌套按钮或链接。
- `#indicators` 替换整条指示器，保留两侧导航按钮。它提供 `CarouselControls` 的完整状态和方法，以及用于 `aria-controls` 的 `viewportId`，可以做进度条、计数器或自定义跳转控件。
- 提供任一指示器插槽就会显示该区域，不必额外设置 `indicators`。`#controls` 仍可替换整个导航区，优先于这两个插槽。

下面可以切换默认、缩略图和进度条三种外观，切换指示器不重置轮播。示例一屏一项，因此缩略图可直接按 `index` 取数据；分组场景的 `index` 仍是停靠位置，不能当作数据下标。

<Demo name="carousel/indicators" />

### 纵向内容 {#vertical}

纵向视口需要明确的高度。下面每屏在 288px 内显示两项。项目尺寸仍由 CSS 控制，改变方向不会改变内容顺序。

<Demo name="carousel/vertical" />

### 按需自动播放 {#autoplay}

默认不自动播放。启用后，开始／暂停按钮出现在内容前方，也是轮播内的第一个键盘停靠点。

- 鼠标悬停、离开页面可视区或浏览器标签页隐藏时暂时暂停。
- 焦点进入、拖拽或手动导航后停止，只有显式点击开始才会恢复。
- 系统偏好减少动态效果时不自动启动；仍可手动开始，此时切换不播放位移动画。
- 非循环轮播到末尾停止，再次开始会返回第一项；内容数量足够时，可用 `loop` 连续循环。

<Demo name="carousel/autoplay" />

### 初始位置与 SSR {#initial-index}

默认一屏一项、每次前进一项时，SSR 直接渲染完整的指示点、当前高亮和前后导航状态。初始 `index` 通过 CSS 百分比定位，包含间距，并支持 RTL、纵向和循环模式；不需要先显示第一项再等客户端纠正。卡片尺寸由 CSS 决定，图片用 `ratio` 预留空间。

下面的初始下标为 `2`，服务端 HTML 就显示第三项、五个指示点和第三个高亮。水合保留原有内容和指示点节点，仅接管交互。普通模式不需要 `pending` 插槽。

<Demo name="carousel/initial-index" />

`itemClass` 可改变项目尺寸，组件不会解析类名推断宽高；此类自定义布局、分组跨项翻页的停靠位置由客户端测量。只修改卡片外观时，把样式放在默认插槽内即可保留默认布局的 SSR 定位。确实需要遮住自定义布局测量阶段时仍可提供 `#pending`，并让占位尺寸匹配内容。它不表示接口加载：空数组显示 `#empty`，数据请求由外层管理。

## 行为与自定义 {#behavior}

- 默认插槽可放图片、链接、表单和任意组合内容。高度由内容决定，不强制比例，也不添加自动高度过渡。
- `align="center"` 居中停靠。边缘约束会优先消除空白，必要时覆盖对齐；设计上需要首尾留白时设置 `:contain-scroll="false"`。
- `drag-free` 允许拖拽后停在两个停靠点之间，模型仍对应最近选中的停靠点。
- 图片内容请设置 `:draggable="false"`，避免触发浏览器自带的图片拖拽。
- 视口接受与方向一致的方向键和 Home / End；内部输入框、链接、按钮保留自己的键盘行为。点击导航按钮不会将焦点移入内容。
- 可见范围确定后，屏外项目会变为 inert。项目名称和位置播报支持本地化；自动播放期间不逐项播报。
- 根节点提供 `data-ready`、`data-orientation`；项目容器提供 `data-visible`。自定义 class 合并在默认样式之后。
- 手势运动使用 Hina 动效档位，并尊重减少动态效果的系统偏好；自动播放间隔与运动时间分开。

## API {#api}

### Props {#props}

| 属性             | 类型                                                          | 默认值                 | 说明                                    |
| ---------------- | ------------------------------------------------------------- | ---------------------- | --------------------------------------- |
| `items`          | `readonly T[]`                                                | —                      | 内容数据，保持稳定的 key                |
| `getKey`         | `(item: T, index: number) => string \| number`                | —                      | 必填，返回唯一 key                      |
| `v-model:index`  | `number`                                                      | 0                      | 从零开始的停靠位置                      |
| `label`          | `string`                                                      | 本地化文案 / localized | 轮播区域的无障碍名称                    |
| `dir`            | `'ltr' \| 'rtl'`                                              | 继承 / inherited       | 布局与键盘方向                          |
| `orientation`    | `'horizontal' \| 'vertical'`                                  | 'horizontal'           | 纵向时须为 viewport 设置高度            |
| `align`          | `'start' \| 'center' \| 'end'`                                | 'start'                | 卡片与视口的对齐方式                    |
| `containScroll`  | `false \| 'trimSnaps' \| 'keepSnaps'`                         | 'trimSnaps'            | 去掉边缘空白；trimSnaps 合并重复停靠点  |
| `slidesToScroll` | `number \| 'auto'`                                            | 1                      | 每次前进的项目数；auto 按视口分组       |
| `loop`           | `boolean`                                                     | false                  | 空间足够时循环；不足时退化为有限滚动    |
| `draggable`      | `boolean`                                                     | true                   | 鼠标与触摸拖拽                          |
| `dragFree`       | `boolean`                                                     | false                  | 拖拽后自由停留，不强制吸附              |
| `autoplay`       | `boolean \| number`                                           | false                  | true 为 5000ms；数字为间隔，最小 1000ms |
| `arrows`         | `boolean`                                                     | true                   | 默认前后导航按钮                        |
| `indicators`     | `boolean`                                                     | false                  | 按停靠位置显示圆点                      |
| `gap`            | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`              | 'md'                   | Hina 间距档位                           |
| `class`          | `string`                                                      | —                      | 根节点样式                              |
| `viewportClass`  | `string`                                                      | —                      | 视口样式，可设置纵向高度                |
| `itemClass`      | `string \| ((item: T, index: number) => string \| undefined)` | —                      | 项目容器样式，可按项设置尺寸            |

### Slots {#slots}

| 插槽         | 参数                     | 说明                                                                 |
| ------------ | ------------------------ | -------------------------------------------------------------------- |
| `default`    | `CarouselItemSlot<T>`    | `{ item, index, isVisible, ready }`                                  |
| `controls`   | `CarouselControls`       | 替换导航区                                                           |
| `indicators` | `CarouselIndicatorsSlot` | 替换整条指示器，保留前后导航按钮；`CarouselControls` 加 `viewportId` |
| `indicator`  | `CarouselIndicatorSlot`  | 单项外观：`{ index, active, snapCount }`，交互仍由组件负责           |
| `pending`    | —                        | 首次测量占位                                                         |
| `empty`      | —                        | 空数据内容                                                           |

### Events 与 Expose {#events}

`ready` 在非空且可测量的内容首次初始化后触发；`select` 在选中的停靠点变化时触发。两者都携带 `CarouselState`：

```ts
interface CarouselState {
  index: number
  snapCount: number
  canPrev: boolean
  canNext: boolean
  visibleItems: readonly number[]
  ready: boolean
  playing: boolean
}
```

暴露的 `state` 和 `controls` 插槽参数实时更新。`select` 可能早于动画结束；需要判断当前屏内内容时读取实时的 `visibleItems`。

`CarouselControls` 在状态上增加 `prev()`、`next()`、`scrollTo(index, instant?)`、`play()`、`pause()`。组件 ref 暴露同样的方法，以及 `state`、`element`、`viewport`、`refresh()`。正常的尺寸变化会自动重新测量；特殊外部布局变化后可调用 `refresh()` 主动刷新。

以上类型均从包根导出，内部引擎实例和专属配置不作为公共 API。
