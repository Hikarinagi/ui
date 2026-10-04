import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { FormField } from './FormField'
import { Input } from '../input/Input'
import '../../../test/browser.css'

const mounted: RenderResult[] = []

afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
})

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

describe('FormField · error message motion', () => {
  it('content below starts moving from its resting place when an error appears', async () => {
    let fail: () => void = () => {}
    function Harness() {
      const [error, setError] = useState<string | undefined>()
      fail = () => setError('Too short')
      return (
        <div style={{ width: '320px' }}>
          <FormField label="Email" error={error}>
            <Input />
          </FormField>
          <p data-below="">below</p>
        </div>
      )
    }
    mounted.push(await render(<Harness />))
    for (let index = 0; index < 4; index += 1) await frame()
    const below = document.querySelector<HTMLElement>('[data-below]')!
    const rest = below.getBoundingClientRect().top
    fail()
    await frame()
    await frame()
    const first = below.getBoundingClientRect().top - rest
    for (let index = 0; index < 40; index += 1) await frame()
    const settled = below.getBoundingClientRect().top - rest
    expect(first).toBeLessThan(1)
    expect(settled).toBeGreaterThan(20)
  })
})
