---
title: NavigationMenu
description: 可组合链接和下拉内容面板的导航菜单。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/navigation-menu/NavigationMenu.vue
  - label: Reka Navigation Menu
    href: https://reka-ui.com/docs/components/navigation-menu
---

<Demo name="navigation-menu/hero" />

## 用法 {#usage}

```ts
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@hina-ui/vue'
```

`NavigationMenu` 提供导航地标、列表和共享内容视口。每个顶层条目用 `NavigationMenuItem` 包裹，内部可以是一个 `NavigationMenuLink`，也可以是成对的 `NavigationMenuTrigger` 和 `NavigationMenuContent`。通过 `label` 或 `aria-labelledby` 命名导航。

`active` 标记当前页面，并生成 `aria-current="page"`。展开项与当前页面是独立的状态。

<Demo name="navigation-menu/basic" />

## 示例 {#examples}

### 点击与受控状态 {#controlled}

默认支持鼠标悬停及点击展开。`trigger="click"` 关闭悬停触发，移开鼠标也不会关闭面板。`v-model` 绑定展开项的 `value`，空字符串表示全部关闭；受控使用时为各面板条目指定稳定且唯一的 `value`。

选择链接后默认关闭面板，`@select.prevent` 可以阻止关闭，链接本身的跳转不受影响。阻止跳转请使用 `@click.prevent`。

<Demo name="navigation-menu/controlled" />

### 自定义内容 {#content}

`NavigationMenuContent` 的默认插槽可以放置任意内容，通过 `class` 控制宽度与布局。默认有内边距，`:padded="false"` 可关闭。

`NavigationMenuLink` 提供 `icon`、`description` 和 `trailing` 插槽。下面组合了 [Text](/components/text)、[Divider](/components/divider) 和 [Tag](/components/tag)。面板中的导航链接也应使用 `NavigationMenuLink`，以保留键盘导航与选择后关闭的行为。

<Demo name="navigation-menu/content" />

### 纵向 {#vertical}

`orientation="vertical"` 纵向排列导航项，内容面板默认从行末侧展开。空间不足时会使用另一侧并限制内容宽度。`align` 控制面板与触发器的对齐。

<Demo name="navigation-menu/vertical" />

### 尺寸 {#sizes}

`size` 统一控制链接、触发器和图标的尺寸，支持 `sm`、`md`、`lg`，并跟随全局密度。图标尺寸分别为 14、16、18px。

<Demo name="navigation-menu/sizes" />

### 状态 {#states}

触发器和链接都支持 `disabled`。禁用项无法激活，方向键导航会跳过它们。

<Demo name="navigation-menu/states" />

### 路由链接 {#routing}

`NavigationMenuLink` 的 `as-child` 将属性和交互传给唯一的子元素，可承接 `RouterLink` 或 `NuxtLink`；也可以通过 `as` 指定组件。`active` 由调用方根据路由状态设置。

<Demo name="navigation-menu/routing" />

### RTL {#rtl}

方向默认继承外层 `dir` 或 Reka 的全局配置，也可显式设置 `dir="rtl"`。排列、对齐、箭头和键盘方向一起切换。

<Demo name="navigation-menu/rtl" />

## 行为 {#behavior}

- 同一导航中同时展开一个面板，切换时共享视口平滑调整宽高，面板按切换方向过渡。
- 内容在导航元素内渲染，浮在正常文档流上方。父级需允许溢出显示，避免用 `overflow: hidden` 裁掉面板。
- 面板宽度与横向定位会考虑浏览器及滚动、裁切容器的边界；纵向仍需预留展开空间。内容特别长时，可在面板内组合 [ScrollArea](/components/scroll-area)。
- 离开导航和内容后延迟关闭；关闭动画期间面板停止接收指针事件。
- 点击外部、焦点移出导航或按 `Esc` 关闭面板。`:unmount-on-hide="false"` 保留隐藏内容中的组件状态。
- 导航使用 `nav`、`ul`、`li` 和链接语义。需要菜单命令时使用 [Menubar](/components/menubar) 或 [DropdownMenu](/components/dropdown-menu)。

## 无障碍 {#a11y}

