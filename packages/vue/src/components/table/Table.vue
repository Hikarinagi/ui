<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { cn } from '../../lib/cn'
  import { tableWrapper, type TableVariants } from './table.variants'

  defineOptions({ name: 'HnTable' })

  const props = withDefaults(
    defineProps<{
      variant?: TableVariants['variant']
      hover?: boolean
      stickyHeader?: boolean
      caption?: string
      class?: string
    }>(),
    { variant: 'primary', hover: true, stickyHeader: false },
  )

  const area = shallowRef<InstanceType<typeof ScrollArea> | null>(null)

  defineExpose({
    viewport: computed(() => area.value?.viewport),
    instance: computed(() => area.value?.instance),
  })
</script>

<template>
  <ScrollArea
    ref="area"
    :direction="props.stickyHeader ? 'both' : 'horizontal'"
    :class="
      cn(
        tableWrapper({
          variant: props.variant,
          hover: props.hover,
          stickyHeader: props.stickyHeader,
        }),
        props.class,
      )
    "
  >
    <table class="hn-table">
      <caption v-if="props.caption">
        <span>{{ props.caption }}</span>
      </caption>
      <slot />
    </table>
  </ScrollArea>
</template>
