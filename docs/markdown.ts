import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import Markdown from 'unplugin-vue-markdown/vite'
import attrs from 'markdown-it-attrs'
import { tokenize, tokensToHtml } from '../packages/vue/src/components/code-block/highlighter'

const DEMOS_ROOT = fileURLToPath(new URL('./app/demos/', import.meta.url))

function demoDir(id: string) {
  return `${DEMOS_ROOT}${id.includes('/content/en/') ? 'en' : 'zh-CN'}/`
}
const DEMO_TAG = /<Demo\s+name="([^"]+)"\s*\/>/g

const columnWidths: Record<string, string> = {
  类型: 'min-w-48',
  Type: 'min-w-48',
  参数: 'min-w-40',
  Payload: 'min-w-40',
  Props: 'min-w-40',
  说明: 'min-w-64',
  Description: 'min-w-64',
}

interface Heading {
  id: string
  label: string
  level: number
}

interface TocItem {
  id: string
  label: string
  children?: TocItem[]
}

interface Fence {
  code: string
  lang: string
}

interface Collected {
  headings: Heading[]
  fences: Fence[]
  routed: boolean[]
  linked: boolean
  demos: string[]
}

const collected = new Map<string, Collected>()

function entry(id: string): Collected {
  let found = collected.get(id)
  if (!found) {
    found = { headings: [], fences: [], routed: [], linked: false, demos: [] }
    collected.set(id, found)
  }
  return found
}

function toc(headings: Heading[]): TocItem[] {
  const items: TocItem[] = []
  for (const heading of headings) {
    const item: TocItem = { id: heading.id, label: heading.label }
    const parent = items[items.length - 1]
    if (heading.level > 2 && parent) (parent.children ??= []).push(item)
    else items.push(item)
  }
  return items
}

function text(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
}

