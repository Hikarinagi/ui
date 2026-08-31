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
  /** Where the first-paint script left the scroller, read once and cleared. */
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
        // The first-paint script already put the scroller where this entry
        // wants it, so anything else means the reader moved it while the page
        // was still hydrating — the wheel listener that would have cancelled a
        // restore is only attached from here on.
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
