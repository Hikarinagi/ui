<script setup lang="ts">
  import { Info, Lightbulb, CircleCheck, TriangleAlert, CircleX } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { callout, calloutIcon, type CalloutVariants } from './callout.variants'

  defineOptions({ name: 'HnCallout' })

  const props = withDefaults(
    defineProps<{
      tone?: CalloutVariants['tone']
      title?: string
      icon?: boolean
      class?: string
    }>(),
    { tone: 'neutral', icon: true },
  )

  const icons = {
    neutral: Info,
    accent: Lightbulb,
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleX,
  } as const
</script>

<template>
  <div role="note" :class="cn(callout({ tone: props.tone }), props.class)">
    <slot name="icon">
      <component
        :is="icons[props.tone]"
        v-if="props.icon"
        :class="calloutIcon({ tone: props.tone })"
        aria-hidden="true"
      />
    </slot>
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p v-if="props.title" class="text-fg font-medium">{{ props.title }}</p>
      <slot />
    </div>
  </div>
</template>
