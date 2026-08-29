<script setup lang="ts">
  import { SplitterResizeHandle } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnSplitterHandle' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const t = useUiLocale()
</script>

<template>
  <SplitterResizeHandle
    :aria-label="props.label ?? t.splitter.handleLabel"
    :class="
      cn(
        'hn-focus-ring group/handle relative flex shrink-0 items-center justify-center',
        'data-[orientation=horizontal]:w-2 data-[orientation=vertical]:h-2',
        props.class,
      )
    "
  >
    <div
      class="border-line group-hover/handle:border-line-strong group-data-[resize-handle-state=drag]/handle:border-line-strong group-data-[orientation=horizontal]/handle:h-full group-data-[orientation=horizontal]/handle:border-s group-data-[orientation=vertical]/handle:w-full group-data-[orientation=vertical]/handle:border-t"
    />
  </SplitterResizeHandle>
</template>
