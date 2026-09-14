<script setup lang="ts">
  import type { OverlayAnchor, OverlayPositionStrategy } from '../../lib/overlay-anchor'
  import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'
  import HoverCardAnchor from './HoverCardAnchor.vue'

  defineOptions({ name: 'HnHoverCard' })

  const props = withDefaults(
    defineProps<{
      anchor?: OverlayAnchor | null
      updatePositionStrategy?: OverlayPositionStrategy
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      openDelay?: number
      closeDelay?: number
      padded?: boolean
      class?: string
      positionerClass?: string
    }>(),
    {
      updatePositionStrategy: 'optimized',
      side: 'bottom',
      align: 'center',
      sideOffset: 8,
      openDelay: 300,
      closeDelay: 150,
      padded: true,
    },
  )

  defineSlots<{ default?(): unknown; content?(): unknown }>()

  const open = defineModel<boolean>('open')
</script>

<template>
  <HoverCardRoot v-model:open="open" :open-delay="props.openDelay" :close-delay="props.closeDelay">
    <HoverCardTrigger v-if="$slots.default" as-child>
      <slot />
    </HoverCardTrigger>
    <HoverCardAnchor
      v-slot="{ reference, contentRef, present }"
      :anchor="props.anchor"
      :update-position-strategy="props.updatePositionStrategy"
      :external="!$slots.default"
      :close-delay="props.closeDelay"
      :positioner-class="props.positionerClass"
    >
      <HoverCardPortal v-if="present">
        <HoverCardContent
          :reference="reference"
          :update-position-strategy="props.updatePositionStrategy"
          as-child
          :side="props.side"
          :align="props.align"
          :side-offset="props.sideOffset"
        >
          <Card
            :ref="contentRef"
            data-hn-hover-card
            :inert="!open"
            :padded="props.padded"
            :class="
              cn('hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none', props.class)
            "
          >
            <slot name="content" />
          </Card>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCardAnchor>
  </HoverCardRoot>
</template>
