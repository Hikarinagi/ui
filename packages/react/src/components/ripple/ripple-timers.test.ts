import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRipple } from '../../../../shared/src/behavior/ripple'

function setup() {
  const host = document.createElement('div')
  const container = document.createElement('span')
  const surface = document.createElement('span')
  host.append(container, surface)
  document.body.append(host)
  surface.animate = (() => ({
    currentTime: 0,
    cancel() {},
    finished: Promise.resolve(),
  })) as unknown as typeof surface.animate
  const pressed: boolean[] = []
  const ripple = createRipple({
    container: () => container,
    surface: () => surface,
    disabled: () => false,
    onPressedChange: value => pressed.push(value),
  })
  ripple.connect()
  const fire = (type: string, pointerType = 'mouse') =>
    host.dispatchEvent(
      type === 'click'
        ? new MouseEvent('click', { bubbles: true })
        : new PointerEvent(type, { bubbles: true, isPrimary: true, pointerType }),
    )
  return { ripple, pressed, fire }
}

describe('ripple timers', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('does not release a short press after disconnect', () => {
    vi.useFakeTimers()
    const { ripple, pressed, fire } = setup()
    fire('pointerdown')
    fire('click')
    ripple.disconnect()
    vi.runAllTimers()
    expect(pressed).toEqual([true])
  })

  it('does not start a pending touch press after disconnect', () => {
    vi.useFakeTimers()
    const { ripple, pressed, fire } = setup()
    fire('pointerdown', 'touch')
    ripple.disconnect()
    vi.runAllTimers()
    expect(pressed).toEqual([])
  })
})
