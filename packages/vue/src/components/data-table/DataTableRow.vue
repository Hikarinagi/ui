<script setup lang="ts" generic="T extends object">
  import { computed, shallowRef, watch } from 'vue'
  import { Check, ChevronRight, GripVertical, Pencil, X } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import TableCell from '../table/TableCell.vue'
  import DataTableSelection from './DataTableSelection.vue'
  import DataTableEditor from './DataTableEditor.vue'
  import DataTableText from './DataTableText.vue'
  import Slot from './Slot'
  import { cssSize, isRowAction } from './utils'
  import type { DataTableProps, DataTableSlots } from './types'
  import type { DataTableController } from './composables/useDataTable'
  import type { DataTableLayout } from './composables/useTableColumns'
  import type { DataTableDrag } from './composables/useTableDrag'
  import type { DataTableEditing } from './composables/useTableEditing'
  import type { DataTableRenderEntry } from './composables/useTableVirtual'
  const props = defineProps<{
    item: DataTableRenderEntry<T>
    config: DataTableProps<T>
    ctl: DataTableController<T>
    layout: DataTableLayout<T>
    drag: DataTableDrag<T>
    editing: DataTableEditing<T>
    slots: DataTableSlots<T>
    controls: string[]
    colspan: number
    name: string
    measure: (element: unknown) => void
  }>()
  const element = shallowRef<HTMLTableRowElement>()
  const entry = computed(() => props.item.entry)
  const t = useUiLocale()
  watch(element, value => props.measure(value), { flush: 'post' })
