import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType, ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Input } from '../input/Input'
import { FormField } from '../form-field/FormField'
import { TreeSelect } from './TreeSelect'
import '../../../test/browser.css'

const MailIcon = lucide(Mail)

type Props = Record<string, unknown>
type AnyComponent = ComponentType<Props>

const options = [
  { value: 'a', label: '可用' },
  { value: 'b', label: '不可用', disabled: true },
]
const fields: Array<[string, AnyComponent, Props]> = [
  ['TreeSelect', TreeSelect as unknown as AnyComponent, { items: options }],
]

async function draw(component: AnyComponent, props: Props = {}, children?: ReactNode) {
  const host = document.createElement('div')
  host.style.cssText = 'width:360px;padding:24px'
  document.body.appendChild(host)
  const Component = component
  let current = props
  const ui = (next: Props) => (
    <Component aria-label="控件" {...next}>
      {children}
    </Component>
  )
  const screen = await render(ui(current), { container: host })
  return {
    root: host.querySelector<HTMLElement>('.hn-field')!,
    setProps: async (patch: Props) => {
      current = { ...current, ...patch }
      await screen.rerender(ui(current))
    },
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('禁用外观只取决于当前控件', () => {
  it.each(fields)(
    '%s 自身 disabled 可动态切换，禁用时无 hover',
    async (_name, component, props) => {
      const w = await draw(component, { ...props, disabled: true })
      const root = w.root
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
      const resting = getComputedStyle(root).backgroundColor
      await userEvent.hover(root)
      await new Promise(resolve => setTimeout(resolve, 250))
      expect(getComputedStyle(root).backgroundColor).toBe(resting)
      await w.setProps({ disabled: false })
      await vi.waitFor(() => expect(getComputedStyle(root).opacity).toBe('1'))
    },
  )

  it.each(fields)(
    '%s 从 FormField 继承禁用，不把表单包装层当作淡化层',
    async (_name, component, props) => {
      const Control = component
      const { root } = await draw(
        FormField as AnyComponent,
        { disabled: true, label: '字段' },
        <Control {...props} />,
      )
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
    },
  )
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 24px'
  document.body.appendChild(host)
  return host
}

const cases: Array<[string, AnyComponent, Props]> = [
  [
    'TreeSelect',
    TreeSelect as unknown as AnyComponent,
    { items: [{ value: 1, label: 'Key' }], value: 1 },
  ],
]

const HOSTS =
  '[data-hn-input], [data-hn-select], [data-hn-multi-select], [data-hn-combobox], [data-hn-multi-combobox], [data-hn-tree-select], [data-hn-tags-input], [data-hn-date-field], [data-hn-date-picker]'
const SQUARE = '[class~="min-w-[var(--hn-input-h)]"]'

const px = (value: string) => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return value.endsWith('rem') ? parseFloat(value) * rem : parseFloat(value)
}

describe('输入面末端件：全家同一套', () => {
  it('每个末端件占一个宽等于控件高度的格，图形取 --hn-input-icon，最后一格贴宿主内缘；操作钮 fg、指示符 muted', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const referenceHost = attach()
      await render(
        <Input
          size={size}
          clearable
          defaultValue="星见"
          leading={<MailIcon />}
          aria-label="对照"
        />,
        { container: referenceHost },
      )
      const fg = getComputedStyle(referenceHost.querySelector('button')!).color
      const muted = getComputedStyle(referenceHost.querySelector('[data-hn-input] > span')!).color
      expect(fg).not.toBe(muted)
      for (const [name, component, props] of cases) {
        const container = attach()
        const Component = component
        await render(<Component {...props} size={size} aria-label={name} />, { container })
        const root = container.querySelector(HOSTS) as HTMLElement
        const rect = root.getBoundingClientRect()
        const inputH = px(getComputedStyle(root).getPropertyValue('--hn-input-h').trim())
        const icon = px(getComputedStyle(root).getPropertyValue('--hn-input-icon').trim())
        const border = parseFloat(getComputedStyle(root).borderRightWidth)
        const cells = Array.from(root.querySelectorAll<HTMLElement>(SQUARE)).filter(el => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.left > rect.left + rect.width / 2
        })
        expect(cells.length, `${name} ${size} 末端件数量`).toBeGreaterThan(0)
        for (const cell of cells) {
          const r = cell.getBoundingClientRect()
          expect(Math.abs(r.width - inputH), `${name} ${size} 格宽`).toBeLessThan(0.5)
          const svg = cell.querySelector('svg')!.getBoundingClientRect()
          expect(Math.abs(svg.width - icon), `${name} ${size} 图形尺寸`).toBeLessThan(0.5)
          expect(
            Math.abs(r.top + r.height / 2 - (rect.top + rect.height / 2)),
            `${name} ${size} 中线`,
          ).toBeLessThan(0.5)
          expect(getComputedStyle(cell).cursor, `${name} ${size} 光标`).toBe(
            cell.tagName === 'BUTTON' ? 'pointer' : getComputedStyle(root).cursor,
          )
          const color = getComputedStyle(cell).color
          if (cell.tagName === 'BUTTON' && cell.getAttribute('aria-label') !== '展开选项') {
            expect(color, `${name} ${size} 操作钮颜色`).toBe(fg)
          } else {
            expect(color, `${name} ${size} 指示符颜色`).toBe(muted)
          }
        }
        const last = cells[cells.length - 1]!
        expect(
          Math.abs(rect.right - last.getBoundingClientRect().right - border),
          `${name} ${size} 最后一格贴内缘`,
        ).toBeLessThan(0.5)
        for (let i = 1; i < cells.length; i++) {
          expect(
            Math.abs(
              cells[i]!.getBoundingClientRect().left - cells[i - 1]!.getBoundingClientRect().right,
            ),
            `${name} ${size} 格与格相邻`,
          ).toBeLessThan(0.5)
        }
      }
    }
  })
})
