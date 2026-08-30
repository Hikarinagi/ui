import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { TooltipProvider } from 'reka-ui'
import CodeBlock from '../code-block/CodeBlock.vue'
import CopyButton from './CopyButton.vue'

describe('probe provider branch', () => {
  it('inside TooltipProvider', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
    const host = document.createElement('div')
    document.body.appendChild(host)
    const App = defineComponent({
      render: () =>
        h(TooltipProvider, () => [
          h(CodeBlock, { code: 'const x = 1' }),
          h(CopyButton, { text: 'y' }),
        ]),
    })
    const w = mount(App, { attachTo: host })
    await new Promise(r => setTimeout(r, 100))
    console.log('BUTTONS', w.findAll('button').length)
    console.log('HTML', JSON.stringify(host.innerHTML.slice(0, 1500)))
    expect(true).toBe(true)
  })
})
