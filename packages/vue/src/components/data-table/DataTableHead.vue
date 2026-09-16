<script setup lang="ts" generic="T extends object">
  import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Checkbox from '../checkbox/Checkbox.vue'
  import { vTooltip } from '../tooltip/directive'
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
            class="mx-auto"
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
            'hn-table-header relative',
            header.column.headerClass,
            drag.kind.value === 'column' && drag.key.value === header.column.key && 'opacity-40',
          )
        "
        :data-reorderable="
          header.leaf &&
          config.reorderColumns &&
          header.column.reorderable !== false &&
          !ctl.blocked.value
            ? ''
            : undefined
        "
        :data-align="header.column.align"
        @pointerdown="
          header.leaf && drag.start('column', header.column.key, header.column.label, $event)
        "
      >
        <Slot :render="slots[`header-${header.column.key}`] ?? slots.header" :context="header">
          <component
            :is="
              header.leaf &&
              (header.column.sortable ||
                (config.reorderColumns && header.column.reorderable !== false))
                ? 'button'
                : 'span'
            "
            data-hn-table-heading
            class="hn-table-heading hn-focus-ring"
            :type="
              header.leaf && (header.column.sortable || config.reorderColumns)
                ? 'button'
                : undefined
            "
            :disabled="ctl.blocked.value"
            :data-sorted="header.sorting || undefined"
            :aria-label="
              header.column.sortable ? `${header.column.label}: ${header.nextLabel}` : undefined
            "
            :aria-description="
              config.reorderColumns && header.column.reorderable !== false
                ? `${t.table.moveColumn}: Alt + ← / →`
                : undefined
            "
            :aria-keyshortcuts="
              config.reorderColumns && header.column.reorderable !== false
                ? 'Alt+ArrowLeft Alt+ArrowRight'
                : undefined
            "
            @click="header.leaf && header.column.sortable && header.toggleSort($event.shiftKey)"
            @keydown="
              header.leaf &&
              config.reorderColumns &&
              header.column.reorderable !== false &&
              drag.columnKeydown(header.column.key, $event)
            "
          >
            <span
              class="min-w-0"
              :class="(header.column.truncate || config.resizable) && 'truncate'"
            >
              {{ header.column.label }}
            </span>
            <span
              v-if="header.leaf && header.column.sortable"
              class="hn-table-sort"
              aria-hidden="true"
            >
              <ArrowUp v-if="header.sorting === 'asc'" />
              <ArrowDown v-else-if="header.sorting === 'desc'" />
              <ChevronsUpDown v-else />
              <span
                v-if="config.multiSort && models.sorting.value.length > 1 && header.sortIndex >= 0"
                class="text-xs"
              >
                {{ header.sortIndex + 1 }}
              </span>
            </span>
          </component>
        </Slot>
        <div
          v-if="header.leaf && layout.canResize(header.column) && !ctl.blocked.value"
          v-tooltip="
            !layout.resizing.value && layout.handleVisible(header.column)
              ? `${t.table.resizeColumn}: ${layout.resizeLabel(header.column)}`
              : false
          "
          role="separator"
          aria-orientation="vertical"
          :tabindex="layout.handleVisible(header.column) ? 0 : -1"
          :style="layout.handleStyle(header.column)"
          :aria-label="`${t.table.resizeColumn}: ${layout.resizeLabel(header.column)}`"
          :aria-valuenow="Math.round(layout.width(header.column))"
          :aria-valuetext="layout.resizeValueText(header.column)"
          :aria-valuemin="Math.round(layout.bounds(header.column).min)"
          :aria-valuemax="Math.round(layout.bounds(header.column).max)"
          :data-side="layout.boundary(header.column)?.side"
          class="hn-table-resize hn-focus-ring"
          :data-resizing="layout.resizing.value === header.column.key ? '' : undefined"
          @click.stop
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
