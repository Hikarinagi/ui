import {
  toValue,
  watchEffect,
  type ComponentPublicInstance,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export function useOverlayPositionerClass(
  content: Ref<ComponentPublicInstance | null>,
  className: MaybeRefOrGetter<string | undefined>,
) {
  watchEffect(
    onCleanup => {
      const element = content.value?.$el as HTMLElement | undefined
      const positioner = element?.parentElement
      const classes = toValue(className)?.split(/\s+/).filter(Boolean) ?? []
      if (!positioner?.hasAttribute('data-reka-popper-content-wrapper') || !classes.length) return
      const added = classes.filter(name => !positioner.classList.contains(name))
      positioner.classList.add(...added)
      onCleanup(() => positioner.classList.remove(...added))
    },
    { flush: 'post' },
  )
}
