import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { page } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import FormLayout from './FormLayout.vue'
import FormField from '../form-field/FormField.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach(width: number) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px; padding: 40px`
  document.body.appendChild(host)
  return host
}

function field(name: string) {
  return h(FormField, { name, label: name }, () => h(Input))
}

describe('FormLayout', () => {
  it('两列栅格里字段并排，legend 在栅格之上', async () => {
    await page.viewport(1024, 768)
    const w = mount(FormLayout, {
      attachTo: attach(720),
      props: { legend: '联系方式', columns: 2 },
      slots: { default: () => [field('email'), field('phone')] },
    })
    mounted.push(w)
    const grid = w.find('fieldset > div').element as HTMLElement
    expect(getComputedStyle(grid).gridTemplateColumns.split(' ')).toHaveLength(2)
    const [first, second] = w
      .findAll('[data-hn-form-field]')
      .map(f => f.element.getBoundingClientRect())
    expect(first!.top).toBe(second!.top)
    expect(second!.left).toBeGreaterThan(first!.right)
    const legend = w.find('legend').element.getBoundingClientRect()
    expect(legend.bottom).toBeLessThanOrEqual(first!.top)
  })
})
