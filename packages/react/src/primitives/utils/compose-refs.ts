'use client'

import { useCallback, type Ref, type RefCallback } from 'react'

type PossibleRef<T> = Ref<T> | undefined

function setRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === 'function') return ref(value)
  if (ref != null) ref.current = value
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return node => {
    let hasCleanup = false
    const cleanups = refs.map(ref => {
      const cleanup = setRef(ref, node)
      if (!hasCleanup && typeof cleanup === 'function') hasCleanup = true
      return cleanup
    })
    if (!hasCleanup) return
    return () => {
      for (const [index, cleanup] of cleanups.entries()) {
        if (typeof cleanup === 'function') cleanup()
        else setRef(refs[index], null)
      }
    }
  }
}

export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  return useCallback(composeRefs(...refs), refs)
}