| 按键                             | 行为                                                   |
| -------------------------------- | ------------------------------------------------------ |
| `Tab` / `Shift+Tab`              | 按顺序访问导航及展开的内容                             |
| `Enter` / `Space`                | 展开或收起触发器                                       |
| 横向 `←` / `→`，纵向 `↑` / `↓`   | 在顶层条目之间移动焦点，跳过禁用项；RTL 下横向方向反转 |
| `Home` / `End`                   | 聚焦第一个或最后一个可用的顶层条目                     |
| 横向 `↓`，纵向 `→`（RTL 为 `←`） | 从已展开的触发器进入内容                               |
| `Esc`                            | 关闭内容并将焦点还给触发器                             |

## API {#api}

### NavigationMenu {#root-api}

| 属性                | 类型                           | 默认值         | 说明                                         |
| ------------------- | ------------------------------ | -------------- | -------------------------------------------- |
| `modelValue`        | `string`                       | `''`           | 展开项的值，空字符串为关闭                   |
| `label`             | `string`                       | —              | 导航的可访问名称                             |
| `orientation`       | `'horizontal' \| 'vertical'`   | `'horizontal'` | 排列方向                                     |
| `dir`               | `'ltr' \| 'rtl'`               | 继承           | 阅读方向                                     |
| `size`              | `'sm' \| 'md' \| 'lg'`         | `'md'`         | 控件尺寸                                     |
| `trigger`           | `'hover' \| 'click'`           | `'hover'`      | 悬停及点击，或仅点击                         |
| `delayDuration`     | `number`                       | `200`          | 首次悬停展开的等待时间，毫秒                 |
| `skipDelayDuration` | `number`                       | `300`          | 关闭后再次进入时跳过首次等待的时间窗口，毫秒 |
| `align`             | `'start' \| 'center' \| 'end'` | `'center'`     | 面板与触发器对齐                             |
| `unmountOnHide`     | `boolean`                      | `true`         | 隐藏后卸载内容                               |
| `class`             | `string`                       | —              | 导航根节点类名                               |
| `listClass`         | `string`                       | —              | 列表类名                                     |
| `viewportClass`     | `string`                       | —              | 共享内容视口类名                             |

事件 `update:modelValue(value: string)` 返回展开项。默认插槽参数为 `{ value: string }`。

### NavigationMenuItem {#item-api}

`value?: string` 关联展开状态；省略时自动生成。默认插槽放链接或触发器与内容面板。

### NavigationMenuTrigger {#trigger-api}

| 属性       | 类型      | 默认值  | 说明       |
| ---------- | --------- | ------- | ---------- |
| `disabled` | `boolean` | `false` | 禁用触发器 |
| `class`    | `string`  | —       | 触发器类名 |

默认插槽是名称，`icon` 放前缀图标，`trailing` 可替换默认的 [DisclosureIcon](/components/disclosure-icon)。箭头随展开状态旋转，纵向排列时指向行末侧。渲染为 `type="button"`，不会触发表单提交。

### NavigationMenuContent {#content-api}

| 属性     | 类型      | 默认值 | 说明                       |
| -------- | --------- | ------ | -------------------------- |
| `padded` | `boolean` | `true` | 是否保留内边距             |
| `class`  | `string`  | —      | 内容类名，可控制宽度和布局 |

默认插槽是内容。透传 `escapeKeyDown`、`pointerDownOutside`、`focusOutside`、`interactOutside`、`dismiss` 事件；可在相应事件上调用 `preventDefault()` 阻止默认关闭。

### NavigationMenuLink {#link-api}

| 属性          | 类型                  | 默认值  | 说明                       |
| ------------- | --------------------- | ------- | -------------------------- |
| `as`          | `string \| Component` | `'a'`   | 渲染标签或路由组件         |
| `asChild`     | `boolean`             | `false` | 将属性和行为交给唯一子元素 |
| `active`      | `boolean`             | `false` | 当前页面                   |
| `disabled`    | `boolean`             | `false` | 禁用链接                   |
| `description` | `string`              | —       | 名称下方说明               |
| `class`       | `string`              | —       | 链接类名                   |

`href`、`target`、`rel`、路由参数及其他未声明属性传给链接。事件 `select(event)` 可以阻止面板关闭。

| 插槽          | 说明                            |
| ------------- | ------------------------------- |
| `default`     | 名称；`as-child` 时为唯一子元素 |
| `icon`        | 前缀图标                        |
| `description` | 替换说明文字                    |
| `trailing`    | 尾部附加内容                    |

`as-child` 时，内容布局由子元素负责，其余内容插槽不渲染。
