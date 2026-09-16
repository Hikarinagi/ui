<script setup lang="ts" generic="T extends object">
  import { DialogPortal } from 'reka-ui'
  import type { DataTableDrag } from './composables/useTableDrag'
  import type { DataTableLayout } from './composables/useTableColumns'
  defineProps<{ drag: DataTableDrag<T>; layout: DataTableLayout<T> }>()
</script>
<template>
  <DialogPortal>
    <div
      v-if="layout.guide.value"
      class="hn-table-drop-line"
      aria-hidden="true"
      data-hn-resize-guide
      :style="{
        left: `${layout.guide.value.x}px`,
        top: `${layout.guide.value.y}px`,
        height: `${layout.guide.value.height}px`,
        width: '2px',
      }"
    />
    <div
      v-if="layout.guide.value"
      class="hn-table-resize-label"
      data-hn-resize-label
      aria-hidden="true"
      :style="{
        left: `${layout.guide.value.labelX}px`,
        top: `${Math.max(4, layout.guide.value.y - 12 - layout.guide.value.columns.length * 18)}px`,
      }"
    >
      <div v-for="column in layout.guide.value.columns" :key="column.key">
        <span>{{ column.label }}</span>
        <span>{{ column.width }}px</span>
      </div>
    </div>
    <template v-if="drag.dragging.value">
      <div
        v-if="drag.dragging.value.marker"
        class="hn-table-drop-line"
        aria-hidden="true"
        data-hn-drop-line
        :style="{
          left: `${drag.dragging.value.marker.x}px`,
          top: `${drag.dragging.value.marker.y}px`,
          width: `${drag.dragging.value.marker.width}px`,
          height: `${drag.dragging.value.marker.height}px`,
        }"
      />
      <div
        class="hn-table-drag-preview"
        aria-hidden="true"
        data-hn-drag-preview
        :style="{
          ...drag.dragging.value.appearance,
          left: `${drag.dragging.value.x - drag.dragging.value.offsetX}px`,
          top: `${drag.dragging.value.y - drag.dragging.value.offsetY}px`,
          width:
            drag.dragging.value.kind === 'column' ? `${drag.dragging.value.width}px` : undefined,
        }"
      >
        <div class="hn-table-drag-label">{{ drag.dragging.value.label }}</div>
        <div
          v-for="(sample, index) in drag.dragging.value.samples"
          :key="index"
          class="hn-table-drag-cell"
        >
          {{ sample }}
        </div>
      </div>
    </template>
  </DialogPortal>
</template>
