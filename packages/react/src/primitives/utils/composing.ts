'use client'

import { useRef, useState } from 'react'

const imeScript =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u

function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

export interface Composing {
  readonly isComposing: boolean
  readonly shouldDeferInput: boolean
  handleCompositionStart: () => void
  handleCompositionUpdate: (event: CompositionEvent) => void
  handleCompositionEnd: (event: CompositionEvent) => void
}

export function useComposing(onEnd?: (event: CompositionEvent) => void): Composing {
  const end = useRef(onEnd)
  end.current = onEnd
  const [composing] = useState(() => {
    const state = { composing: false, ime: true, sawIme: false }
    return {
      get isComposing() {
        return state.composing
      },
      get shouldDeferInput() {
        return state.composing && state.ime
      },
      handleCompositionStart() {
        state.composing = true
        state.ime = true
        state.sawIme = false
      },
      handleCompositionUpdate(event: CompositionEvent) {
        if (!event.data) return
        if (imeScript.test(event.data)) {
          state.ime = true
          state.sawIme = true
        } else if (isAndroid() && !state.sawIme) state.ime = false
      },
      handleCompositionEnd(event: CompositionEvent) {
        void Promise.resolve().then(() => {
          state.composing = false
          end.current?.(event)
        })
      },
    }
  })
  return composing
}
