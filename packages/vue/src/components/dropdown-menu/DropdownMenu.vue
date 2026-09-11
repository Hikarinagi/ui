<script setup lang="ts">
  import { computed } from 'vue'
  import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    type DropdownMenuContentEmits,
  } from 'reka-ui'
  import { useAnchoredOverlay } from '../../lib/anchored-overlay'
  import Card from '../card/Card.vue'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDropdownMenu', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      label?: string
      anchor?: HTMLElement | null
      modal?: boolean
      dir?: 'ltr' | 'rtl'
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      class?: string
    }>(),
    { side: 'bottom', align: 'center', sideOffset: 8, modal: true },
  )

  const open = defineModel<boolean>('open')
  const emit = defineEmits<DropdownMenuContentEmits>()
  defineSlots<{ default?(): unknown; content?(): unknown }>()
  const { trigger, reference, visible, events } = useAnchoredOverlay(props, open, emit)

  const pressOrigin = computed(() => {
    if (props.side === 'left') return 'right'
    if (props.side === 'right') return 'left'
    if (props.align === 'start') return 'left'
    if (props.align === 'end') return 'right'
    return 'center'
  })
</script>

<template>
  <DropdownMenuRoot v-model:open="visible" :modal="props.modal" :dir="props.dir">
    <DropdownMenuTrigger
      v-if="$slots.default"
      ref="trigger"
      as-child
      class="group/hn-disclosure"
      :style="{ transformOrigin: pressOrigin }"
    >
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        v-if="reference"
        v-bind="{ 'aria-label': props.label, ...$attrs, ...events }"
        :reference="reference"
        as-child
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
      >
        <Card
          :padded="false"
          :class="
            cn(
              'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
              props.class,
            )
          "
        >
          <slot name="content" />
        </Card>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
