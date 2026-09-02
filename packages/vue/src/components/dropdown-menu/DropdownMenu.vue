<script setup lang="ts">
  import { computed } from 'vue'
  import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
  } from 'reka-ui'
  import Card from '../card/Card.vue'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnDropdownMenu' })

  const props = withDefaults(
    defineProps<{
      label?: string
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      class?: string
    }>(),
    { side: 'bottom', align: 'center', sideOffset: 8 },
  )

  const open = defineModel<boolean>('open')

  const pressOrigin = computed(() => {
    if (props.side === 'left') return 'right'
    if (props.side === 'right') return 'left'
    if (props.align === 'start') return 'left'
    if (props.align === 'end') return 'right'
    return 'center'
  })
</script>

<template>
  <DropdownMenuRoot v-model:open="open" modal>
    <DropdownMenuTrigger
      as-child
      class="group/hn-disclosure"
      :style="{ transformOrigin: pressOrigin }"
    >
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        as-child
        :aria-label="props.label"
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
