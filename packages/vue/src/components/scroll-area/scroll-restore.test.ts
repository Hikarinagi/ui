import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  RESTORE_DEADLINE_MS,
  SCROLL_AT_ATTR,
  SCROLL_ATOP_ATTR,
  SCROLL_ATOP_HIDE_PX,
  SCROLL_RESTORE_ATTR,
  SAVE_THROTTLE_MS,
  SCROLL_STATE_FIELD,
  atopOff,
  createScrollRestorer,
  firstPaintRestoreScript,
  readScrollRecord,
  writeScrollRecord,
} from './scroll-restore'

function fakeViewport(scrollHeight: number, clientHeight = 600) {
  let top = 0
  const el = {
    scrollHeight,
    clientHeight,
    get scrollTop() {
      return top
    },
    set scrollTop(next: number) {
      top = Math.max(0, Math.min(next, el.scrollHeight - el.clientHeight))
    },
  }
  return el as unknown as HTMLElement
}

function harness(options: {
  viewport: HTMLElement | null
  state?: unknown
  firstPaintTop?: number
}) {
  let state: unknown = options.state ?? null
  let viewport = options.viewport
  let firstPaintTop = options.firstPaintTop
  let writes = 0
  const timers: (() => void)[] = []

  const restorer = createScrollRestorer('main', {
    getViewport: () => viewport,
    takeFirstPaintTop: () => {
      const at = firstPaintTop
      firstPaintTop = undefined
      return at
    },
    readState: () => state,
    writeState: next => {
      writes += 1
      state = next
    },
    setTimer: fn => {
      timers.push(fn)
      return () => {
        const at = timers.indexOf(fn)
        if (at !== -1) timers.splice(at, 1)
      }
    },
  })

  return {
    restorer,
    get state() {
      return state
    },
    get writes() {
      return writes
    },
    setState(next: unknown) {
      state = next
    },
    get viewport() {
      return viewport
    },
    setViewport(next: HTMLElement | null) {
      viewport = next
    },
    grow(scrollHeight: number) {
      if (viewport) (viewport as unknown as { scrollHeight: number }).scrollHeight = scrollHeight
    },
    fireTimers() {
      const pending = [...timers]
      timers.length = 0
      pending.forEach(fn => fn())
    },
    pendingTimers: () => timers.length,
  }
}

const saved = (top: number) => ({
  current: '/characters',
  position: 4,
  [SCROLL_STATE_FIELD]: { main: top },
})

describe('scroll record', () => {
  it('reads an empty record from a state that has none', () => {
    expect(readScrollRecord(null)).toEqual({})
    expect(readScrollRecord({ position: 1 })).toEqual({})
    expect(readScrollRecord('nonsense')).toEqual({})
  })

  it("keeps the router's own history fields when writing", () => {
    const next: Record<string, unknown> = writeScrollRecord(
      { back: '/', current: '/characters', position: 4, scroll: null },
      'main',
      820,
    )

    expect(next.back).toBe('/')
    expect(next.current).toBe('/characters')
    expect(next.position).toBe(4)
    expect(next.scroll).toBeNull()
    expect(next[SCROLL_STATE_FIELD]).toEqual({ main: 820 })
  })

  it('lets two containers coexist in one history entry', () => {
    const first = writeScrollRecord({ position: 4 }, 'main', 820)
    const second = writeScrollRecord(first, 'conversation', 120)

    expect(second[SCROLL_STATE_FIELD]).toEqual({
      main: 820,
      conversation: 120,
    })
  })
})

