<script setup lang="ts">
  import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'
  import HoverCardAnchor from './HoverCardAnchor.vue'

  defineOptions({ name: 'HnHoverCard' })

  const props = withDefaults(
    defineProps<{
      anchor?: HTMLElement | null
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
      :external="!$slots.default"
      :close-delay="props.closeDelay"
    >
      <HoverCardPortal v-if="present">
        <HoverCardContent
          :reference="reference"
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
