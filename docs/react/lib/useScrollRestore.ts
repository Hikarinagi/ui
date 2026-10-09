'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { usePathname } from 'next/navigation'
import {
  createScrollRestorer,
  readScrollRecord,
  type AppShellHandle,
  type ScrollRestorer,
} from '@hina-ui/react'

declare global {
  interface Window {
    __hnScrollAt?: Record<string, number>
  }
}

const ABANDON_EVENTS = ['wheel', 'touchstart', 'keydown'] as const

export function useScrollRestore(key: string, shell: RefObject<AppShellHandle | null>) {
  const pathname = usePathname()
  const restorer = useRef<ScrollRestorer | null>(null)
  const settled = useRef({ page: '', pathname: '' })
  const initial = useRef(true)
  const rendered = useRef(pathname)
  const latestKey = useRef(key)
  latestKey.current = key

  function restore() {
    settled.current = { page: location.pathname + location.search, pathname: location.pathname }
    restorer.current?.restore(initial.current)
    if (initial.current) return
    if (!location.hash || readScrollRecord(history.state)[latestKey.current] !== undefined) return
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
  }

  const run = useRef(restore)
  run.current = restore

  useEffect(() => {
    let frame = 0
    let off: Array<() => void> = []

    function start() {
      const instance = shell.current?.mainArea?.instance
      if (!instance) {
        frame = requestAnimationFrame(start)
        return
      }
      const viewport = instance.elements().viewport
      const current = createScrollRestorer(key, {
        getViewport: () => shell.current?.mainArea?.instance?.elements().viewport ?? viewport,
        takeFirstPaintTop: () => {
          const at = window.__hnScrollAt?.[key]
          if (window.__hnScrollAt) delete window.__hnScrollAt[key]
          return at
        },
        readState: () => window.history.state,
        writeState: state => {
          if (location.pathname + location.search === settled.current.page)
            window.history.replaceState(state, '')
        },
        setTimer: (fn, ms) => {
          const id = setTimeout(fn, ms)
          return () => clearTimeout(id)
        },
      })
      restorer.current = current

      const abandon = () => current.abandon()
      const save = () => current.save()
      for (const name of ABANDON_EVENTS) {
        viewport.addEventListener(name, abandon, { passive: true })
        off.push(() => viewport.removeEventListener(name, abandon))
      }
      window.addEventListener('pagehide', save)
      off.push(() => window.removeEventListener('pagehide', save))
      document.addEventListener('click', save, true)
      off.push(() => document.removeEventListener('click', save, true))
      off.push(instance.on('updated', () => current.settle()))
      off.push(instance.on('scroll', () => current.saveSoon()))
      off.push(() => current.dispose())

      run.current()
    }

    start()
    return () => {
      cancelAnimationFrame(frame)
      off.forEach(stop => stop())
      off = []
      restorer.current = null
    }
  }, [key, shell])

  useEffect(() => {
    if (rendered.current === pathname) return
    rendered.current = pathname
    initial.current = false
    run.current()
  }, [pathname])

  useEffect(() => {
    function onPopState() {
      requestAnimationFrame(() => {
        if (location.pathname !== settled.current.pathname) return
        initial.current = false
        run.current()
      })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
}
