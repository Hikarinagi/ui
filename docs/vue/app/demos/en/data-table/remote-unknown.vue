<script setup lang="ts">
  import { computed } from 'vue'
  import { DataTable } from '@hina-ui/vue'
  import { useRemoteTableDemo } from '../../data-table'
  const { rows, columns, loading, total, lastQuery, load } = useRemoteTableDemo('en')
  const hasNextPage = computed(() => lastQuery.value.page * lastQuery.value.pageSize < total.value)
</script>

<template>
  <DataTable
    :rows="rows"
    :columns="columns"
    row-key="id"
    manual
    pagination
    :page-size="5"
    :has-next-page="hasNextPage"
    :loading="loading"
    label="Entries"
    @change="load"
  />
</template>
