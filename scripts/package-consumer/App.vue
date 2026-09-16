<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Button,
    Combobox,
    DataTable,
    Form,
    Input,
    Lightbox,
    MultiCombobox,
    Tag,
    type DataTableColumn,
    type FormErrors,
    type LightboxItem,
    type SelectOption,
  } from '@hina-ui/vue'

  interface Row {
    id: number
    name: string
  }
  const rows: Row[] = [{ id: 1, name: 'Entry' }]
  const columns: DataTableColumn<Row>[] = [{ key: 'name', label: 'Name', sortable: true }]
  const options: SelectOption<{ count: number }>[] = [{ value: 1, label: 'Entry', count: 3 }]
  const value = ref<string | number | null>(1)
  const selected = ref<Array<string | number>>([1])
  const values = ref({ name: 'Entry' })
  const validate = async (): Promise<FormErrors> => ({})
  const items: LightboxItem[] = [{ id: 'cover', src: '/image.png', alt: 'Cover' }]
  const open = ref(false)
</script>

<template>
  <Form :values="values" :rules="validate">
    <Input v-model="values.name" aria-label="Name" />
    <Button type="submit">Save</Button>
  </Form>
  <Combobox v-model="value" :options="options" :selected-option="options[0]" loading clearable>
    <template #option="{ option }">{{ option.count.toFixed(0) }}</template>
  </Combobox>
  <MultiCombobox v-model="selected" :options="options" :selected-options="options" loading />
  <DataTable :rows="rows" :columns="columns" row-key="id" label="Entries">
    <template #cell-name="{ row }">
      <Tag>{{ row.name.toUpperCase() }}</Tag>
    </template>
  </DataTable>
  <Lightbox v-model:open="open" :items="items" />
</template>
