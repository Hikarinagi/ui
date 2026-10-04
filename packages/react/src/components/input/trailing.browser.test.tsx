import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import type { ComponentType } from 'react'
import { Mail } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Input } from './Input'
import { PasswordInput } from '../password-input/PasswordInput'
import '../../../test/browser.css'

const MailIcon = lucide(Mail)

type Props = Record<string, unknown>
type AnyComponent = ComponentType<Props>

afterEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 24px'
  document.body.appendChild(host)
  return host
}

const cases: Array<[string, AnyComponent, Props]> = [
  ['Input', Input as AnyComponent, { clearable: true, defaultValue: '星见' }],
  ['PasswordInput', PasswordInput as AnyComponent, { defaultValue: 'secret' }],
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