describe('createScrollRestorer', () => {
  it('lands on the saved position at once when the content is already tall', () => {
    const h = harness({ viewport: fakeViewport(4000), state: saved(820) })

    h.restorer.restore()

    expect(h.viewport!.scrollTop).toBe(820)
    expect(h.restorer.isPending()).toBe(false)
    expect(h.pendingTimers()).toBe(0)
  })

  it('leaves a first load alone when the entry has no record', () => {
    const h = harness({
      viewport: fakeViewport(4000),
      state: { current: '/characters', position: 5 },
    })
    h.viewport!.scrollTop = 900

    h.restorer.restore(true)

    expect(h.viewport!.scrollTop).toBe(900)
    expect(h.restorer.isPending()).toBe(false)
  })

  it('leaves a first load alone when the reader scrolled before hydration', () => {
    const h = harness({
      viewport: fakeViewport(4000),
      state: saved(820),
      firstPaintTop: 820,
    })
    h.viewport!.scrollTop = 200

    h.restorer.restore(true)

    expect(h.viewport!.scrollTop).toBe(200)
    expect(h.restorer.isPending()).toBe(false)
  })

  it('still lands on the saved position when nothing moved before hydration', () => {
    const h = harness({
      viewport: fakeViewport(4000),
      state: saved(820),
      firstPaintTop: 820,
    })
    h.viewport!.scrollTop = 820

    h.restorer.restore(true)

    expect(h.viewport!.scrollTop).toBe(820)
  })

  it('goes to the top for a history entry that has no record', () => {
    const h = harness({
      viewport: fakeViewport(4000),
      state: { current: '/characters', position: 5 },
    })
    h.viewport!.scrollTop = 900

    h.restorer.restore()

    expect(h.viewport!.scrollTop).toBe(0)
    expect(h.restorer.isPending()).toBe(false)
  })

  it('clamps first and finishes the job once the content grows', () => {
    const h = harness({ viewport: fakeViewport(900), state: saved(2400) })

    h.restorer.restore()
    expect(h.viewport!.scrollTop).toBe(300)
    expect(h.restorer.isPending()).toBe(true)

    h.grow(1800)
    h.restorer.settle()
    expect(h.restorer.isPending()).toBe(true)

    h.grow(3600)
    h.restorer.settle()
    expect(h.viewport!.scrollTop).toBe(2400)
    expect(h.restorer.isPending()).toBe(false)
    expect(h.pendingTimers()).toBe(0)
  })

  it('ignores settle when nothing is pending', () => {
    const h = harness({ viewport: fakeViewport(4000), state: saved(820) })
    h.restorer.restore()
    h.viewport!.scrollTop = 15

    h.restorer.settle()

    expect(h.viewport!.scrollTop).toBe(15)
  })

  it('gives up at the deadline and leaves the clamped position alone', () => {
    const h = harness({ viewport: fakeViewport(900), state: saved(2400) })

    h.restorer.restore()
    expect(h.viewport!.scrollTop).toBe(300)

    h.fireTimers()
    expect(h.restorer.isPending()).toBe(false)

    h.grow(3600)
    h.restorer.settle()
    expect(h.viewport!.scrollTop).toBe(300)
  })

  it('abandons a pending restore when the reader scrolls', () => {
    const h = harness({ viewport: fakeViewport(900), state: saved(2400) })

    h.restorer.restore()
    h.restorer.abandon()
    h.grow(3600)
    h.viewport!.scrollTop = 120

    h.restorer.settle()

    expect(h.viewport!.scrollTop).toBe(120)
    expect(h.pendingTimers()).toBe(0)
  })

  it('refuses to save a clamped position over the real one', () => {
    const h = harness({ viewport: fakeViewport(900), state: saved(2400) })

    h.restorer.restore()
    h.restorer.save()

    expect(readScrollRecord(h.state).main).toBe(2400)
  })

  it('saves the current position once the restore is abandoned', () => {
    const h = harness({ viewport: fakeViewport(900), state: saved(2400) })

    h.restorer.restore()
    h.restorer.abandon()
    h.grow(3600)
    h.viewport!.scrollTop = 120
    h.restorer.save()

    expect(readScrollRecord(h.state).main).toBe(120)
  })

  it('waits rather than throwing when the viewport is not built yet', () => {
    const h = harness({ viewport: null, state: saved(820) })

    h.restorer.restore()
    expect(h.restorer.isPending()).toBe(true)

    h.setViewport(fakeViewport(4000))
    h.restorer.settle()

    expect(h.viewport!.scrollTop).toBe(820)
    expect(h.restorer.isPending()).toBe(false)
  })

  it('never writes a record while there is no viewport to read', () => {
    const h = harness({ viewport: null, state: { position: 4 } })

    h.restorer.abandon()
    h.restorer.save()

    expect(readScrollRecord(h.state)).toEqual({})
  })

  it('refuses to write into an entry it was not restored on', () => {
    const h = harness({
      viewport: fakeViewport(4000),
      state: { position: 2, [SCROLL_STATE_FIELD]: { main: 900 } },
    })

    h.restorer.restore()
    expect(h.viewport!.scrollTop).toBe(900)

    h.setState({ position: 3 })
    h.viewport!.scrollTop = 0
    h.restorer.save()

    expect(h.writes).toBe(0)
    expect(readScrollRecord(h.state)).toEqual({})
  })

  it('collapses a burst of scrolling into one write', () => {
    const h = harness({ viewport: fakeViewport(4000), state: { position: 2 } })
    h.restorer.restore()

    for (const top of [100, 200, 300]) {
      h.viewport!.scrollTop = top
      h.restorer.saveSoon()
    }
    expect(h.writes).toBe(0)

    h.fireTimers()

    expect(h.writes).toBe(1)
    expect(readScrollRecord(h.state).main).toBe(300)
  })

  it('drops a queued write when disposed', () => {
    const h = harness({ viewport: fakeViewport(4000), state: { position: 2 } })
    h.restorer.restore()
    h.viewport!.scrollTop = 400
    h.restorer.saveSoon()

    h.restorer.dispose()
    h.fireTimers()

    expect(h.writes).toBe(0)
  })

  it('throttles rather than writing on every scroll frame', () => {
    expect(SAVE_THROTTLE_MS).toBeGreaterThanOrEqual(250)
  })

  it('uses a deadline rather than waiting forever', () => {
    expect(RESTORE_DEADLINE_MS).toBeGreaterThan(0)
    const setTimer = vi.fn(() => () => {})
    const restorer = createScrollRestorer('main', {
      getViewport: () => fakeViewport(100),
      takeFirstPaintTop: () => undefined,
      readState: () => saved(2400),
      writeState: () => {},
      setTimer,
    })

    restorer.restore()

    expect(setTimer).toHaveBeenCalledWith(expect.any(Function), RESTORE_DEADLINE_MS)
  })
})

