<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { callout, calloutIcon, type CalloutVariants } from './callout.variants'
  import { calloutIcons } from './icons'

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
</script>

<template>
  <div role="note" :class="cn(callout({ tone: props.tone }), props.class)">
    <slot name="icon">
      <component
        :is="calloutIcons[props.tone]"
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
