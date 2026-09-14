<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Inline,
    Pagination,
    PaginationContent,
    PaginationInfo,
    PaginationJump,
    PaginationSize,
  } from '@hina-ui/vue'

  const page = ref(4)
  const pageSize = ref(10)
</script>

<template>
  <Pagination
    v-model="page"
    v-model:page-size="pageSize"
    :total="180"
    :page-size-options="[10, 20, 50]"
    align="between"
  >
    <PaginationInfo>
      <template #default="{ page: current, pageCount }">{{ current }} / {{ pageCount }}</template>
    </PaginationInfo>
    <Inline gap="sm">
      <PaginationContent />
      <PaginationSize />
      <PaginationJump />
    </Inline>
  </Pagination>
</template>
