<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VirtualList, Button, Switch, Empty, Inline, Stack, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const empty = ref(false)
  const items = computed(() =>
    empty.value ? [] : Array.from({ length: 100 }, (_, id) => ({ id, label: `Item ${id + 1}` })),
  )
</script>

<template>
  <Stack class="w-full">
    <Inline>
      <Switch v-model="loading">Loading</Switch>
      <Button variant="outline" @click="empty = !empty">
        {{ empty ? 'Restore items' : 'Clear items' }}
      </Button>
    </Inline>
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
        <Inline gap="none" class="border-line h-full border-b px-4">
          <Text size="sm">{{ item.label }}</Text>
        </Inline>
      </template>
      <template #empty>
        <Empty title="No items" description="There are no items to display." size="sm" />
      </template>
    </VirtualList>
  </Stack>
</template>
