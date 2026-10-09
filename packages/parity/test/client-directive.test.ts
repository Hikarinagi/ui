import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { clientReasons, hasClientDirective } from '../src/client-directive'

const source = join(process.cwd(), '..', 'react', 'src')
const demos = join(process.cwd(), '..', '..', 'docs', 'react', 'demos')

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

describe('React Server Components boundary', () => {
  it('modules that use hooks, create contexts or bind event handlers declare use client', () => {
    const missing = walk(source).flatMap(file => {
      const text = readFileSync(file, 'utf8')
      const reasons = clientReasons(text, file)
      return reasons.length && !hasClientDirective(text)
        ? [`${relative(source, file)}: ${reasons.join(', ')}`]
        : []
    })
    expect(missing).toEqual([])
  })

  it('documentation demos that use hooks, handlers or render functions declare use client', () => {
    const missing = walk(demos)
      .filter(file => file.endsWith('.tsx') && !relative(demos, file).startsWith('pages'))
      .flatMap(file => {
        const text = readFileSync(file, 'utf8')
        const reasons = clientReasons(text, file, { data: true })
        return reasons.length && !hasClientDirective(text)
          ? [`${relative(demos, file)}: ${reasons.join(', ')}`]
          : []
      })
    expect(missing).toEqual([])
  })

  it('detects client-only constructs', () => {
    expect(clientReasons('const [a] = useState(0)')).toEqual(['calls useState'])
    expect(clientReasons('const id = useId()')).toEqual([])
    expect(clientReasons('const C = createContext(null)')).toEqual(['creates a context'])
    expect(clientReasons('const a = <button onClick={go} />', 'a.tsx')).toEqual(['binds onClick'])
    expect(clientReasons('export const A = () => <p className="x" />', 'a.tsx')).toEqual([])
    expect(clientReasons('const a = <T renderIcon={() => null} />', 'a.tsx')).toEqual([
      'passes a function to renderIcon',
    ])
    const data = { data: true }
    expect(
      clientReasons("import { Moon } from 'icons'\nconst items = [{ icon: Moon }]", 'a.tsx', data),
    ).toEqual(['passes the component Moon as data'])
    expect(
      clientReasons("import Link from 'next/link'\nconst a = <A as={Link} />", 'a.tsx', data),
    ).toEqual(['passes the component Link as data'])
    expect(clientReasons('const items = [{ onSelect: () => go() }]', 'a.tsx', data)).toEqual([
      'passes a function as data',
    ])
    expect(
      clientReasons("import { Moon } from 'icons'\nconst a = <Moon />", 'a.tsx', data),
    ).toEqual([])
    expect(clientReasons('const format = (n: number) => n.toFixed(1)', 'a.tsx', data)).toEqual([])
    expect(hasClientDirective("'use client'\nexport {}")).toBe(true)
    expect(hasClientDirective("export {}\n'use client'")).toBe(false)
  })
})
