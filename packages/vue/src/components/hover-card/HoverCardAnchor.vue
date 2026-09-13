<script setup lang="ts">
  import { useHoverCardAnchor } from './composables/useHoverCardAnchor'

  defineOptions({ name: 'HnHoverCardAnchor' })
  const props = defineProps<{
    anchor?: HTMLElement | null
    external: boolean
    closeDelay: number
    positionerClass?: string
  }>()
  const { reference, contentRef, present } = useHoverCardAnchor(props)
</script>

<template>
  <slot :reference="reference" :content-ref="contentRef" :present="present" />
</template>
