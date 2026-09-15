<script setup lang="ts" generic="T extends object">
  import { computed, shallowRef, useId } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import LoadingOverlay from '../loading-overlay/LoadingOverlay.vue'
  import Pagination from '../pagination/Pagination.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import TableCell from '../table/TableCell.vue'
  import { tableWrapper } from '../table/table.variants'
  import DataTableHead from './DataTableHead.vue'
  import DataTableRow from './DataTableRow.vue'
  import DataTableDragPreview from './DataTableDragPreview.vue'
  import Slot from './Slot'
  import { aggregate, cssSize } from './utils'
  import { useDataTable } from './composables/useDataTable'
  import { useTableColumns } from './composables/useTableColumns'
  import { useTableDrag } from './composables/useTableDrag'
  import { useTableEditing } from './composables/useTableEditing'
  import { useTableExport } from './composables/useTableExport'
  import { useTableVirtual } from './composables/useTableVirtual'
  import type {
    DataTableEdit,
    DataTableFilter,
    DataTableKey,
    DataTableProps,
    DataTableQuery,
    DataTableReorder,
    DataTableSlots,
    DataTableSort,
  } from './types'

  defineOptions({ name: 'HnDataTable' })
  const props = withDefaults(defineProps<DataTableProps<T>>(), {
    variant: 'primary',
    hover: true,
    autoResetPage: true,
    selectChildren: true,
    hasNextPage: undefined,
  })
  const slots = defineSlots<DataTableSlots<T>>()
  const page = defineModel<number>('page', { default: 1 })
  const pageSize = defineModel<number>('pageSize', { default: 10 })
  const sorting = defineModel<DataTableSort[]>('sorting', { default: () => [] })
  const filter = defineModel<string>('filter', { default: '' })
  const columnFilters = defineModel<DataTableFilter[]>('columnFilters', { default: () => [] })
  const grouping = defineModel<string[]>('grouping', { default: () => [] })
  const selected = defineModel<DataTableKey[]>('selected', { default: () => [] })
  const expanded = defineModel<DataTableKey[]>('expanded', { default: () => [] })
  const expandedGroups = defineModel<string[]>('expandedGroups', { default: () => [] })
  const hiddenColumns = defineModel<string[]>('hiddenColumns', { default: () => [] })
  const columnOrder = defineModel<string[]>('columnOrder', { default: () => [] })
  const columnWidths = defineModel<Record<string, number>>('columnWidths', { default: () => ({}) })
  const models = {
    page,
    pageSize,
    sorting,
    filter,
    columnFilters,
    grouping,
    selected,
    expanded,
    expandedGroups,
    hiddenColumns,
    columnOrder,
    columnWidths,
  }
  const emit = defineEmits<{
    change: [query: DataTableQuery]
    rowClick: [row: T, event: MouseEvent | KeyboardEvent]
    rowReorder: [change: DataTableReorder<T>]
    'update:rows': [rows: T[]]
    edit: [edit: DataTableEdit<T>]
    editError: [error: unknown, edit: DataTableEdit<T>]
    rowContextmenu: [row: T, event: MouseEvent]
  }>()
  const t = useUiLocale()
  const name = useId()
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const element = shallowRef<HTMLTableElement>()
  const viewport = computed(() => area.value?.viewport)
  const ctl = useDataTable(
    props,
    models,
    query => emit('change', query),
    (row, event) => emit('rowClick', row, event),
  )
  const controls = computed(() =>
    [
      props.reorderable && 'drag',
      props.selectable && 'select',
      (props.expandable || props.getChildren) && 'expand',
    ].filter((value): value is string => typeof value === 'string'),
  )
  const trailing = computed(() => (props.editMode === 'row' ? 1 : 0))
  const layout = useTableColumns(
    props,
    models,
    ctl,
    element,
    viewport,
    computed(() => controls.value.length),
    trailing,
  )
  const editing = useTableEditing(
    props,
    ctl,
    edit => emit('edit', edit),
    (error, edit) => emit('editError', error, edit),
    element,
  )
  const drag = useTableDrag(props, models, ctl, element, viewport, change => {
    if (!change.parent) emit('update:rows', change.rows)
    emit('rowReorder', change)
  })
  const virtual = useTableVirtual(props, ctl, element, viewport, () => !!slots.expansion)
  useTableExport(ctl)
  const colspan = computed(() =>
    Math.max(1, ctl.visibleColumns.value.length + controls.value.length + trailing.value),
  )
  const summaryRows = computed(() => ctl.api.getRows('filtered'))
  const hasSummary = computed(
    () =>
      !!slots.summary ||
      ctl.visibleColumns.value.some(
        column => column.footer !== undefined || slots[`footer-${column.key}`],
      ),
  )
  defineExpose({ viewport, element, state: ctl.state, api: ctl.api })
