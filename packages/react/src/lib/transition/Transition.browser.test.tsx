import { useState } from 'react'
import { flushSync } from 'react-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Transition } from './Transition'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))

describe('Transition', () => {
  it('a leave that interrupts an enter before its first frame leaves from the enter-from state', async () => {
    let flash: () => Promise<void> = async () => {}
    let rerender: () => void = () => {}
    function Harness() {
      const [show, setShow] = useState(false)
      const [, setTick] = useState(0)
      flash = async () => {
        flushSync(() => setShow(true))
        await Promise.resolve()
        flushSync(() => setShow(false))
      }
      rerender = () => setTick(tick => tick + 1)
      return (
        <Transition
          show={show}
          enterActiveClass="hn-transition-base"
          enterFromClass="opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="opacity-0"
        >
          <span data-probe="" className="inline-block">
            busy
          </span>
        </Transition>
      )
    }
    const w = await render(<Harness />)
    mounted.push(w)
    const done = flash()
    const seen: string[] = []
    await done
    rerender()
    for (let index = 0; index < 40; index += 1) {
      const probe = document.querySelector<HTMLElement>('[data-probe]')
      if (!probe) break
      seen.push(getComputedStyle(probe).opacity)
      await frame()
    }
    expect(seen.length).toBeGreaterThan(0)
    expect(seen.every(opacity => opacity === '0')).toBe(true)
    expect(document.querySelector('[data-probe]')).toBeNull()
  })
})
