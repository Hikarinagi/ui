---
title: SplitButton
description: 将一个常用操作与附加菜单组合在一起，两侧分别响应点击。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/split-button/SplitButton.vue
---

<Demo name="split-button/hero" />

## 用法 {#usage}

```ts
import { SplitButton, DropdownMenuItem } from '@hina-ui/vue'
```

主按钮点击触发 `click`，尾部箭头打开菜单。将附加操作放进 `#content`，通过 `DropdownMenuItem` 的 `select` 处理选择。适合“立即发布 / 保存草稿”“导出 / 选择格式”等有明确默认操作的场景。

```vue
<SplitButton menu-label="其他保存方式" @click="save">
  保存
  <template #content>
    <DropdownMenuItem @select="saveCopy">另存副本</DropdownMenuItem>
  </template>
</SplitButton>
```

如果几项操作同样常用，用 `ButtonGroup`；只有菜单而没有默认操作，用 `DropdownMenu`。菜单选择不会自动改变主按钮，是否记住所选操作由调用方决定。

## 示例 {#examples}

### 外观与色调 {#variants}

两侧共享 `variant` 和 `tone`，连接处不重复圆角。实底、浅底和无底色形态带有分隔线，描边形态共用一条边框。

<Demo name="split-button/variants" />

### 尺寸与圆角 {#sizes}

`size` 同时控制主按钮和菜单按钮的高度，`pill` 仅改变整组外侧的圆角。拼接的两侧均不使用按压缩放。

<Demo name="split-button/sizes" />

### 加载与禁用 {#states}

`loading` 会显示加载指示、禁用两侧并关闭已打开的菜单。`disabled` 禁用整组；`primary-disabled` 和 `menu-disabled` 可以单独禁用一侧，例如不能发布时仍可保存草稿。

<Demo name="split-button/states" />

### 记住所选格式 {#formats}

菜单直接使用现有的 `DropdownMenu` 子组件，支持分组、单选、勾选项和子菜单。本例由应用持有导出格式，选择后更新主按钮的文字和操作参数。

<Demo name="split-button/formats" />

### 占满宽度 {#block}

`block` 让主按钮填满剩余宽度，箭头仍保持方形；较长的默认文案会截断。`class` 与 `style` 都作用于组容器。

<Demo name="split-button/block" />

### 表单提交 {#form}

`type="submit"` 仅作用于主按钮。菜单触发器始终为 `type="button"`，打开菜单和选择菜单项都不会意外提交表单。`name`、`value`、`form` 等原生属性透传到主按钮。

本例模拟异步发布。发布经过 `Form` 校验，保存草稿由菜单单独处理，可以保留未完成的标题。

<Demo name="split-button/form" />

### 从右向左排列 {#rtl}

`dir="rtl"` 同时控制按钮顺序、连接圆角和菜单方向。菜单对齐整组按钮的逻辑末端。

<Demo name="split-button/rtl" />

### 主操作作为链接 {#link}

`as` 只改变主按钮。应用内导航传入路由组件，`to` 等属性透传到该组件；菜单触发器仍是普通按钮。

```vue
<SplitButton :as="NuxtLink" :to="localePath('/components/button')" menu-label="相关文档">
  查看 Button
  <template #content>
    <DropdownMenuItem @select="navigateTo(localePath('/components/button-group'))">
      查看 ButtonGroup
    </DropdownMenuItem>
  </template>
</SplitButton>
```

## 行为与无障碍 {#behavior}

- `Tab` 分别访问主按钮与菜单按钮。主按钮按 `Enter` 或空格执行操作，按 `ArrowDown` 打开菜单；链接形态遵循链接的键盘行为。
- 菜单按钮按 `Enter`、空格或 `ArrowDown` 打开菜单，键盘打开时聚焦首个可用项。菜单沿用 `DropdownMenu` 的方向键、首尾跳转和字符搜索。
- `Escape` 关闭菜单并将焦点返回菜单按钮。点选普通菜单项后同样关闭；需要保留菜单时在该项上使用 `@select.prevent`。
- `menu-label` 应描述附加操作，默认使用当前语言的“更多操作”。`label` 为整组提供可选的无障碍名称。
- `#icon` 和 `#trailing` 只属于主操作；菜单箭头使用 `DisclosureIcon`，随打开状态变化。

