'use client'

import { useEffect, useLayoutEffect, useRef, useState, type TransitionEvent } from 'react'

function createSidebarTransition(
  setTransitioning: (value: boolean) => void,
  notify: (revision: number) => void,
) {
  let revision = 0
  let frame = 0
  let target: HTMLElement | undefined
  let running = false
  let pendingRun = false

  function check() {
    frame = 0
    if (target && !target.isConnected) running = false
    if (running || pendingRun) {
      pendingRun = false
      frame = requestAnimationFrame(check)
      return
    }
    const current = revision
    release()
    setTransitioning(false)
    notify(current)
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(check)
  }

  function stop(event: Event) {
    if (event.target !== target || (event as globalThis.TransitionEvent).propertyName !== 'width')
      return
    running = false
    pendingRun = false
    schedule()
  }

  function release() {
    target?.removeEventListener('transitionend', stop)
    target?.removeEventListener('transitioncancel', stop)
    target = undefined
  }

  return {
    current: () => revision,
    change() {
      revision++
      setTransitioning(true)
      pendingRun = true
      schedule()
    },
    run(event: TransitionEvent<HTMLElement>) {
      const property = (event.nativeEvent as globalThis.TransitionEvent).propertyName
      if (event.target !== event.currentTarget || property !== 'width') return
      if (target !== event.currentTarget) {
        release()
        target = event.currentTarget
        target.addEventListener('transitionend', stop)
        target.addEventListener('transitioncancel', stop)
      }
      running = true
      setTransitioning(true)
      schedule()
    },
    dispose() {
      revision++
      cancelAnimationFrame(frame)
      frame = 0
      release()
    },
  }
}

export function useSidebarScrollUpdates(state: string, settled: () => void) {
  const [transitioning, setTransitioning] = useState(false)
  const [tracked, setTracked] = useState(state)
  const [notice, setNotice] = useState<{ revision: number }>()
  const [controller] = useState(() =>
    createSidebarTransition(setTransitioning, revision => setNotice({ revision })),
  )
  const latestSettled = useRef(settled)
  latestSettled.current = settled
  const previous = useRef(state)

  if (tracked !== state) {
    setTracked(state)
    setTransitioning(true)
  }

  useLayoutEffect(() => {
    if (previous.current === state) return
    previous.current = state
    controller.change()
  }, [state, controller])

  useEffect(() => {
    if (notice && notice.revision === controller.current()) latestSettled.current()
  }, [notice, controller])

  useEffect(() => () => controller.dispose(), [controller])

  return { transitioning, onTransitionRun: controller.run }
}
