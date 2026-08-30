<script setup lang="ts">
  import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent } from 'reka-ui'
  import Card from '../card/Card.vue'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnPopover' })

  const props = withDefaults(
    defineProps<{
      side?: 'top' | 'right' | 'bottom' | 'left'
      align?: 'start' | 'center' | 'end'
      sideOffset?: number
      padded?: boolean
      class?: string
    }>(),
    { side: 'bottom', align: 'center', sideOffset: 8, padded: true },
  )

  const open = defineModel<boolean>('open')
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        as-child
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
      >
        <Card
          :padded="props.padded"
          :class="cn('hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none', props.class)"
        >
          <slot name="content" />
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
