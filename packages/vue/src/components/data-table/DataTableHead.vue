<script setup lang="ts" generic="T extends object">
  import { ArrowDown, ArrowUp, ChevronsUpDown, GripVertical } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Checkbox from '../checkbox/Checkbox.vue'
  import TableHead from '../table/TableHead.vue'
  import Slot from './Slot'
  import type { DataTableProps, DataTableSlots } from './types'
  import type { DataTableController, DataTableModels } from './composables/useDataTable'
  import type { DataTableLayout } from './composables/useTableColumns'
  import type { DataTableDrag } from './composables/useTableDrag'
  defineProps<{
    config: DataTableProps<T>
    ctl: DataTableController<T>
    models: DataTableModels
    layout: DataTableLayout<T>
    drag: DataTableDrag<T>
    controls: string[]
    trailing: number
    slots: DataTableSlots<T>
  }>()
  const t = useUiLocale()
</script>
<template>
  <thead>
    <tr v-for="(headers, level) in layout.headerRows.value" :key="level">
      <template v-if="level === 0">
        <TableHead
          v-for="(control, index) in controls"
          :key="control"
          :rowspan="layout.headerRows.value.length"
          :style="{ ...layout.controlStyle('start', index, true), top: 0 }"
        >
          <Checkbox
            v-if="control === 'select' && config.selectionMode !== 'single'"
            :model-value="ctl.pageSelection.value"
            :disabled="ctl.selectionDisabled.value"
            :aria-label="
              config.selectAll === 'filtered' ? t.table.selectFiltered : t.table.selectPage
            "
            @update:model-value="ctl.togglePage"
          />
          <span v-else class="sr-only">
            {{
              control === 'select'
                ? t.table.selectRow
                : control === 'drag'
                  ? t.table.moveRow
                  : t.table.expand
            }}
          </span>
        </TableHead>
      </template>
      <TableHead
        v-for="header in headers"
        :key="header.id"
        :data-hn-column="header.leaf ? header.column.key : undefined"
        :scope="header.leaf ? 'col' : 'colgroup'"
        :colspan="header.colspan"
        :rowspan="header.rowspan"
        :align="header.column.align"
        :aria-sort="header.ariaSort"
        :style="header.style"
        :class="
          cn(
            'relative',
            header.column.headerClass,
            drag.kind.value === 'column' &&
              drag.target.value === header.column.key &&
              'ring-accent ring-1 ring-inset',
          )
        "
      >
        <div
          class="flex min-w-0 items-center gap-1"
          :class="
            header.column.align === 'end'
              ? 'justify-end'
              : header.column.align === 'center'
                ? 'justify-center'
                : ''
          "
        >
          <Button
            v-if="header.leaf && config.reorderColumns && header.column.reorderable !== false"
            variant="ghost"
            size="sm"
            icon-only
            class="touch-none cursor-grab"
            :disabled="ctl.blocked.value"
            :aria-label="`${t.table.moveColumn}: ${header.column.label}`"
            @pointerdown="drag.start('column', header.column.key, header.column.label, $event)"
            @keydown="drag.columnKeydown(header.column.key, $event)"
          >
            <GripVertical />
          </Button>
          <Slot :render="slots[`header-${header.column.key}`] ?? slots.header" :context="header">
            <Button
              v-if="header.leaf && header.column.sortable"
              variant="ghost"
              tone="neutral"
              size="sm"
              :disabled="ctl.blocked.value"
              :aria-label="`${header.column.label}: ${header.nextLabel}`"
              :class="cn('min-w-0 max-w-full', header.column.align === 'end' ? '-me-2' : '-ms-2')"
              @click="header.toggleSort($event.shiftKey)"
            >
              <span class="min-w-0" :class="header.column.truncate && 'truncate'">
                {{ header.column.label }}
              </span>
              <ArrowUp v-if="header.sorting === 'asc'" aria-hidden="true" class="shrink-0" />
              <ArrowDown
                v-else-if="header.sorting === 'desc'"
                aria-hidden="true"
                class="shrink-0"
              />
              <ChevronsUpDown v-else aria-hidden="true" class="text-faint shrink-0" />
              <span
                v-if="config.multiSort && models.sorting.value.length > 1 && header.sortIndex >= 0"
                class="text-faint text-xs"
              >
                {{ header.sortIndex + 1 }}
              </span>
            </Button>
            <span v-else class="min-w-0" :class="header.column.truncate && 'truncate'">
              {{ header.column.label }}
            </span>
          </Slot>
        </div>
        <div
          v-if="header.leaf && config.resizable && header.column.resizable !== false"
          role="separator"
          aria-orientation="vertical"
          :tabindex="ctl.blocked.value ? -1 : 0"
          :aria-label="`${t.table.resizeColumn}: ${header.column.label}`"
          :aria-valuenow="Math.round(layout.width(header.column))"
          :aria-valuemin="typeof header.column.minWidth === 'number' ? header.column.minWidth : 48"
          :aria-valuemax="
            typeof header.column.maxWidth === 'number' ? header.column.maxWidth : 1600
          "
          class="hn-focus-ring absolute inset-y-0 end-0 z-10 w-2 cursor-col-resize touch-none after:absolute after:inset-y-1 after:end-0 after:w-px after:bg-accent after:opacity-0 hover:after:opacity-100 focus-visible:after:opacity-100"
          @pointerdown="layout.resize(header.column, $event)"
          @keydown="layout.resizeKey(header.column, $event)"
        />
      </TableHead>
      <TableHead
        v-if="level === 0 && trailing"
        :rowspan="layout.headerRows.value.length"
        :style="{ ...layout.controlStyle('end', 0, true), top: 0 }"
      >
        <span class="sr-only">{{ t.table.edit }}</span>
      </TableHead>
    </tr>
  </thead>
</template>
