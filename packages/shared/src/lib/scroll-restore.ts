export const SCROLL_STATE_FIELD = 'hnScroll'
export const RESTORE_DEADLINE_MS = 3000
export const SAVE_THROTTLE_MS = 500
export const SCROLL_RESTORE_ATTR = 'data-scroll-restore'
export const SCROLL_ATOP_ATTR = 'data-scroll-atop'
export const SCROLL_AT_ATTR = 'data-scroll-at'
export const SCROLL_ATOP_HIDE_PX = 8

export function atopOff(top: number, off: boolean) {
  if (top > SCROLL_ATOP_HIDE_PX) return true
  if (top <= 0) return false
  return off
}

export function firstPaintRestoreScript() {
  return `(function(){try{if(document.readyState!=="loading")return;
var r=(history.state&&history.state.${SCROLL_STATE_FIELD})||{};
var coarse=!!(window.matchMedia&&matchMedia("(pointer: coarse)").matches);
var cs=
document.querySelectorAll('[${SCROLL_ATOP_ATTR}]');
var mark=function(c,t){if(!coarse){c.style.marginTop=-Math.round(Math.max(0,t))+"px";return;}
if(t>${SCROLL_ATOP_HIDE_PX})c.setAttribute("data-off","true");else if(t<=0)c.setAttribute("data-off","false");};
for(var i=0;i<cs.length;i++){mark(cs[i],Math.max(0,r[cs[i].getAttribute("${SCROLL_ATOP_ATTR}")]||0));}
for(var k in r){var t=Math.max(0,r[k]);var e=
document.querySelector('[${SCROLL_RESTORE_ATTR}="'+k+'"]');if(e){e.scrollTop=t;e.setAttribute("${SCROLL_AT_ATTR}",String(e.scrollTop));}}
for(var i=0;i<cs.length;i++){(function(c){
var e=
document.querySelector('[${SCROLL_RESTORE_ATTR}="'+c.getAttribute("${SCROLL_ATOP_ATTR}")+'"]');
if(!e)return;
var sync=function(){if(e.scrollHeight<=e.clientHeight){e.removeEventListener("scroll",sync);return;}mark(c,e.scrollTop);};
e.addEventListener("scroll",sync,{passive:true});
})(cs[i]);}
}catch{}})()`.replace(/\n/g, '')
}

export type ScrollRecord = Record<string, number>

export interface ScrollRestorerPorts {
  getViewport: () => HTMLElement | null
  takeFirstPaintTop: () => number | undefined
  readState: () => unknown
  writeState: (state: Record<string, unknown>) => void
  setTimer: (fn: () => void, ms: number) => () => void
}

export interface ScrollRestorer {
  restore: (initial?: boolean) => void
  settle: () => void
  abandon: () => void
  save: () => void
  saveSoon: () => void
  dispose: () => void
  isPending: () => boolean
}

export function readScrollRecord(state: unknown): ScrollRecord {
  if (!state || typeof state !== 'object') return {}
  const record = (state as Record<string, unknown>)[SCROLL_STATE_FIELD]
  if (!record || typeof record !== 'object') return {}
  return record as ScrollRecord
}

export function writeScrollRecord(state: unknown, key: string, top: number) {
  const base = state && typeof state === 'object' ? (state as Record<string, unknown>) : {}
  return {
    ...base,
    [SCROLL_STATE_FIELD]: { ...readScrollRecord(base), [key]: top },
  }
}

function readEntryId(state: unknown) {
  if (!state || typeof state !== 'object') return undefined
  return (state as Record<string, unknown>).position
}

export function createScrollRestorer(key: string, ports: ScrollRestorerPorts): ScrollRestorer {
  let pending: number | null = null
  let clearDeadline: (() => void) | null = null
  let clearThrottle: (() => void) | null = null
  let entry: unknown

  function stopWaiting() {
    pending = null
    clearDeadline?.()
    clearDeadline = null
  }

  function apply(top: number) {
    const el = ports.getViewport()
    if (!el) return false
    el.scrollTop = top
    return el.scrollHeight - el.clientHeight + 1 >= top
  }

  function save() {
    if (pending !== null) return
    if (readEntryId(ports.readState()) !== entry) return
    const el = ports.getViewport()
    if (!el) return
    ports.writeState(writeScrollRecord(ports.readState(), key, el.scrollTop))
  }

  return {
    restore(initial) {
      stopWaiting()
      entry = readEntryId(ports.readState())

      const saved = readScrollRecord(ports.readState())[key]
      const firstPaintTop = ports.takeFirstPaintTop()

      if (initial) {
        if (saved === undefined) return
        const el = ports.getViewport()
        if (firstPaintTop !== undefined && el && el.scrollTop !== firstPaintTop) return
      }

      const top = saved ?? 0
      if (apply(top)) return
      pending = top
      clearDeadline = ports.setTimer(stopWaiting, RESTORE_DEADLINE_MS)
    },

    settle() {
      if (pending === null) return
      if (apply(pending)) stopWaiting()
    },

    abandon: stopWaiting,

    isPending: () => pending !== null,

    save,

    saveSoon() {
      if (clearThrottle) return
      clearThrottle = ports.setTimer(() => {
        clearThrottle = null
        save()
      }, SAVE_THROTTLE_MS)
    },

    dispose() {
      stopWaiting()
      clearThrottle?.()
      clearThrottle = null
    },
  }
}

