<script setup lang="ts">
  import { computed } from 'vue'
  import { PopoverRoot, PopoverTrigger, PopoverPortal, type PopoverContentEmits } from 'reka-ui'
  import PopoverContent from './PopoverContent.vue'
  import { useAnchoredOverlay } from '../../lib/anchored-overlay'
  import Card from '../card/Card.vue'
  import { useOverlayPortal } from '../../lib/overlay-portal'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnPopover', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      anchor?: HTMLElement | null
      modal?: boolean
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      padded?: boolean
      class?: string
    }>(),
    { side: 'bottom', align: 'center', sideOffset: 8, padded: true, modal: true },
  )

  const open = defineModel<boolean>('open')
  const emit = defineEmits<PopoverContentEmits>()
  defineSlots<{ default?(): unknown; content?(): unknown }>()
  const { trigger, reference, visible, events } = useAnchoredOverlay(props, open, emit, event =>
    emit('openAutoFocus', event),
  )

  const { content, present } = useOverlayPortal(visible)

  const pressOrigin = computed(() => {
    if (props.side === 'left') return 'right'
    if (props.side === 'right') return 'left'
    if (props.align === 'start') return 'left'
    if (props.align === 'end') return 'right'
    return 'center'
  })
</script>

<template>
  <PopoverRoot v-model:open="visible" :modal="props.modal">
    <PopoverTrigger
      v-if="$slots.default"
      :ref="trigger"
      as-child
      :style="{ transformOrigin: pressOrigin }"
    >
      <slot />
    </PopoverTrigger>
    <PopoverPortal v-if="present">
      <PopoverContent
        v-bind="{ ...$attrs, ...events }"
        :reference="reference"
        as-child
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
      >
        <Card
          ref="content"
          :padded="props.padded"
          :class="cn('hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none', props.class)"
        >
          <slot name="content" />
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