</script>
<template>
  <div
    :aria-busy="props.loading || undefined"
    :style="{ height: cssSize(props.height) }"
    :class="
      cn('flex min-h-0 min-w-0 max-w-full flex-col gap-3', props.fill && 'h-full', props.class)
    "
  >
    <slot name="toolbar" v-bind="ctl.state.value" />
    <div :class="['relative min-h-0', (props.fill || props.height) && 'flex-1']">
      <ScrollArea
        ref="area"
        :direction="
          props.stickyHeader || props.maxHeight || props.height || props.fill || props.virtualize
            ? 'both'
            : 'horizontal'
        "
        :style="{
          maxHeight: cssSize(
            props.maxHeight ?? (props.virtualize && !props.fill && !props.height ? 400 : undefined),
          ),
        }"
        :class="
          cn(
            tableWrapper({ variant: props.variant, hover: false }),
            (props.fill || props.height) && 'h-full',
            props.stickyHeader && '[&_thead_th]:sticky [&_thead_th]:z-[3]',
            props.stickyFooter &&
              '[&_tfoot_td]:sticky [&_tfoot_td]:bottom-0 [&_tfoot_td]:z-[2] [&_tfoot_td]:bg-(--hn-table-head-bg)',
            props.tableClass,
          )
        "
      >
        <table
          ref="element"
          class="hn-table"
          :style="layout.tableStyle.value"
          :aria-label="props.label"
          :aria-rowcount="
            props.virtualize
              ? virtual.entries.value.length + layout.headerRows.value.length + (hasSummary ? 1 : 0)
              : undefined
          "
          :inert="ctl.blocked.value || undefined"
        >
          <caption v-if="props.caption">
            <span>{{ props.caption }}</span>
          </caption>
          <colgroup>
            <col v-for="control in controls" :key="control" style="width: 48px" />
            <col
              v-for="column in ctl.visibleColumns.value"
              :key="column.key"
              :style="{ width: layout.cellStyle(column).width }"
            />
            <col v-if="trailing" style="width: 72px" />
          </colgroup>
          <DataTableHead
            :config="props"
            :ctl="ctl"
            :models="models"
            :layout="layout"
            :drag="drag"
            :controls="controls"
            :trailing="trailing"
            :slots="slots"
          />
          <tbody>
            <tr
              v-if="
                !ctl.rows.value.length || (!ctl.visibleColumns.value.length && !controls.length)
              "
            >
              <TableCell :colspan="colspan">
                <div class="text-muted flex min-h-32 items-center justify-center px-3 py-6 text-sm">
                  <template v-if="props.loading">{{ t.table.loading }}</template>
                  <template v-else-if="!ctl.visibleColumns.value.length && !controls.length">
                    {{ t.table.noColumns }}
                  </template>
                  <slot v-else name="empty">{{ props.emptyText ?? t.table.empty }}</slot>
                </div>
              </TableCell>
            </tr>
            <template v-else>
              <tr v-if="virtual.before.value" aria-hidden="true">
                <td
                  :colspan="colspan"
                  :style="{ height: `${virtual.before.value}px`, padding: 0, border: 0 }"
                />
              </tr>
              <DataTableRow
                v-for="item in virtual.visible.value"
                :key="item.id"
                :item="item"
                :config="props"
                :ctl="ctl"
                :layout="layout"
                :drag="drag"
                :editing="editing"
                :slots="slots"
                :controls="controls"
                :colspan="colspan"
                :name="name"
                :measure="virtual.measure"
                @contextmenu="
                  !item.detail &&
                  !item.entry.group &&
                  emit('rowContextmenu', item.entry.row, $event)
                "
              />
              <tr v-if="virtual.after.value" aria-hidden="true">
                <td
                  :colspan="colspan"
                  :style="{ height: `${virtual.after.value}px`, padding: 0, border: 0 }"
                />
              </tr>
            </template>
          </tbody>
          <tfoot v-if="hasSummary">
            <Slot :render="slots.summary" :context="ctl.state.value">
              <tr>
                <TableCell
                  v-for="(control, index) in controls"
                  :key="control"
                  :style="layout.controlStyle('start', index)"
                />
                <TableCell
                  v-for="column in ctl.visibleColumns.value"
                  :key="column.key"
                  :style="layout.cellStyle(column)"
                  :align="column.align"
                  class="font-medium"
                >
                  <Slot
                    :render="slots[`footer-${column.key}`]"
                    :context="{ column, rows: summaryRows }"
                  >
                    {{
                      typeof column.footer === 'function'
                        ? column.footer(summaryRows)
                        : column.footer === true
                          ? aggregate(summaryRows, column, ctl.valueOf)
                          : column.footer
                    }}
                  </Slot>
                </TableCell>
                <TableCell v-if="trailing" :style="layout.controlStyle('end', 0)" />
              </tr>
            </Slot>
          </tfoot>
        </table>
      </ScrollArea>
      <LoadingOverlay :visible="props.loading" :text="t.table.loading" class="rounded-lg">
        <template v-if="slots.loading" #default><slot name="loading" /></template>
      </LoadingOverlay>
    </div>
    <slot name="footer" v-bind="ctl.state.value">
      <Pagination
        v-if="props.pagination && ctl.knownTotal.value"
        :model-value="ctl.page.value"
        :page-size="ctl.pageSize.value"
        :total="ctl.total.value"
        :item-count="ctl.api.getRows().length"
        :pending="props.loading"
        :disabled="props.disabled"
        @update:model-value="models.page.value = $event"
        @update:page-size="models.pageSize.value = $event"
      />
      <nav
        v-else-if="props.pagination"
        class="flex items-center gap-2"
        :aria-label="t.pagination.navLabel"
      >
        <Button
          variant="ghost"
          size="sm"
          icon-only
          :disabled="ctl.blocked.value || ctl.page.value <= 1"
          :aria-label="t.pagination.prev"
          @click="models.page.value--"
        >
          <ChevronLeft class="rtl:rotate-180" />
        </Button>
        <span class="text-muted text-sm tabular-nums">{{ ctl.page.value }}</span>
        <Button
          variant="ghost"
          size="sm"
          icon-only
          :disabled="ctl.blocked.value || !ctl.canNext.value"
          :aria-label="t.pagination.next"
          @click="models.page.value++"
        >
          <ChevronRight class="rtl:rotate-180" />
        </Button>
      </nav>
    </slot>
    <DataTableDragPreview :drag="drag" :layout="layout" />
  </div>
</template>
