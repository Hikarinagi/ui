import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Listbox } from './Listbox'
import { tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

beforeEach(() => {
  document.body.innerHTML = ''
  window.scrollTo(0, 0)
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  window.scrollTo(0, 0)
})

const options = Array.from({ length: 40 }, (_, index) => ({
  value: `item-${index}`,
  label: `Item ${index}`,
}))

const frames = async (count: number) => {
  for (let index = 0; index < count; index += 1)
    await new Promise(resolve => requestAnimationFrame(resolve))
}

describe('Listbox · mount under StrictMode', () => {
  for (const virtualize of [false, true]) {
    it(`${virtualize ? 'virtual' : 'plain'}: a listbox below the fold neither focuses nor scrolls the page on mount`, async () => {
      const host = document.createElement('div')
      document.body.appendChild(host)
      const w = await render(
        <StrictMode>
          <div style={{ height: '3000px' }} />
          <Listbox
            aria-label="Below the fold"
            options={options}
            defaultValue="item-30"
            virtualize={virtualize}
            className="h-48 w-56"
          />
        </StrictMode>,
        { container: host },
      )
      mounted.push(w)
      await tick()
      await frames(4)
      expect(window.scrollY).toBe(0)
      expect(document.activeElement).toBe(document.body)
    })
  }
})
