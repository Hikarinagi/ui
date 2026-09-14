<script setup lang="ts">
  import type { OverlayAnchor, OverlayPositionStrategy } from '../../lib/overlay-anchor'
  import { useHoverCardAnchor } from './composables/useHoverCardAnchor'

  defineOptions({ name: 'HnHoverCardAnchor' })
  const props = defineProps<{
    anchor?: OverlayAnchor | null
    updatePositionStrategy: OverlayPositionStrategy
    external: boolean
    closeDelay: number
    positionerClass?: string
  }>()
  const { reference, contentRef, present } = useHoverCardAnchor(props)
</script>

<template>
  <slot :reference="reference" :content-ref="contentRef" :present="present" />
</template>
