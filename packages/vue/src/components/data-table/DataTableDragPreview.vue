<script setup lang="ts" generic="T extends object">
  import type { DataTableDrag } from './composables/useTableDrag'
  defineProps<{ drag: DataTableDrag<T> }>()
</script>
<template>
  <Teleport v-if="drag.dragging.value" to="body">
    <div
      class="bg-surface border-line pointer-events-none fixed z-[100] rounded-md border px-3 py-2 text-sm shadow-lg"
      :style="{ left: `${drag.dragging.value.x + 12}px`, top: `${drag.dragging.value.y + 12}px` }"
    >
      {{ drag.dragging.value.label }}
    </div>
  </Teleport>
</template>