export const SCROLL_FIRST_PAINT_FIELD = '__hnScrollAt'

export function scrollRestoreScript() {
  const collect = `(function(){var s=window.${SCROLL_FIRST_PAINT_FIELD}=window.${SCROLL_FIRST_PAINT_FIELD}||{};var e=document.querySelectorAll('[${SCROLL_AT_ATTR}]');for(var i=0;i<e.length;i++){s[e[i].getAttribute('${SCROLL_RESTORE_ATTR}')]=Number(e[i].getAttribute('${SCROLL_AT_ATTR}'));e[i].removeAttribute('${SCROLL_AT_ATTR}')}})()`
  return `${firstPaintRestoreScript()};${collect}`
}

export interface ScrollRestoreSessionOptions {
  key: string
  viewport: HTMLElement
  target: HTMLElement
  initial?: boolean
  onUpdated: (listener: () => void) => () => void
  onScroll: (listener: () => void) => () => void
}

export interface ScrollRestoreSession {
  dispose: () => void
}

const ABANDON_EVENTS = ['wheel', 'touchstart', 'keydown'] as const
const NAVIGATION_FALLBACK_MS = 500

function takeFirstPaint(key: string, target: HTMLElement) {
  const store = (window as unknown as Record<string, Record<string, number> | undefined>)[
    SCROLL_FIRST_PAINT_FIELD
  ]
  if (store && key in store) {
    const top = store[key]
    delete store[key]
    return top
  }
  const at = target.getAttribute(SCROLL_AT_ATTR)
  target.removeAttribute(SCROLL_AT_ATTR)
  return at === null ? undefined : Number(at)
}

function hashTarget() {
  if (!location.hash) return null
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)))
  } catch {
    return null
  }
}

export function createScrollRestoreSession({
  key,
  viewport,
  target,
  initial = true,
  onUpdated,
  onScroll,
}: ScrollRestoreSessionOptions): ScrollRestoreSession {
  const page = () => location.pathname + location.search
  const here = () => ({ href: location.href, page: page() })
  const setTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    return () => clearTimeout(id)
  }

  let settled = here()
  let navigating = false
  let clearFallback: (() => void) | null = null
  let disposed = false

  const restorer = createScrollRestorer(key, {
    getViewport: () => viewport,
    takeFirstPaintTop: () => takeFirstPaint(key, target),
    readState: () => history.state,
    writeState: state => {
      if (!navigating && page() === settled.page) history.replaceState(state, '')
    },
    setTimer,
  })

  function land(first = false) {
    navigating = false
    clearFallback?.()
    clearFallback = null
    settled = here()
    const saved = readScrollRecord(history.state)[key]
    restorer.restore(first)
    if (!first && saved === undefined) hashTarget()?.scrollIntoView()
  }

  function detect(traversal = false) {
    if (disposed || location.href === settled.href) return
    if (page() === settled.page) {
      settled = here()
      if (traversal && readScrollRecord(history.state)[key] !== undefined) restorer.restore()
      return
    }
    if (navigating) return
    navigating = true
    restorer.abandon()
    clearFallback = setTimer(() => land(), NAVIGATION_FALLBACK_MS)
  }

  const check = () => queueMicrotask(() => detect())
  const traverse = () => queueMicrotask(() => detect(true))
  const entryChange = (event: Event) => {
    const traversal = (event as Event & { navigationType?: string }).navigationType === 'traverse'
    queueMicrotask(() => detect(traversal))
  }
  const abandon = () => restorer.abandon()
  const save = () => restorer.save()
  const navigation = (window as Window & { navigation?: EventTarget }).navigation

  const off = [
    onUpdated(() => {
      detect()
      if (navigating) land()
      else restorer.settle()
    }),
    onScroll(() => {
      detect()
      restorer.saveSoon()
    }),
  ]
  for (const name of ABANDON_EVENTS) viewport.addEventListener(name, abandon, { passive: true })
  navigation?.addEventListener('currententrychange', entryChange)
  window.addEventListener('popstate', traverse)
  window.addEventListener('hashchange', check)
  window.addEventListener('pagehide', save)
  document.addEventListener('click', save, true)

  land(initial)

  return {
    dispose() {
      disposed = true
      off.forEach(stop => stop())
      for (const name of ABANDON_EVENTS) viewport.removeEventListener(name, abandon)
      navigation?.removeEventListener('currententrychange', entryChange)
      window.removeEventListener('popstate', traverse)
      window.removeEventListener('hashchange', check)
      window.removeEventListener('pagehide', save)
      document.removeEventListener('click', save, true)
      clearFallback?.()
      restorer.dispose()
    },
  }
}
