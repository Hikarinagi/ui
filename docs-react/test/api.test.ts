import assert from 'node:assert/strict'
import test from 'node:test'
import MarkdownIt from 'markdown-it'
import { adaptForReact, pageApi, reactInline, reactProse, reactSource } from '../lib/api.ts'

const zh = `---
title: Dialog
description: 默认插槽是触发器。
---

默认插槽是触发器，\`footer\` 插槽是操作按钮，\`icon\` 和 \`title\` 插槽显示标题。关闭时触发 \`close\` 事件，选择后发出 \`update:open\`。

通过模板引用调用 \`focus\`。\`open\` 支持双向绑定，内容放在默认插槽中。

### 页眉 {#slots}

### 插槽 {#slots}

| 插槽     | 参数        | 说明   |
| -------- | ----------- | ------ |
| default  | —           | 触发器 |
| \`footer\` | \`{ close }\` | 页脚   |
| \`title\`  | —           | 标题   |
| \`icon\`   | —           | 图标   |

### 事件 {#events}

| 事件          | 参数      | 说明 |
| ------------- | --------- | ---- |
| \`close\`       | —         | 关闭 |
| \`update:open\` | \`boolean\` | 开合 |
`

const en = `The default slot is the trigger, the \`footer\` slot holds the actions, and the \`icon\` and \`title\` slots fill the header. Closing emits \`close\`, and \`update:open\` is emitted with the state. Call \`focus\` through a template ref. Reka's global direction configuration is inherited.

| Slot     | Description |
| -------- | ----------- |
| \`footer\` | Actions     |
`

test('prose about slots and events uses the names of the API tables', () => {
  const source = reactSource(zh, 'zh-CN', 'components/dialog')
  assert.match(source, /description: `children` 是触发器。/)
  assert.match(
    source,
    /`children` 是触发器，`renderFooter` 属性是操作按钮，`icon` 和 `titleContent` 属性显示标题。关闭时调用 `onClose`，选择后调用 `onOpenChange`。/,
  )
  assert.match(source, /通过 ref 调用 `focus`。`open` 可受控，内容放在 `children` 中。/)
  assert.match(source, /### 页眉 \{#slots\}/)
  assert.match(source, /### 内容属性 \{#slots\}/)
  assert.match(source, /### 回调 \{#events\}/)
  assert.match(source, /\| `children`\s+\|/)
})

test('English prose maps slots, emits and Reka configuration', () => {
  const api = pageApi(
    `${en}\n| Event | Payload | Description |\n| - | - | - |\n| \`close\` | — | Closed |\n`,
  )
  const prose = reactProse(en, 'en', api)
  assert.match(
    prose,
    /^`children` is the trigger, the `footer` prop holds the actions, and the `icon` and `title` props fill the header\. Closing calls `onClose`, and `onOpenChange` is called with the state\. Call `focus` through a ref\. the global direction from `ConfigProvider` is inherited\./,
  )
})

test('API tables map names by their own params column', () => {
  const md = new MarkdownIt()
  const source = reactSource(zh, 'zh-CN', 'components/dialog')
  const tokens = adaptForReact(md.parse(source, {}), 'zh-CN', pageApi(source, 'dialog'))
  const names = tokens
    .filter(token => token.type === 'inline')
    .flatMap(token => token.children ?? [])
    .filter(child => child.type === 'code_inline')
    .map(child => child.content)
  for (const name of [
    'children',
    'renderFooter',
    'titleContent',
    'icon',
    'onClose',
    'onOpenChange',
  ])
    assert.ok(names.includes(name), name)
  const twoColumns = pageApi(en)
  assert.equal(twoColumns.slots.get('footer'), 'footer')
})

test('code spans convert template syntax and keep unrelated code', () => {
  const api = pageApi('| 属性 | 说明 |\n| - | - |\n| `getKey` | 键 |\n| `pageSize` | 条数 |\n')
  assert.equal(reactInline(':padded="false"', api), 'padded={false}')
  assert.equal(reactInline(':max="10" :stars="5"', api), 'max={10} stars={5}')
  assert.equal(reactInline('description-placement="label"', api), 'descriptionPlacement="label"')
  assert.equal(reactInline('get-key', api), 'getKey')
  assert.equal(reactInline('v-model:page-size', api), 'pageSize / onPageSizeChange')
  assert.equal(reactInline('@click', api), 'onClick')
  assert.equal(reactInline('#icon', api), 'icon')
  assert.equal(reactInline('class', api), 'className')
  assert.equal(reactInline('@source', api), '@source')
  assert.equal(reactInline('#39c5bb', api), '#39c5bb')
  assert.equal(reactInline('aria-label="关闭"', api), 'aria-label="关闭"')
  assert.equal(reactInline('size-5', api), 'size-5')
})

test('React blocks replace Vue blocks before the rules run', () => {
  const source = reactSource(
    '::: vue\n\n```vue\n<Dialog v-model:open="open" />\n```\n\n:::\n\n::: react\n\n```tsx\n<Dialog open={open} onOpenChange={setOpen} />\n```\n\n:::\n',
    'en',
    'components/dialog',
  )
  assert.equal(source, '```tsx\n<Dialog open={open} onOpenChange={setOpen} />\n```\n')
})
