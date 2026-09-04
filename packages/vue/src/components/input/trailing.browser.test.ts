import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, type Component } from 'vue'
import { Mail } from '@lucide/vue'
import Input from './Input.vue'
import PasswordInput from '../password-input/PasswordInput.vue'
import Select from '../select/Select.vue'
import MultiSelect from '../multi-select/MultiSelect.vue'
import Combobox from '../combobox/Combobox.vue'
import MultiCombobox from '../multi-combobox/MultiCombobox.vue'
import TreeSelect from '../tree-select/TreeSelect.vue'
import TagsInput from '../tags-input/TagsInput.vue'
import DateField from '../date-field/DateField.vue'
import DatePicker from '../date-picker/DatePicker.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 24px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
]

const cases: Array<[string, Component, Record<string, unknown>]> = [
  ['Input', Input, { clearable: true, modelValue: '星见' }],
  ['PasswordInput', PasswordInput, { modelValue: 'secret' }],
  ['Select', Select, { options, modelValue: 1 }],
  ['MultiSelect', MultiSelect, { options, modelValue: [1], clearable: true }],
  ['Combobox', Combobox, { options, modelValue: 1, clearable: true }],
  ['MultiCombobox', MultiCombobox, { options, modelValue: [1], clearable: true }],
  ['TreeSelect', TreeSelect, { items: [{ value: 1, label: 'Key' }], modelValue: 1 }],
  ['TagsInput', TagsInput, { modelValue: ['galgame'], clearable: true }],
  ['DateField', DateField, { modelValue: '2026-09-04', clearable: true }],
  ['DatePicker', DatePicker, { modelValue: '2026-09-04', clearable: true }],
]

const HOSTS =
  '[data-hn-input], [data-hn-select], [data-hn-multi-select], [data-hn-combobox], [data-hn-multi-combobox], [data-hn-tree-select], [data-hn-tags-input], [data-hn-date-field], [data-hn-date-picker]'
const SQUARE = '[class~="min-w-[var(--hn-input-h)]"]'

const px = (value: string) => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  return value.endsWith('rem') ? parseFloat(value) * rem : parseFloat(value)
}

describe('输入面末端件：全家同一套', () => {
  it('每个末端件占一个宽等于控件高度的格，图形取 --hn-input-icon，最后一格贴宿主内缘；操作钮 fg、指示符 muted', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const reference = mount(Input, {
        props: { size, clearable: true, modelValue: '星见' },
        slots: { leading: () => h(Mail) },
        attrs: { 'aria-label': '对照' },
        attachTo: attach(),
        global: { stubs: { transition: false } },
      })
      mounted.push(reference)
      const fg = getComputedStyle(reference.find('button').element).color
      const muted = getComputedStyle(reference.find('[data-hn-input] > span').element).color
      expect(fg).not.toBe(muted)
      for (const [name, component, props] of cases) {
        const container = attach()
        const w = mount(component, {
          props: { ...props, size },
          attrs: { 'aria-label': name },
          attachTo: container,
          global: { stubs: { transition: false } },
        })
        mounted.push(w)
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
