import { StrictMode, useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Transition } from './Transition'

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

const frames = async (count: number) => {
  for (let index = 0; index < count; index += 1)
    await new Promise(resolve => requestAnimationFrame(resolve))
}

describe('Transition · StrictMode', () => {
  it('an initially shown child without appear does not run the enter transition', async () => {
    const seen = new Set<string>()
    const w = await render(
      <StrictMode>
        <Transition
          show
          enterFromClass="from"
          enterActiveClass="active"
          onBeforeEnter={() => seen.add('enter')}
        >
          <div data-probe="" />
        </Transition>
      </StrictMode>,
    )
    mounted.push(w)
    const probe = document.querySelector('[data-probe]')!
    const observer = new MutationObserver(() => {
      for (const name of probe.classList) seen.add(name)
    })
    observer.observe(probe, { attributes: true, attributeFilter: ['class'] })
    for (const name of probe.classList) seen.add(name)
    await frames(3)
    observer.disconnect()
    expect([...seen]).toEqual([])
  })

  it('an initially hidden child stays unmounted, then enters once when shown', async () => {
    let toggle: () => void = () => {}
    const entered: string[] = []
    function Harness() {
      const [show, setShow] = useState(false)
      toggle = () => setShow(true)
      return (
        <Transition show={show} enterFromClass="from" onBeforeEnter={() => entered.push('enter')}>
          <div data-probe="" />
        </Transition>
      )
    }
    const w = await render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    )
    mounted.push(w)
    await frames(2)
    expect(document.querySelector('[data-probe]')).toBeNull()
    expect(entered).toEqual([])
    toggle()
    await frames(3)
    expect(document.querySelector('[data-probe]')).not.toBeNull()
    expect(entered).toEqual(['enter'])
  })
})
