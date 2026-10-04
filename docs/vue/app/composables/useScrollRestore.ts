import type { OverlayScrollbars } from 'overlayscrollbars'
import type { RouteLocationNormalized } from 'vue-router'
import type { ScrollRestorer } from '@hina-ui/vue'
import { SCROLL_AT_ATTR, createScrollRestorer, firstPaintRestoreScript } from '@hina-ui/vue'

interface RestoreArea {
  instance?: OverlayScrollbars
}

const ABANDON_EVENTS = ['wheel', 'touchstart', 'keydown'] as const

export function useScrollRestore(key: string, area: () => RestoreArea | undefined) {
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  useHead({
    script: [
      {
        key: 'hn-scroll-restore',
        tagPosition: 'bodyClose',
        innerHTML: firstPaintRestoreScript(),
      },
    ],
  })

  let restorer: ScrollRestorer | null = null
  let teardown: (() => void)[] = []

  function abandonRestore() {
    restorer?.abandon()
  }

  function saveScroll() {
    restorer?.save()
  }

  function startRestore(instance: OverlayScrollbars) {
    if (restorer) return

    restorer = createScrollRestorer(key, {
      getViewport: () => area()?.instance?.elements().viewport ?? instance.elements().viewport,
      takeFirstPaintTop: () => {
        const el = instance.elements().target
        const at = el.getAttribute(SCROLL_AT_ATTR)
        el.removeAttribute(SCROLL_AT_ATTR)
        return at === null || at === undefined ? undefined : Number(at)
      },
      readState: () => window.history.state,
      writeState: state => window.history.replaceState(state, ''),
      setTimer: (fn, ms) => {
        const id = setTimeout(fn, ms)
        return () => clearTimeout(id)
      },
    })

    const viewport = instance.elements().viewport
    for (const name of ABANDON_EVENTS) {
      viewport.addEventListener(name, abandonRestore, { passive: true })
      teardown.push(() => viewport.removeEventListener(name, abandonRestore))
    }

    window.addEventListener('pagehide', saveScroll)
    teardown.push(() => window.removeEventListener('pagehide', saveScroll))
    teardown.push(router.beforeEach(saveScroll))
    teardown.push(router.afterEach(scheduleRestore))

    instance.on('updated', () => restorer?.settle())
    instance.on('scroll', () => restorer?.saveSoon())

    restorer.restore(true)
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }
  }

  function scheduleRestore(to: RouteLocationNormalized) {
    const run = () =>
      requestAnimationFrame(() => {
        if (router.currentRoute.value.fullPath !== to.fullPath) return
        restorer?.restore()
        if (to.hash) {
          document.getElementById(to.hash.slice(1))?.scrollIntoView()
        }
      })

    nuxtApp.hooks.hookOnce('page:loading:end', () => {
      const transition = (nuxtApp as unknown as Record<string, unknown>)['~transitionPromise'] as
        Promise<void> | undefined
      if (transition) transition.then(run)
      else run()
    })
  }

  const stop = watch(
    () => area()?.instance,
    instance => {
      if (instance) startRestore(instance)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stop()
    teardown.forEach(off => off())
    teardown = []
    restorer?.dispose()
    restorer = null
  })
}
