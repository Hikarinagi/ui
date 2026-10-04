<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue'
  import { Card, Pagination, Stack, Text, type PaginationChange } from '@hina-ui/vue'

  const page = ref(1)
  const displayedPage = ref(1)
  const pending = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  function change(value: PaginationChange) {
    pending.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      displayedPage.value = value.page
      pending.value = false
    }, 1000)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Pagination
    v-model="page"
    :total="96"
    :page-size="5"
    :pending="pending"
    show-info
    @change="change"
  >
    <template #list>
      <Stack gap="xs">
        <Card v-for="index in 5" :key="index">
          <Text size="sm">{{ (displayedPage - 1) * 5 + index }}</Text>
        </Card>
      </Stack>
    </template>
  </Pagination>
</template>
