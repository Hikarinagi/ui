<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { tableCell, type TableCellVariants } from './table.variants'

  defineOptions({ name: 'HnTableCell' })

  const props = withDefaults(
    defineProps<{
      align?: TableCellVariants['align']
      sticky?: boolean
      class?: string
    }>(),
    { sticky: false },
  )
</script>

<template>
  <td :class="cn(tableCell({ align: props.align, sticky: props.sticky }), props.class)">
    <slot />
  </td>
</template>
