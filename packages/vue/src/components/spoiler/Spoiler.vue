<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useSpoiler } from './useSpoiler'

  defineOptions({ name: 'HnSpoiler' })

  const props = withDefaults(
    defineProps<{
      revealOn?: 'click' | 'hover'
      forceFallback?: boolean
      class?: string
    }>(),
    { revealOn: 'click' },
  )

  const hidden = defineModel<boolean>('hidden', { default: true })

  const t = useUiLocale()
  const host = ref<HTMLElement | null>(null)
  const { usesFallback } = useSpoiler(host, hidden, () => !!props.forceFallback)

  const label = computed(() =>
    hidden.value ? t.value.spoiler.revealLabel : t.value.spoiler.hideLabel,
  )

  function setIrisOrigin(event?: MouseEvent) {
    const el = host.value
    if (!el) return
    if (!event || !hidden.value) return

    const rects = [...el.getClientRects()].filter(r => r.width > 0 && r.height > 0)
    if (rects.length === 0) return

    const totalWidth = rects.reduce((sum, r) => sum + r.width, 0)
    const lineHeight = rects[0]!.height

    let virtualX: number | null = null
    let virtualY = 0
    let walked = 0
    for (const r of rects) {
      const inside =
        event.clientY >= r.top - 2 &&
        event.clientY <= r.bottom + 2 &&
        event.clientX >= r.left - 2 &&
        event.clientX <= r.right + 2
      if (inside) {
        virtualX = walked + (event.clientX - r.left)
        virtualY = event.clientY - r.top
        break
      }
      walked += r.width
    }

    if (virtualX === null || totalWidth === 0 || lineHeight === 0) {
      el.style.removeProperty('--hn-iris-x')
      el.style.removeProperty('--hn-iris-y')
      return
    }

    const x = (virtualX / totalWidth) * 100
    const y = (virtualY / lineHeight) * 100
    el.style.setProperty('--hn-iris-x', `${x.toFixed(1)}%`)
    el.style.setProperty('--hn-iris-y', `${y.toFixed(1)}%`)
  }

  function toggle(event?: MouseEvent) {
    setIrisOrigin(event)
    hidden.value = !hidden.value
  }

  const handlers = computed(() => {
    if (props.revealOn === 'hover') {
      return {
        mouseenter: (event: MouseEvent) => {
          setIrisOrigin(event)
          hidden.value = false
        },
        mouseleave: () => (hidden.value = true),
        focus: () => (hidden.value = false),
        blur: () => (hidden.value = true),
      }
    }
    return {
      click: toggle,
      keydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }
      },
    }
  })
</script>

<template>
  <span
    ref="host"
    :class="cn(usesFallback ? 'hn-spoiler-fb' : 'hn-spoiler', props.class)"
    :data-hidden="hidden ? '' : undefined"
    :role="props.revealOn === 'click' ? 'button' : undefined"
    tabindex="0"
    :aria-label="label"
    :aria-expanded="!hidden"
    v-on="handlers"
  >
    <span class="hn-spoiler-inner"><slot /></span>
  </span>
</template>