</script>
<template>
  <tr
    ref="element"
    :data-index="item.index"
    :data-hn-row="item.detail ? undefined : entry.id"
    :aria-rowindex="config.virtualize ? item.index + layout.headerRows.value.length + 1 : undefined"
    :data-state="entry.selected ? 'selected' : undefined"
    :data-hn-state-group="!item.detail && config.hover ? '' : undefined"
    :tabindex="
      !item.detail && !entry.group && config.rowClickable && !ctl.blocked.value ? 0 : undefined
    "
    :class="
      cn(
        !item.detail && (config.hover || config.selectable) && '[&>td]:hn-state-layer',
        !item.detail && !entry.group && config.rowClickable && 'hn-focus-ring cursor-pointer',
        !entry.group && config.rowClass?.(entry.row),
        drag.kind.value === 'row' &&
          drag.target.value === entry.id &&
          'ring-accent ring-1 ring-inset',
        drag.key.value === entry.id && 'opacity-50',
      )
    "
    @click="!item.detail && !entry.group && ctl.activate(entry.row, $event)"
    @keydown.enter="!item.detail && !entry.group && ctl.activate(entry.row, $event)"
    @keydown.space="!item.detail && !entry.group && ctl.activate(entry.row, $event)"
  >
    <TableCell
      :data-state="!item.detail && entry.selected ? 'selected' : undefined"
      v-if="item.detail"
      :colspan="colspan"
    >
      <div class="p-3"><Slot :render="slots.expansion" :context="entry" /></div>
    </TableCell>
    <template v-else-if="entry.group">
      <TableCell
        :data-state="!item.detail && entry.selected ? 'selected' : undefined"
        v-if="slots.group"
        :colspan="colspan"
      >
        <Slot :render="slots.group" :context="entry.group" />
      </TableCell>
      <template v-else>
        <TableCell
          :data-state="!item.detail && entry.selected ? 'selected' : undefined"
          v-for="(control, index) in controls"
          :key="control"
          :style="layout.controlStyle('start', index)"
        />
        <TableCell
          :data-state="!item.detail && entry.selected ? 'selected' : undefined"
          v-for="(column, index) in ctl.visibleColumns.value"
          :key="column.key"
          :align="column.align"
          :style="layout.cellStyle(column)"
        >
          <Button
            v-if="index === 0"
            variant="ghost"
            tone="neutral"
            size="sm"
            :disabled="ctl.blocked.value"
            :aria-expanded="entry.group.expanded"
            :style="{ marginInlineStart: `${entry.depth * 16}px` }"
            @click="entry.group.toggleExpanded()"
          >
            <ChevronRight
              aria-hidden="true"
              class="hn-transition-transform rtl:rotate-180"
              :class="entry.group.expanded && 'rotate-90 rtl:rotate-90'"
            />
            {{ entry.group.column.label }}: {{ entry.group.value }}
            <span class="text-muted">({{ entry.group.rows.length }})</span>
          </Button>
          <template v-else>{{ entry.group.aggregate(column.key) ?? '—' }}</template>
        </TableCell>
        <TableCell
          :data-state="!item.detail && entry.selected ? 'selected' : undefined"
          v-if="config.editMode === 'row'"
          :style="layout.controlStyle('end', 0)"
        />
      </template>
    </template>
    <template v-else>
      <TableCell
        :data-state="!item.detail && entry.selected ? 'selected' : undefined"
        v-for="(control, index) in controls"
        :key="control"
        :style="layout.controlStyle('start', index)"
      >
        <Button
          v-if="control === 'drag'"
          variant="ghost"
          size="sm"
          icon-only
          class="touch-none cursor-grab"
          :disabled="!drag.canMove(entry.row)"
          :aria-label="`${t.table.moveRow}: ${entry.label}`"
          @pointerdown="drag.start('row', entry.id, entry.label, $event)"
          @keydown="drag.rowKeydown(entry.key, $event)"
        >
          <GripVertical />
        </Button>
        <DataTableSelection
          v-else-if="control === 'select'"
          :single="config.selectionMode === 'single'"
          :checked="entry.indeterminate ? 'indeterminate' : entry.selected"
          :disabled="ctl.blocked.value || !entry.selectable"
          :label="`${t.table.selectRow}: ${entry.label}`"
          :name="name"
          @change="entry.toggleSelected"
        />
        <Button
          v-else-if="control === 'expand' && entry.expandable"
          variant="ghost"
          size="sm"
          icon-only
          :disabled="ctl.blocked.value"
          :aria-label="`${entry.expanded ? t.table.collapse : t.table.expand}: ${entry.label}`"
          :aria-expanded="entry.expanded"
          @click="entry.toggleExpanded()"
        >
          <ChevronRight
            aria-hidden="true"
            class="hn-transition-transform rtl:rotate-180"
            :class="entry.expanded && 'rotate-90 rtl:rotate-90'"
          />
        </Button>
      </TableCell>
      <TableCell
        :data-state="!item.detail && entry.selected ? 'selected' : undefined"
        v-for="(column, index) in ctl.visibleColumns.value"
        :key="column.key"
        :data-hn-cell="column.key"
        :align="column.align"
        :style="layout.cellStyle(column)"
        :tabindex="config.editMode === 'cell' && editing.canEdit(entry.row, column) ? 0 : undefined"
        :class="
          cn(
            typeof column.cellClass === 'function' ? column.cellClass(entry.row) : column.cellClass,
            config.editMode === 'cell' && editing.canEdit(entry.row, column) && 'hn-focus-ring',
          )
        "
        @dblclick="config.editMode === 'cell' && isRowAction($event) && entry.startEdit(column.key)"
        @keydown.enter="
          config.editMode === 'cell' && isRowAction($event) && entry.startEdit(column.key)
        "
      >
        <div
          :class="column.truncate && 'min-w-0 overflow-hidden'"
          :style="{
            maxWidth: cssSize(column.maxWidth),
            paddingInlineStart:
              index === 0 && config.getChildren ? `${entry.depth * 16}px` : undefined,
          }"
        >
          <DataTableEditor
            v-if="editing.isEditing(entry.key, column.key) && editing.canEdit(entry.row, column)"
            :context="editing.context(entry, column)"
            :slots="slots"
            :cell="config.editMode === 'cell'"
          />
          <Slot
            v-else
            :render="slots[`cell-${column.key}`] ?? slots.cell"
            :context="{ ...entry, column, value: ctl.valueOf(entry.row, column) }"
          >
            <DataTableText
              :value="ctl.displayValue(entry.row, column)"
              :truncate="column.truncate"
            />
          </Slot>
        </div>
      </TableCell>
      <TableCell
        :data-state="!item.detail && entry.selected ? 'selected' : undefined"
        v-if="config.editMode === 'row'"
        :style="layout.controlStyle('end', 0)"
      >
        <div v-if="editing.isEditing(entry.key)" class="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            icon-only
            :loading="editing.pending.value"
            :aria-label="t.table.save"
            @click="editing.commit"
          >
            <Check />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon-only
            :disabled="editing.pending.value"
            :aria-label="t.table.cancel"
            @click="editing.cancel"
          >
            <X />
          </Button>
        </div>
        <Button
          v-else
          size="sm"
          variant="ghost"
          icon-only
          :disabled="
            ctl.blocked.value ||
            !ctl.leaves.value.some(column => editing.canEdit(entry.row, column))
          "
          data-hn-edit-trigger
          :aria-label="`${t.table.edit}: ${entry.label}`"
          @click="entry.startEdit()"
        >
          <Pencil />
        </Button>
      </TableCell>
    </template>
  </tr>
</template>