describe('firstPaintRestoreScript', () => {
  function run(state: unknown, readyState: string, markup: string) {
    document.body.innerHTML = markup
    Object.defineProperty(document, 'readyState', {
      value: readyState,
      configurable: true,
    })
    window.history.replaceState(state, '')
    ;(0, eval)(firstPaintRestoreScript())
    return document.querySelector(`[${SCROLL_RESTORE_ATTR}]`) as HTMLElement
  }

  const target = `<main ${SCROLL_RESTORE_ATTR}="main" style="height:100px"></main>`

  it('applies every saved container before the document finishes parsing', () => {
    const el = run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'loading', target)
    expect(el.scrollTop).toBe(1400)
  })

  it('stays out of the way once the document is done', () => {
    const el = run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'complete', target)
    expect(el.scrollTop).toBe(0)
  })

  it('does nothing for an entry with no record', () => {
    const el = run({ position: 3 }, 'loading', target)
    expect(el.scrollTop).toBe(0)
  })

  it('skips keys with no matching container instead of throwing', () => {
    const el = run({ [SCROLL_STATE_FIELD]: { main: 1400, gone: 900 } }, 'loading', target)
    expect(el.scrollTop).toBe(1400)
  })

  it('records where it left the scroller so a later restore can tell', () => {
    const el = run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'loading', target)
    expect(el.getAttribute(SCROLL_AT_ATTR)).toBe(String(el.scrollTop))
  })

  const withNotice = `${target}<div ${SCROLL_ATOP_ATTR}="main"></div>`

  function pointer(kind: 'fine' | 'coarse') {
    vi.stubGlobal('matchMedia', (media: string) => ({
      media,
      matches: media.includes(kind),
      addEventListener() {},
      removeEventListener() {},
    }))
  }

  function overflowing(el: HTMLElement) {
    Object.defineProperty(el, 'scrollHeight', { value: 4000, configurable: true })
    Object.defineProperty(el, 'clientHeight', { value: 900, configurable: true })
    return el
  }

  function notice() {
    return document.querySelector(`[${SCROLL_ATOP_ATTR}]`) as HTMLElement
  }

  afterEach(() => vi.unstubAllGlobals())

  describe('on a fine pointer', () => {
    beforeEach(() => pointer('fine'))

    it('pulls the notice up by the restored position before first paint', () => {
      run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'loading', withNotice)
      expect(notice().style.marginTop).toBe('-1400px')
      expect(notice().dataset.off).toBeUndefined()
    })

    it('keeps following the scroller while the page is still hydrating', () => {
      const el = overflowing(run({ [SCROLL_STATE_FIELD]: { main: 0 } }, 'loading', withNotice))
      expect(notice().style.marginTop).toBe('0px')

      el.scrollTop = 320
      el.dispatchEvent(new Event('scroll'))
      expect(notice().style.marginTop).toBe('-320px')
    })

    it('rounds the offset so it survives hydration', () => {
      run({ [SCROLL_STATE_FIELD]: { main: 1201.3333740234375 } }, 'loading', withNotice)
      expect(notice().style.marginTop).toBe('-1201px')
    })

    it('does not push the notice down on a negative offset', () => {
      run({ [SCROLL_STATE_FIELD]: { main: -80 } }, 'loading', withNotice)
      expect(notice().style.marginTop).toBe('0px')
    })

    it('lets go once the root stops being the scroller', () => {
      const el = overflowing(run({ [SCROLL_STATE_FIELD]: { main: 0 } }, 'loading', withNotice))
      el.scrollTop = 320
      el.dispatchEvent(new Event('scroll'))
      expect(notice().style.marginTop).toBe('-320px')

      // overlayscrollbars moves the content into its own viewport, which drops
      // the root back to scrollTop 0 and would otherwise reset the offset.
      Object.defineProperty(el, 'scrollHeight', { value: 900, configurable: true })
      el.scrollTop = 0
      el.dispatchEvent(new Event('scroll'))

      expect(notice().style.marginTop).toBe('-320px')
    })
  })

  describe('on a coarse pointer', () => {
    beforeEach(() => pointer('coarse'))

    it('hides the notice outright rather than dragging it', () => {
      run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'loading', withNotice)
      expect(notice().dataset.off).toBe('true')
      expect(notice().style.marginTop).toBe('')
    })

    it('marks it before it touches scrollTop, so the reveal does not animate on load', () => {
      document.body.innerHTML = withNotice
      Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true })
      window.history.replaceState({ [SCROLL_STATE_FIELD]: { main: 1400 } }, '')

      const order: string[] = []
      const scroller = document.querySelector(`[${SCROLL_RESTORE_ATTR}]`) as HTMLElement
      let top = 0
      Object.defineProperty(scroller, 'scrollTop', {
        configurable: true,
        get: () => {
          order.push('scrollTop')
          return top
        },
        set: (next: number) => {
          order.push('scrollTop')
          top = next
        },
      })

      const banner = notice()
      const set = banner.setAttribute.bind(banner)
      banner.setAttribute = (name: string, value: string) => {
        if (name === 'data-off') order.push('data-off')
        set(name, value)
      }
      ;(0, eval)(firstPaintRestoreScript())

      expect(order[0]).toBe('data-off')
    })

    it('leaves it showing for an entry that is at the top', () => {
      run({ [SCROLL_STATE_FIELD]: { main: 0 } }, 'loading', withNotice)
      expect(notice().dataset.off).toBe('false')
    })

    it('hides and shows it again while the page is still hydrating', () => {
      const el = overflowing(run({ [SCROLL_STATE_FIELD]: { main: 0 } }, 'loading', withNotice))

      el.scrollTop = 320
      el.dispatchEvent(new Event('scroll'))
      expect(notice().dataset.off).toBe('true')

      el.scrollTop = 0
      el.dispatchEvent(new Event('scroll'))
      expect(notice().dataset.off).toBe('false')
    })

    it('holds its ground inside the band instead of flickering', () => {
      const el = overflowing(run({ [SCROLL_STATE_FIELD]: { main: 0 } }, 'loading', withNotice))

      el.scrollTop = SCROLL_ATOP_HIDE_PX
      el.dispatchEvent(new Event('scroll'))
      expect(notice().dataset.off).toBe('false')

      el.scrollTop = SCROLL_ATOP_HIDE_PX + 1
      el.dispatchEvent(new Event('scroll'))
      expect(notice().dataset.off).toBe('true')

      el.scrollTop = 1
      el.dispatchEvent(new Event('scroll'))
      expect(notice().dataset.off).toBe('true')
    })
  })

  it('leaves the notice alone once the document is done', () => {
    pointer('coarse')
    run({ [SCROLL_STATE_FIELD]: { main: 1400 } }, 'complete', withNotice)
    expect(notice().dataset.off).toBeUndefined()
    expect(notice().style.marginTop).toBe('')
  })
})

describe('atopOff', () => {
  it('hides past the band, shows at the top, and keeps the last answer between', () => {
    expect(atopOff(SCROLL_ATOP_HIDE_PX + 1, false)).toBe(true)
    expect(atopOff(0, true)).toBe(false)
    expect(atopOff(SCROLL_ATOP_HIDE_PX, false)).toBe(false)
    expect(atopOff(SCROLL_ATOP_HIDE_PX, true)).toBe(true)
  })
})
