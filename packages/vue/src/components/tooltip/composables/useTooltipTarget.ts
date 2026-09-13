import { onScopeDispose, watch, watchPostEffect } from 'vue'
import { useEventListener } from '@vueuse/core'
import { injectTooltipProviderContext, injectTooltipRootContext } from 'reka-ui'

type Handler = (event: Event) => void

export function useTooltipTarget(
  target: HTMLElement,
  attrs: Record<string, unknown>,
  revision: () => number,
) {
  const root = injectTooltipRootContext()
  const provider = injectTooltipProviderContext()

  watchPostEffect(() => {
    if (root.trigger.value !== target) root.onTriggerChange(target)
  })

  const contentId = root.contentId
  const graceAttribute = 'data-grace-area-trigger'
  const previousGrace = target.getAttribute(graceAttribute)
  target.setAttribute(graceAttribute, '')

  function describe(open: boolean) {
    const ids = new Set(
      (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
    )
    ids.delete(contentId)
    if (open) ids.add(contentId)
    if (ids.size) target.setAttribute('aria-describedby', [...ids].join(' '))
    else target.removeAttribute('aria-describedby')
  }

  for (const event of ['pointermove', 'pointerleave', 'pointerdown', 'focus', 'blur', 'click']) {
    const prop = 'on' + event[0]!.toUpperCase() + event.slice(1)
    useEventListener(target, event, (event: Event) => {
      const handlers = attrs[prop] as Handler | Handler[] | undefined
      for (const handler of Array.isArray(handlers) ? handlers : handlers ? [handlers] : []) {
        handler(event)
      }
    })
  }

  watch([root.open, revision], ([open]) => describe(open), { immediate: true, flush: 'post' })
  watch(root.disabled, disabled => {
    if (disabled) root.onClose()
  })

  onScopeDispose(() => {
    if (root.open.value) provider.onClose()
    root.onClose()
    describe(false)
    if (previousGrace === null) target.removeAttribute(graceAttribute)
    else target.setAttribute(graceAttribute, previousGrace)
  })
}
