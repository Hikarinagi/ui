<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { tableCell, type TableCellVariants } from './table.variants'

  defineOptions({ name: 'HnTableHead' })

  const props = withDefaults(
    defineProps<{
      scope?: 'col' | 'row'
      align?: TableCellVariants['align']
      sticky?: boolean
      class?: string
    }>(),
    { scope: 'col', sticky: false },
  )
</script>

<template>
  <th
    :scope="props.scope"
    :class="cn(tableCell({ align: props.align, sticky: props.sticky, head: true }), props.class)"
  >
    <slot />
  </th>
</template>
