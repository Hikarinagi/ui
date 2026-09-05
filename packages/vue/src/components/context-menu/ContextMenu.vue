<script setup lang="ts">
  import {
    ContextMenuContent,
    ContextMenuPortal,
    ContextMenuRoot,
    ContextMenuTrigger,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'

  defineOptions({ name: 'HnContextMenu' })

  const props = defineProps<{
    label?: string
    disabled?: boolean
    class?: string
  }>()

  const open = defineModel<boolean>('open')
</script>

<template>
  <ContextMenuRoot v-model:open="open" modal>
    <ContextMenuTrigger as-child :disabled="props.disabled">
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent as-child :aria-label="props.label">
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
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
