import assert from 'node:assert/strict'
import test from 'node:test'
import { listDocs } from '../lib/content.ts'
import { rawMarkdown } from '../lib/raw.ts'

interface Check {
  rule: string
  pattern: RegExp
}

const CHECKS: Check[] = [
  { rule: 'vue fence', pattern: /^\s*```vue\b/ },
  { rule: 'script setup', pattern: /<script\s+setup\b/ },
  { rule: 'template slot', pattern: /<template\b[^>]*(?:#|v-slot)|\bv-slot\b/ },
  { rule: 'slot shorthand', pattern: /`#[a-z][\w-]*(?:\([^`]*\)|="[^`]*")?`|\s#[a-z][\w-]*="/ },
  {
    rule: 'directive',
    pattern: /\bv-(?:if|else-if|else|for|show|model|html|bind|on|slot|tooltip)\b/,
  },
  { rule: 'bound attribute', pattern: /`:[\w-]+="|\s:[a-z][\w-]*="/ },
  {
    rule: 'event attribute',
    pattern:
      /`@(?!(?:import|source|theme|apply|layer|utility|variant|custom-variant|plugin|config|reference|media|supports|container|keyframes|font-face)`)[\w:.-]+`|\s@[a-z][\w:-]*="/,
  },
  { rule: 'vue macro', pattern: /\bdefine(?:Expose|Props|Emits|Model|Slots)\b/ },
  { rule: 'slot', pattern: /插槽|\bslot(?:s|ted)?\b/i },
  { rule: 'emit', pattern: /\bemit(?:s|ted|ting)?\b/i },
  { rule: 'template ref', pattern: /模板引用|\btemplate refs?\b/i },
  { rule: 'two-way binding', pattern: /双向绑定|\btwo-way\b/i },
  { rule: 'nuxt', pattern: /nuxt/i },
  { rule: 'vue', pattern: /\bVue\b|['"]vue['"]|\bvue-/ },
  { rule: 'vue package', pattern: /@hina-ui\/vue/ },
  { rule: 'reka', pattern: /reka/i },
]

interface Allowed {
  page: string
  rule: string
  text?: string
  reason: string
}

const PARITY = 'Text inside a demo, which mirrors the Vue demo so both render the same markup'

const ALLOWED: Allowed[] = [
  {
    page: 'changelog',
    rule: '*',
    reason: 'The changelog reproduces the @hina-ui/vue release notes under a React notice',
  },
  {
    page: 'zh-CN/components/app-shell',
    rule: 'slot',
    text: '主区域的内容放在默认插槽里',
    reason: PARITY,
  },
  {
    page: 'en/components/app-shell',
    rule: 'slot',
    text: 'Main content goes in the default slot',
    reason: PARITY,
  },
  {
    page: 'components/autocomplete',
    rule: 'vue',
    text: "const candidates = ['Vue', 'React'",
    reason: 'Demo data: framework names offered as completions',
  },
  { page: 'zh-CN/components/card', rule: 'slot', text: '内容置于默认插槽中', reason: PARITY },
  {
    page: 'en/components/card',
    rule: 'slot',
    text: 'straight into the default slot',
    reason: PARITY,
  },
  {
    page: 'components/code-block',
    rule: 'nuxt',
    text: 'defineNuxtConfig',
    reason: 'Demo data: a sample config file shown as highlighted code',
  },
  {
    page: 'components/code-block',
    rule: 'nuxt',
    text: 'label="nuxt.config.ts"',
    reason: 'Demo data: a sample config file shown as highlighted code',
  },
  {
    page: 'zh-CN/components/dialog',
    rule: 'slot',
    text: '图标与标题内容分别由插槽提供',
    reason: PARITY,
  },
  {
    page: 'en/components/dialog',
    rule: 'slot',
    text: 'provided through separate slots',
    reason: PARITY,
  },
  { page: 'zh-CN/components/dialog', rule: 'slot', text: '标题插槽', reason: PARITY },
  { page: 'en/components/dialog', rule: 'slot', text: 'Title slots', reason: PARITY },
  {
    page: 'zh-CN/components/dialog',
    rule: 'slot',
    text: '省略默认插槽时不渲染触发器',
    reason: PARITY,
  },
  {
    page: 'en/components/dialog',
    rule: 'slot',
    text: 'Leaving out the default slot',
    reason: PARITY,
  },
  { page: 'zh-CN/components/drawer', rule: 'slot', text: '标题插槽', reason: PARITY },
  { page: 'en/components/drawer', rule: 'slot', text: 'title slot combines text', reason: PARITY },
  { page: 'en/components/drawer', rule: 'slot', text: 'Title slots', reason: PARITY },
  { page: 'zh-CN/components/drawer', rule: 'slot', text: '均由插槽提供', reason: PARITY },
  {
    page: 'en/components/drawer',
    rule: 'slot',
    text: 'The slot provides the header',
    reason: PARITY,
  },
  {
    page: 'zh-CN/components/drawer',
    rule: 'slot',
    text: '省略默认插槽时不渲染触发器',
    reason: PARITY,
  },
  {
    page: 'en/components/drawer',
    rule: 'slot',
    text: 'Leaving out the default slot',
    reason: PARITY,
  },
  { page: 'zh-CN/components/sheet', rule: 'slot', text: '标题插槽', reason: PARITY },
  { page: 'en/components/sheet', rule: 'slot', text: 'title slot combines text', reason: PARITY },
  { page: 'en/components/sheet', rule: 'slot', text: 'Title slots', reason: PARITY },
  { page: 'zh-CN/components/sheet', rule: 'slot', text: '均由插槽提供', reason: PARITY },
  {
    page: 'en/components/sheet',
    rule: 'slot',
    text: 'The slot provides the header',
    reason: PARITY,
  },
  { page: 'components/hover-card', rule: 'reka', text: 'Reka UI', reason: PARITY },
  { page: 'zh-CN/components/hover-card', rule: 'vue', text: 'Vue 组件基础', reason: PARITY },
  { page: 'en/components/hover-card', rule: 'vue', text: 'set of Vue primitives', reason: PARITY },
  {
    page: 'zh-CN/components/navigation-menu',
    rule: 'slot',
    text: '内容区域由插槽自由组合',
    reason: PARITY,
  },
  {
    page: 'en/components/navigation-menu',
    rule: 'slot',
    text: 'Compose the content through its slot',
    reason: PARITY,
  },
  { page: 'zh-CN/components/pagination', rule: 'slot', text: '列表插槽始终保留', reason: PARITY },
  {
    page: 'en/components/pagination',
    rule: 'slot',
    text: 'The list slot remains mounted',
    reason: PARITY,
  },
  { page: 'zh-CN/components/popover', rule: 'slot', text: '默认插槽为空', reason: PARITY },
  {
    page: 'en/components/popover',
    rule: 'slot',
    text: 'The default slot is empty',
    reason: PARITY,
  },
  {
    page: 'zh-CN/components/sidebar',
    rule: 'slot',
    text: '侧栏条目放在默认插槽里',
    reason: PARITY,
  },
  {
    page: 'en/components/sidebar',
    rule: 'slot',
    text: 'Sidebar entries go in the default slot',
    reason: PARITY,
  },
  { page: 'zh-CN/components/sidebar', rule: 'slot', text: '品牌插槽', reason: PARITY },
  { page: 'en/components/sidebar', rule: 'slot', text: 'Brand slots', reason: PARITY },
  {
    page: 'zh-CN/components/timeline',
    rule: 'slot',
    text: '通过插槽读取条目上的自定义字段',
    reason: PARITY,
  },
  {
    page: 'en/components/timeline',
    rule: 'slot',
    text: 'Slots retain access to custom fields',
    reason: PARITY,
  },
  {
    page: 'en/components/date-range-field',
    rule: 'slot',
    text: 'aria-label="Stream slot"',
    reason: 'English "time slot" in a demo label, not a Vue slot',
  },
  {
    page: 'en/components/time-field',
    rule: 'slot',
    text: 'aria-label="Booking slot"',
    reason: 'English "time slot" in a demo label, not a Vue slot',
  },
]

function matches(entry: Allowed, locale: string, path: string) {
  return entry.page === path || entry.page === `${locale}/${path}`
}

function allowed(locale: string, path: string, rule: string, line: string) {
  return ALLOWED.find(
    entry =>
      matches(entry, locale, path) &&
      (entry.rule === '*' || entry.rule === rule) &&
      (entry.text === undefined || line.includes(entry.text)),
  )
}

test('React-rendered Markdown carries no Vue vocabulary', async () => {
  const used = new Set<Allowed>()
  const found: string[] = []
  for (const { locale, path } of await listDocs()) {
    const markdown = (await rawMarkdown(locale, path)) ?? ''
    for (const [index, line] of markdown.split('\n').entries())
      for (const { rule, pattern } of CHECKS) {
        if (!pattern.test(line)) continue
        const entry = allowed(locale, path, rule, line)
        if (entry) used.add(entry)
        else found.push(`${locale}/${path}:${index + 1} [${rule}] ${line.trim().slice(0, 160)}`)
      }
  }
  assert.deepEqual(found, [])
  assert.deepEqual(
    ALLOWED.filter(entry => !used.has(entry)).map(
      entry => `${entry.page} [${entry.rule}] ${entry.text ?? ''}`,
    ),
    [],
  )
})
