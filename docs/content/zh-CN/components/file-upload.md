---
title: FileUpload
description: 点击或者拖放选择文件。
links:
  - label: 源码
    href: https://github.com/Hikarinagi/ui/blob/main/packages/vue/src/components/file-upload/FileUpload.vue
---

<Demo name="file-upload/hero" />

## 用法 {#usage}

```ts
import { FileUpload } from '@hina-ui/vue'
```

文件上传由一块拖放区与已选文件的列表组成：点击拖放区打开系统的文件选择框，把文件拖到区内放下同样可以选择。`v-model` 绑定选中的文件，单选时是一个 `File` 或者 `null`，`multiple` 时是 `File` 数组。组件只负责选择与展示，不发起上传，上传由调用方在拿到文件后自行处理。未声明的属性都会传给拖放区，请用 `aria-label` 或者 `aria-labelledby` 命名。

<Demo name="file-upload/basic" />

## 示例 {#examples}

### 多选 {#multiple}

`multiple` 允许一次选择多个文件，再次选择时追加到列表，重复的文件只保留一份。

<Demo name="file-upload/multiple" />

### 类型、大小与数量限制 {#limits}

`accept` 与原生的同名属性一致，可以写后缀或者 MIME 类型；`maxSize` 以字节限制单个文件的大小；`maxFiles` 限制多选时的文件数量。不符合的文件不会进入列表，而是通过 `reject` 事件交出，参数带有每个文件被拒绝的原因。

<Demo name="file-upload/limits" />

### 按钮形态 {#button}

`variant="button"` 把拖放区换成一颗按钮，适合放在表单行里。

<Demo name="file-upload/button" />

### 即选即传 {#immediate}

有些场景拿到文件就交给上传流程，结果由别处的界面呈现，例如图片库里的上传格。这时把 `list` 设为 `false` 只保留拖放区，在值变化时取走文件并清空。

<Demo name="file-upload/immediate" />

### 状态 {#states}

`invalid` 给拖放区加上警示色，`disabled` 禁用选择与移除，`loading` 在上传期间把图标换成加载指示并禁用选择。`icon` 插槽替换拖放区或者按钮里的图标；根元素被撑成固定尺寸时，拖放区随之填满。

<Demo name="file-upload/states" />

### 在表单中 {#form}

放进 [FormField](/components/form-field) 后，标签指向拖放区，说明与错误信息由字段渲染；校验规则与提交交给 [Form](/components/form)。值是 `File` 对象，大小、类型这类规则可以直接写在校验里。

<Demo name="file-upload/form" />

## 行为 {#behavior}

- 点击拖放区或者按钮打开系统的文件选择框；把文件拖到拖放区上时边框换成强调色，放下即选择。
- 单选时新选择的文件替换原来的；多选时追加，超过 `maxFiles` 的部分被拒绝。
- 列表里每个文件显示名称与可读的大小，图片显示缩略图；点击移除按钮从列表中删掉该文件。
- 默认插槽替换拖放区或者按钮里的文字。

## 无障碍 {#a11y}

- 拖放区是一枚按钮，可以用键盘触达，Enter 或者空格打开文件选择框；隐藏的文件输入对辅助技术不可见。
- 每个文件的移除按钮带有语言包给出的名称，包含文件名。
- 通过 `aria-label` 或者 `aria-labelledby` 为拖放区命名。

## API {#api}

### Props {#props}

| 属性         | 类型                     | 默认值   | 说明                            |
| ------------ | ------------------------ | -------- | ------------------------------- |
| `modelValue` | `File \| File[] \| null` | `null`   | 选中的文件，`multiple` 时是数组 |
| `multiple`   | `boolean`                | `false`  | 是否允许多选                    |
| `accept`     | `string`                 | —        | 接受的类型，与原生属性一致      |
| `maxSize`    | `number`                 | —        | 单个文件的大小上限，单位字节    |
| `maxFiles`   | `number`                 | —        | 多选时的数量上限                |
| `variant`    | `'area' \| 'button'`     | `'area'` | 形态                            |
| `list`       | `boolean`                | `true`   | 是否列出选中的文件              |
| `preview`    | `boolean`                | `true`   | 是否为图片显示缩略图            |
| `name`       | `string`                 | —        | 表单字段名                      |
| `loading`    | `boolean`                | `false`  | 是否显示加载指示并禁用选择      |
| `disabled`   | `boolean`                | `false`  | 是否禁用                        |
| `invalid`    | `boolean`                | `false`  | 是否处于校验未通过状态          |
| `class`      | `string`                 | —        | 追加至根元素的类名              |

### 插槽 {#slots}

| 插槽    | 说明                   |
| ------- | ---------------------- |
| default | 拖放区或者按钮里的文字 |
| `icon`  | 拖放区或者按钮里的图标 |

### 事件 {#events}

| 事件                | 参数                                | 说明                                    |
| ------------------- | ----------------------------------- | --------------------------------------- |
| `update:modelValue` | `value: File \| File[] \| null`     | 选中的文件变化                          |
| `reject`            | `rejections: FileUploadRejection[]` | 有文件被拒绝，每项带 `file` 与 `reason` |

`FileUploadRejection` 的 `reason` 是 `'type'`、`'size'` 或者 `'count'`，类型可以从包入口导入。
