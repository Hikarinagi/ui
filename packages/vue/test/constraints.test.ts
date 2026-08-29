import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const srcDir = join(root, 'src')
const tokensPath = join(srcDir, 'styles/tokens.css')
const tokens = readFileSync(tokensPath, 'utf8')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = join(dir, e.name)
    if (e.isDirectory()) return walk(full)
    return /\.(vue|ts)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [full] : []
  })
}

const componentFiles = walk(srcDir).filter(f => !f.endsWith('styles/tokens.css'))

function findAll(pattern: RegExp, files = componentFiles) {
  const hits: string[] = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const line of text.split('\n')) {
      const m = line.match(pattern)
      if (m) hits.push(`${relative(root, file)}: ${m[0].trim()}`)
    }
  }
  return hits
}

describe('动效必须取自 token', () => {
  it('组件源码中无字面量时长', () => {
    expect(findAll(/\b\d+m?s\b(?!-)/)).toEqual([])
  })

  it('组件源码中无字面量缓动曲线,cssEase 转换只许存在于 motion.ts', () => {
    const files = componentFiles.filter(f => !f.endsWith(join('src', 'motion.ts')))
    expect(findAll(/cubic-bezier\(|\bspring\(/, files)).toEqual([])
  })

  it('全库禁止 transition-all', () => {
    expect(findAll(/transition-all/)).toEqual([])
  })
})

describe('样式必须取自 token', () => {
  it('组件源码中无硬编码颜色', () => {
    expect(findAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/)).toEqual([])
  })

  it('组件源码中无字面量圆角', () => {
    expect(findAll(/rounded-\[/)).toEqual([])
  })

  it('组件源码零 dark: —— 出现即说明语义层缺角色', () => {
    expect(findAll(/\bdark:/)).toEqual([])
  })

  it('字重只用 400 / 500 / 600', () => {
    expect(findAll(/font-(bold|extrabold|black)\b|font-weight:\s*[789]00/)).toEqual([])
  })
})

describe('hover / press 只许走三条轴(README「hover 与 press」)', () => {
  it('hover/active 不许改填充(交互反馈只有薄墨一种介质),hover:border 只许 -strong 结尾', () => {
    const bad: string[] = []
    for (const file of componentFiles) {
      const text = readFileSync(file, 'utf8')
      for (const m of text.matchAll(/(?<![\w-])(?:hover|active):[^\s'"`]+/g)) {
        const cls = m[0]
        if (!/^hover:border-[\w-]+-strong$/.test(cls)) bad.push(`${relative(root, file)}: ${cls}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('组件不得自写 after: 状态层,叠加轴只能来自 utility', () => {
    expect(findAll(/(?<![\w-])after:[^\s'"`]+/)).toEqual([])
  })

  it('禁止 brightness / saturate 滤镜 hack', () => {
    expect(findAll(/\b(brightness|saturate)-\d|filter:\s*(brightness|saturate)/)).toEqual([])
  })
})

describe('L0 约定', () => {
  it('组件不得使用裸 Teleport,浮层一律经 Reka 的 Portal 部件', () => {
    expect(findAll(/<Teleport\b/)).toEqual([])
  })
})

describe('国际化与 SSR', () => {
  it('无方向性物理属性,一律逻辑属性', () => {
    expect(findAll(/\b(m|p)[lr]-|\bborder-[lr]-|\b(left|right)-\d|\btext-(left|right)\b/)).toEqual(
      [],
    )
  })

  it('模块顶层不访问 window / document', () => {
    const hits: string[] = []
    for (const file of componentFiles) {
      const text = readFileSync(file, 'utf8')
      const body = file.endsWith('.vue')
        ? (text.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '')
        : text
      for (const line of body.split('\n')) {
        if (/^\s*(const|let|var)\s+\w+\s*=\s*(window|document)\b/.test(line)) {
          hits.push(`${relative(root, file)}: ${line.trim()}`)
        }
      }
    }
    expect(hits).toEqual([])
  })
})

function varMap(selector: string) {
  const blocks = tokens.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'g')) ?? []
  const map = new Map<string, string>()
  for (const b of blocks) {
    for (const [, name, value] of b.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
      if (!map.has(name)) map.set(name, value.trim())
    }
  }
  return map
}

const themeVars = tokens.matchAll(/(--[\w-]+):\s*([^;]+);/g)
const allEdges = new Map<string, string[]>()
for (const [, name, value] of themeVars) {
  const refs = [...value.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]!)
  allEdges.set(name, [...(allEdges.get(name) ?? []), ...refs])
}

describe('token 层自身约束', () => {
  it('CSS 变量引用无环', () => {
    const cycles: string[] = []
    const state = new Map<string, number>()
    const visit = (node: string, path: string[]) => {
      if (state.get(node) === 1) {
        cycles.push([...path.slice(path.indexOf(node)), node].join(' -> '))
        return
      }
      if (state.get(node) === 2) return
      state.set(node, 1)
      for (const next of allEdges.get(node) ?? []) visit(next, [...path, node])
      state.set(node, 2)
    }
    for (const node of allEdges.keys()) visit(node, [])
    expect(cycles).toEqual([])
  })

  it('中性色阶三通道严格相等', () => {
    const bad: string[] = []
    for (const [, name, hex] of tokens.matchAll(/(--color-neutral-\d+):\s*#([0-9a-f]{6});/g)) {
      const [r, g, b] = hex!.match(/../g)!.map(x => parseInt(x, 16))
      if (r !== g || g !== b) bad.push(`${name} = #${hex}`)
    }
    expect(bad).toEqual([])
  })

  it('surface 纯白 / 纯黑 —— 纯度守在内容坐的地方,bg 让开一档', () => {
    expect(varMap(':root').get('--hn-surface')).toBe('var(--color-neutral-0)')
    expect(varMap('\\.dark').get('--hn-surface')).toBe('var(--color-neutral-1000)')
    expect(varMap(':root').get('--hn-bg-canvas')).not.toBe('var(--color-neutral-0)')
    expect(varMap('\\.dark').get('--hn-bg-canvas')).not.toBe('var(--color-neutral-1000)')
    expect(tokens).toContain('--color-neutral-0: #ffffff')
    expect(tokens).toContain('--color-neutral-1000: #000000')
  })

  it('bg 与 surface 必须两色:两套主题下 surface ≠ canvas', () => {
    const palette = varMap('@theme static')
    const light = varMap(':root')
    const dark = varMap('\\.dark')
    for (const chain of [
      [light, palette],
      [dark, light, palette],
    ] as const) {
      const canvas = resolve('--hn-bg-canvas', chain)
      const surface = resolve('--hn-surface', chain)
      expect(canvas).toMatch(/^#/)
      expect(surface).toMatch(/^#/)
      expect(surface).not.toBe(canvas)
    }
  })
})

function lookup(name: string, chain: readonly Map<string, string>[]) {
  for (const map of chain) {
    const hit = map.get(name)
    if (hit !== undefined) return hit
  }
  return ''
}

function resolve(name: string, chain: readonly Map<string, string>[]): string {
  let value = lookup(name, chain)
  for (let i = 0; i < 10 && value.startsWith('var('); i++) {
    const ref = value.match(/var\((--[\w-]+)/)?.[1]
    if (!ref) break
    value = lookup(ref, chain)
  }
  return value
}

function luminance(hex: string) {
  const ch = hex
    .replace('#', '')
    .match(/../g)!
    .map(x => parseInt(x, 16) / 255)
  const [r, g, b] = ch.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

function wash(bg: string, ink: string, opacity: number) {
  const ch = (hex: string) =>
    hex
      .replace('#', '')
      .match(/../g)!
      .map(x => parseInt(x, 16))
  const [br, bg_, bb] = ch(bg)
  const [ir, ig, ib] = ch(ink)
  const mix = (b: number, i: number) => Math.round(b + (i - b) * opacity)
  return `#${[mix(br!, ir!), mix(bg_!, ig!), mix(bb!, ib!)]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')}`
}

describe('实心 surface 的文字对比度', () => {
  const palette = varMap('@theme static')
  const light = varMap(':root')
  const dark = varMap('\\.dark')
  const pairs = ['accent', 'danger', 'success', 'warning', 'info', 'neutral-solid']

  for (const [themeName, chain] of [
    ['浅色', [light, palette]],
    ['深色', [dark, light, palette]],
  ] as const) {
    for (const role of pairs) {
      it(`${themeName} ${role} 达到 AA 4.5:1`, () => {
        const bg = resolve(`--hn-${role}`, chain)
        const fg = resolve(`--hn-${role}-on`, chain)
        expect(bg, `--hn-${role} 未解析出色值`).toMatch(/^#[0-9a-f]{6}$/i)
        expect(fg, `--hn-${role}-on 未解析出色值`).toMatch(/^#[0-9a-f]{6}$/i)
        expect(contrast(bg, fg)).toBeGreaterThanOrEqual(4.5)
      })

      it(`${themeName} ${role} 叠上 hover 薄墨后仍不跌破 AA`, () => {
        const bg = resolve(`--hn-${role}`, chain)
        const fg = resolve(`--hn-${role}-on`, chain)
        const opacity = Number(resolve('--hn-state-hover-opacity', chain))
        expect(opacity).toBeGreaterThan(0)
        expect(contrast(wash(bg, fg, opacity), fg)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})
