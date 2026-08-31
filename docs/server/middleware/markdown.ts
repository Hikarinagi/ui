const DEMO = /<Demo\s+name="([^"]+)"\s*\/>/g
const PLAYGROUND = /<Playground\b[\s\S]*?\/>/g
const ANCHOR = /^(#{2,6} .+?)\s*\{#[\w-]+\}$/gm

function fence(code: string): string {
  return `\`\`\`vue\n${code.trim()}\n\`\`\``
}

function playground(tag: string): string {
  const name = /name="([^"]+)"/.exec(tag)?.[1] ?? ''
  const label = /label="([^"]+)"/.exec(tag)?.[1] ?? ''
  const props = [...tag.matchAll(/prop:\s*'([^']+)'/g)].map(match => `\`${match[1]}\``)
  const adjustable = props.length ? `可调属性：${props.join('、')}。\n\n` : ''
  return `${adjustable}${fence(`<${name}>${label}</${name}>`)}`
}

async function read(base: string, key: string): Promise<string | undefined> {
  const value = await useStorage(`assets:${base}`).getItemRaw(key)
  if (value == null) return undefined
  if (typeof value === 'string') return value
  return new TextDecoder().decode(value as Uint8Array)
}

export default defineEventHandler(async event => {
  const raw = event.path.split('?')[0] ?? ''
  if (!raw.endsWith('.md') || raw.includes('..')) return

  const locale = raw.startsWith('/en/') ? 'en' : 'zh-CN'
  const path = locale === 'en' ? raw.slice(3) : raw
  const source = await read('content', `${locale}${path}`)
  if (source === undefined) return

  const names = [...source.matchAll(DEMO)].map(match => match[1]!)
  const code = new Map<string, string>()
  for (const name of names) {
    const demo = await read('demos', `${locale}/${name}.vue`)
    if (demo !== undefined) code.set(name, demo)
  }

  const expanded = source
    .replace(DEMO, (tag, name: string) => (code.has(name) ? fence(code.get(name)!) : tag))
    .replace(PLAYGROUND, playground)
    .replace(ANCHOR, '$1')

  setResponseHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return expanded
})
