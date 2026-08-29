<script setup lang="ts">
  import { useSlots } from 'vue'
  import { Separator } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDivider' })

  const props = withDefaults(
    defineProps<{
      orientation?: 'horizontal' | 'vertical'
      decorative?: boolean
      class?: string
    }>(),
    { orientation: 'horizontal', decorative: false },
  )

  const slots = useSlots()
</script>

<template>
  <div
    v-if="slots.default && props.orientation === 'horizontal'"
    :class="cn('flex w-full items-center gap-3', props.class)"
  >
    <Separator decorative class="bg-line h-px flex-1" />
    <span class="text-faint shrink-0 text-sm">
      <slot />
    </span>
    <Separator decorative class="bg-line h-px flex-1" />
  </div>
  <Separator
    v-else
    :orientation="props.orientation"
    :decorative="props.decorative"
    :class="
      cn(
        'bg-line',
        props.orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        props.class,
      )
    "
  />
</template>
