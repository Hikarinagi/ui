<script setup lang="ts">
  import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'

  defineOptions({ name: 'HnHoverCard' })

  const props = withDefaults(
    defineProps<{
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      openDelay?: number
      closeDelay?: number
      padded?: boolean
      class?: string
    }>(),
    {
      side: 'bottom',
      align: 'center',
      sideOffset: 8,
      openDelay: 300,
      closeDelay: 150,
      padded: true,
    },
  )

  const open = defineModel<boolean>('open')
</script>

<template>
  <HoverCardRoot v-model:open="open" :open-delay="props.openDelay" :close-delay="props.closeDelay">
    <HoverCardTrigger as-child>
      <slot />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        as-child
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
      >
        <Card
          data-hn-hover-card
          :padded="props.padded"
          :class="cn('hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none', props.class)"
        >
          <slot name="content" />
        </Card>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
