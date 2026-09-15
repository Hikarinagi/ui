<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { vTooltip } from '../tooltip/directive'
  import { useTableText } from './composables/useTableText'
  const props = defineProps<{ value: string | number; truncate?: boolean }>()
  const element = shallowRef<HTMLElement>()
  const { overflow, tooltip } = useTableText(element, () => props.value)
</script>
<template>
  <span
    v-if="truncate"
    ref="element"
    v-tooltip="tooltip"
    class="block truncate"
    :tabindex="overflow ? 0 : undefined"
  >
    {{ value }}
  </span>
  <template v-else>{{ value }}</template>
</template>
