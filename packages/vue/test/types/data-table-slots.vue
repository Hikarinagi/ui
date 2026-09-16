<script setup lang="ts">
  import { ref } from 'vue'
  import { expectTypeOf } from 'vitest'
  import {
    DataTable,
    type DataTableColumn,
    type DataTableKey,
    type DataTableKeyField,
    type DataTableSort,
    type DataTableApi,
    type DataTableEditorContext,
  } from '../../src'

  interface Item {
    id: number
    name: string
    count: number
    nested: { active: boolean }
  }
  const rows: Item[] = [{ id: 1, name: 'Item', count: 3, nested: { active: true } }]
  const columns: DataTableColumn<Item>[] = [
    { key: 'name', label: 'Name' },
    { key: 'custom', label: 'Custom', accessor: row => row.nested.active },
  ]
  const editorType = {} as DataTableEditorContext<Item>
  const apiType = {} as DataTableApi<Item>
  const selected = ref<DataTableKey[]>([])
  const sorting = ref<DataTableSort[]>([])
  expectTypeOf<DataTableKeyField<Item>>().toEqualTypeOf<'id' | 'name' | 'count'>()
</script>

<template>
  <DataTable
    v-model:selected="selected"
    v-model:sorting="sorting"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :row-label="row => row.name"
    :selectable="row => row.nested.active"
    @row-click="row => row.count.toFixed()"
  >
    <template #cell-name="{ row, column, value, selected: checked }">
      {{ expectTypeOf(row).toEqualTypeOf(rows[0]!) }}
      {{ expectTypeOf(column).toEqualTypeOf(columns[0]!) }}
      {{ expectTypeOf(value).toBeUnknown() }}
      {{ expectTypeOf(checked).toEqualTypeOf(true as boolean) }}
      {{ row.nested.active }}
    </template>
    <template #header-name="{ column, sorting: order, toggleSort }">
      {{ column.label }}
      {{ expectTypeOf(order).toEqualTypeOf(false as false | 'asc' | 'desc') }}
      {{ toggleSort(true) }}
    </template>
    <template #editor-custom="context">
      {{ expectTypeOf(context).toEqualTypeOf(editorType) }}
      {{ context.row.nested.active }}
    </template>
    <template #expansion="{ row, toggleExpanded }">
      {{ expectTypeOf(row).toEqualTypeOf(rows[0]!) }}
      {{ toggleExpanded(false) }}
    </template>
    <template #group="{ rows: members, aggregate }">
      {{ expectTypeOf(members).toEqualTypeOf(rows) }}
      {{ expectTypeOf(aggregate('count')).toBeUnknown() }}
    </template>
    <template #toolbar="{ rows: visible, api }">
      {{ expectTypeOf(api).toEqualTypeOf(apiType) }}
      {{ expectTypeOf(visible).toEqualTypeOf(rows) }}
    </template>
    <template #footer="{ selected: keys }">
      {{ expectTypeOf(keys).toEqualTypeOf(selected) }}
    </template>
  </DataTable>
  <DataTable
    :rows="[{ uuid: 'a', details: { title: 'Title' } }]"
    :columns="[{ key: 'title', label: 'Title', accessor: row => row.details.title }]"
    row-key="uuid"
  >
    <template #cell="{ row }">
      {{ expectTypeOf(row.details.title).toEqualTypeOf('' as string) }}
    </template>
  </DataTable>
</template>
