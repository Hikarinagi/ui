import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import FormField from './FormField.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

let app: App | undefined

afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.innerHTML = ''
})

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

describe('FormField · error message motion', () => {
  it('content below starts moving from its resting place when an error appears', async () => {
    const error = ref<string | undefined>()
    const host = document.createElement('div')
    host.style.width = '320px'
    document.body.appendChild(host)
    app = createApp({
      render: () => [
        h(FormField, { label: 'Email', error: error.value }, () => h(Input)),
        h('p', { 'data-below': '' }, 'below'),
      ],
    })
    app.mount(host)
    for (let index = 0; index < 4; index += 1) await frame()
    const below = host.querySelector<HTMLElement>('[data-below]')!
    const rest = below.getBoundingClientRect().top
    error.value = 'Too short'
    await nextTick()
    await frame()
    const first = below.getBoundingClientRect().top - rest
    for (let index = 0; index < 40; index += 1) await frame()
    const settled = below.getBoundingClientRect().top - rest
    expect(first).toBeLessThan(1)
    expect(settled).toBeGreaterThan(20)
  })
})
