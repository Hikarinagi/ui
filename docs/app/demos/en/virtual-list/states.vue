<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VirtualList, Button, Switch, Empty } from '@hina-ui/vue'

  const loading = ref(false)
  const empty = ref(false)
  const items = computed(() =>
    empty.value ? [] : Array.from({ length: 100 }, (_, id) => ({ id, label: `Item ${id + 1}` })),
  )
</script>

<template>
  <div class="w-full space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <Switch v-model="loading">Loading</Switch>
      <Button variant="outline" @click="empty = !empty">
        {{ empty ? 'Restore items' : 'Clear items' }}
      </Button>
    </div>
    <VirtualList
      :items="items"
      :get-key="item => item.id"
      :loading="loading"
      :height="240"
      :estimate-size="48"
      :dynamic="false"
      label="List states"
      class="border-line rounded-lg border"
    >
      <template #default="{ item }">
        <div class="border-line flex h-full items-center border-b px-4 text-sm">
          {{ item.label }}
        </div>
      </template>
      <template #empty>
        <Empty title="No items" description="There are no items to display." size="sm" />
      </template>
    </VirtualList>
  </div>
</template>
