<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useSpoiler } from './composables/useSpoiler'
  import { useReveal } from './composables/useReveal'

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

  const handlers = useReveal(host, hidden, () => props.revealOn)
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