function attr(raw: string): string {
  return text(raw).replace(/"/g, '&quot;')
}

function literal(raw: string): string {
  return JSON.stringify(raw).replace(/<\//g, '<\\/')
}

export function markdown() {
  return Markdown({
    include: [/\.md$/],
    headEnabled: false,
    wrapperDiv: false,
    markdownUses: [[attrs, { allowedAttributes: ['id'] }]],
    markdownSetup(md) {
      md.core.ruler.push('hn-document', state => {
        const id = (state.env as { id?: string }).id
        if (!id) return true
        const found = entry(id)
        found.headings = []
        found.fences = []
        found.routed = []

        const tokens = []
        let open = false
        for (let index = 0; index < state.tokens.length; index += 1) {
          const token = state.tokens[index]!
          if (token.type !== 'heading_open') {
            tokens.push(token)
            continue
          }
          const level = Number(token.tag.slice(1))
          let anchor = token.attrGet('id')
          if (!anchor) {
            anchor = `section-${found.headings.length + 1}`
            token.attrSet('id', anchor)
          }
          const inline = state.tokens[index + 1]
          const label = (inline?.children ?? [])
            .filter(child => child.type === 'text' || child.type === 'code_inline')
            .map(child => child.content)
            .join('')
            .trim()
          if (level <= 3) found.headings.push({ id: anchor, label, level })
          if (level === 2 || level === 3) {
            if (open) tokens.push(new state.Token('hn_section_close', '', -1))
            const section = new state.Token('hn_section_open', '', 1)
            section.attrSet('id', anchor)
            tokens.push(section)
            token.attrs = null
            open = true
          }
          tokens.push(token)
        }
        if (open) tokens.push(new state.Token('hn_section_close', '', -1))
        state.tokens = tokens
        return true
      })

      const rules = md.renderer.rules

      rules.hn_section_open = (tokens, index) =>
        `<Section id="${attr(tokens[index]?.attrGet('id') ?? '')}">`
      rules.hn_section_close = () => '</Section>'

      rules.heading_open = (tokens, index) => {
        const token = tokens[index]
        if (!token) return ''
        const anchor = token.attrGet('id')
        const level = Number(token.tag.slice(1))
        const anchored = anchor ? ` id="${attr(anchor)}" class="scroll-mt-6"` : ''
        return `<Heading :level="${level}"${anchored}>`
      }
      rules.heading_close = () => '</Heading>'

      rules.paragraph_open = (tokens, index) => (tokens[index]?.hidden ? '' : '<Text tone="muted">')
      rules.paragraph_close = (tokens, index) => (tokens[index]?.hidden ? '' : '</Text>')

      rules.text = (tokens, index) => text(tokens[index]?.content ?? '')
      rules.code_inline = (tokens, index) => `<Code>${text(tokens[index]?.content ?? '')}</Code>`

      let columns: string[] = []
      let column = 0
      const cellOpen = (tag: string) => {
        const width = columnWidths[columns[column] ?? '']
        column += 1
        return width ? `<${tag}><div class="${width}">` : `<${tag}>`
      }
      const cellClose = (tag: string) =>
        columnWidths[columns[column - 1] ?? ''] ? `</div></${tag}>` : `</${tag}>`

      rules.table_open = (tokens, index) => {
        columns = []
        for (let cursor = index; cursor < tokens.length; cursor += 1) {
          const token = tokens[cursor]
          if (!token || token.type === 'thead_close') break
          if (token.type === 'th_open') columns.push(tokens[cursor + 1]?.content?.trim() ?? '')
        }
        return '<Table variant="secondary">'
      }
      rules.table_close = () => '</Table>'
      rules.thead_open = () => '<TableHeader>'
      rules.thead_close = () => '</TableHeader>'
      rules.tbody_open = () => '<TableBody>'
      rules.tbody_close = () => '</TableBody>'
      rules.tr_open = () => {
        column = 0
        return '<TableRow>'
      }
      rules.tr_close = () => '</TableRow>'
      rules.th_open = () => cellOpen('TableHead')
      rules.th_close = () => cellClose('TableHead')
      rules.td_open = () => cellOpen('TableCell')
      rules.td_close = () => cellClose('TableCell')

      rules.bullet_list_open = () => '<List>'
      rules.bullet_list_close = () => '</List>'
      rules.ordered_list_open = () => '<List ordered>'
      rules.ordered_list_close = () => '</List>'
      rules.blockquote_open = () => '<Blockquote>'
      rules.blockquote_close = () => '</Blockquote>'
      rules.hr = () => '<Divider />'

      rules.link_open = (tokens, index, _options, env) => {
        const href = tokens[index]?.attrGet('href') ?? ''
        const found = entry((env as { id: string }).id)
        const routed = href.startsWith('/')
        found.routed.push(routed)
        if (routed) {
          found.linked = true
          const id = (env as { id: string }).id
          const to = id.includes('/content/en/') ? `/en${href}` : href
          return `<Link as-child><NuxtLink to="${attr(to)}">`
        }
        return `<Link href="${attr(href)}" target="_blank" rel="noreferrer">`
      }
      rules.link_close = (_tokens, _index, _options, env) => {
        const found = entry((env as { id: string }).id)
        return found.routed.pop() ? '</NuxtLink></Link>' : '</Link>'
      }

      rules.fence = (tokens, index, _options, env) => {
        const token = tokens[index]
        if (!token) return ''
        const found = entry((env as { id: string }).id)
        const lang = token.info.trim()
        const slot = found.fences.length
        found.fences.push({ code: token.content, lang })
        return `<CodeBlock :code="__hnFence${slot}" :html="__hnPaint${slot}"${lang ? ` lang="${attr(lang)}"` : ''} />`
      }
    },
    frontmatterPreprocess(frontmatter, _options, id) {
      return {
        head: {},
        frontmatter: { ...frontmatter, toc: toc(collected.get(id)?.headings ?? []) },
      }
    },
    transforms: {
      after(html, id) {
        const found = entry(id)
        found.demos = []
        return html.replace(DEMO_TAG, (_tag, name: string) => {
          const slot = found.demos.length
          found.demos.push(name)
          return `<DemoBox :code="__hnDemoCode${slot}" :html="__hnDemoPaint${slot}"><HnDemo${slot} /></DemoBox>`
        })
      },
      async extraScripts(_frontmatter, id) {
        const demos = collected.get(id)?.demos ?? []
        const sources = await Promise.all(
          demos.map(async name => {
            try {
              return await readFile(`${demoDir(id)}${name}.vue`, 'utf8')
            } catch {
              return null
            }
          }),
        )
        const demoLines = await Promise.all(
          demos.map(async (name, slot) => {
            const source = sources[slot]
            if (source === null || source === undefined) {
              throw new Error(`示例文件不存在:${demoDir(id)}${name}.vue`)
            }
            const lines = await tokenize(source, 'vue')
            return [
              `import HnDemo${slot} from '${demoDir(id)}${name}.vue'`,
              `const __hnDemoCode${slot} = ${literal(source)}`,
              `const __hnDemoPaint${slot} = ${lines ? literal(tokensToHtml(lines)) : 'undefined'}`,
            ]
          }),
        )

        const fences = collected.get(id)?.fences ?? []
        const painted = await Promise.all(
          fences.map(async fence => {
            const lines = fence.lang ? await tokenize(fence.code, fence.lang) : null
            return lines ? tokensToHtml(lines) : ''
          }),
        )
        return [
          ...(collected.get(id)?.linked ? [`import { NuxtLink } from '#components'`] : []),
          ...demoLines.flat(),
          ...fences.flatMap((fence, slot) => [
            `const __hnFence${slot} = ${literal(fence.code)}`,
            `const __hnPaint${slot} = ${painted[slot] ? literal(painted[slot]!) : 'undefined'}`,
          ]),
        ]
      },
    },
  })
}