## API {#api}

### Props {#props}

| 属性              | 类型                                        | 默认值               | 说明                       |
| ----------------- | ------------------------------------------- | -------------------- | -------------------------- |
| `variant`         | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `'solid'`            | 两侧共用的外观             |
| `tone`            | `'accent' \| 'neutral' \| 'danger'`         | `'accent'`           | 两侧共用的色调             |
| `size`            | `'sm' \| 'md' \| 'lg'`                      | `'md'`               | 按钮尺寸                   |
| `block`           | `boolean`                                   | `false`              | 占满容器宽度               |
| `pill`            | `boolean`                                   | `false`              | 整组外侧使用全圆角         |
| `ripple`          | `boolean`                                   | `true`               | 启用涟漪反馈               |
| `loading`         | `boolean`                                   | `false`              | 显示加载指示并禁用两侧     |
| `disabled`        | `boolean`                                   | `false`              | 禁用两侧                   |
| `primaryDisabled` | `boolean`                                   | `false`              | 仅禁用主操作               |
| `menuDisabled`    | `boolean`                                   | `false`              | 仅禁用菜单                 |
| `as`              | `string \| Component`                       | `'button'`           | 主按钮的元素或组件         |
| `type`            | `'button' \| 'submit' \| 'reset'`           | `'button'`           | 主按钮类型                 |
| `label`           | `string`                                    | —                    | 按钮组的无障碍名称         |
| `menuLabel`       | `string`                                    | 当前语言的“更多操作” | 菜单按钮及菜单的无障碍名称 |
| `modal`           | `boolean`                                   | `true`               | 菜单打开时限制外部交互     |
| `dir`             | `'ltr' \| 'rtl'`                            | 继承                 | 按钮和菜单的书写方向       |
| `side`            | `'top' \| 'right' \| 'bottom' \| 'left'`    | `'bottom'`           | 菜单的首选方向             |
| `align`           | `'start' \| 'center' \| 'end'`              | `'end'`              | 菜单相对于整组的对齐方式   |
| `sideOffset`      | `number`                                    | `8`                  | 菜单与按钮组的间距         |
| `class`           | `string`                                    | —                    | 组容器的类名               |
| `style`           | `StyleValue`                                | —                    | 组容器的样式               |
| `menuClass`       | `string`                                    | —                    | 菜单内容的类名             |

其他属性和事件监听器（例如 `id`、`aria-label`、`href`、`to`、`keydown`）透传到主按钮。

### Models {#models}

| 模型           | 类型      | 默认值  | 说明                               |
| -------------- | --------- | ------- | ---------------------------------- |
| `v-model:open` | `boolean` | `false` | 菜单打开状态；加载或禁用菜单时关闭 |

### Events {#events}

| 事件          | 参数         | 说明                           |
| ------------- | ------------ | ------------------------------ |
| `click`       | `MouseEvent` | 主操作点击；菜单不会触发此事件 |
| `update:open` | `boolean`    | 菜单打开状态变化               |

### Slots {#slots}

| 插槽       | 参数                    | 说明                                             |
| ---------- | ----------------------- | ------------------------------------------------ |
| `default`  | —                       | 主按钮文案                                       |
| `icon`     | —                       | 主按钮前置图标                                   |
| `trailing` | —                       | 主按钮尾部内容                                   |
| `content`  | `{ close: () => void }` | 菜单内容，通常由 `DropdownMenuItem` 等子组件组成 |

### Expose {#expose}

| 方法        | 类型                  | 说明                                         |
| ----------- | --------------------- | -------------------------------------------- |
| `focus`     | `() => void`          | 聚焦可用的主按钮                             |
| `openMenu`  | `() => Promise<void>` | 聚焦菜单触发器并打开菜单；菜单不可用时无操作 |
| `closeMenu` | `() => void`          | 关闭菜单                                     |
