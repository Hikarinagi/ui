<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VirtualList, Button, Switch, Empty } from '@hina-ui/vue'

  const loading = ref(false)
  const empty = ref(false)
  const items = computed(() =>
    empty.value ? [] : Array.from({ length: 100 }, (_, id) => ({ id, label: `条目 ${id + 1}` })),
  )
</script>

<template>
  <div class="w-full space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-2 text-sm">
        <Switch v-model="loading" />
        加载中
      </label>
      <Button variant="outline" @click="empty = !empty">
        {{ empty ? '恢复条目' : '清空条目' }}
      </Button>
    </div>
    <VirtualList
      :items="items"
      :get-key="item => item.id"
      :loading="loading"
      :height="240"
      :estimate-size="48"
      :dynamic="false"
      label="列表状态"
      class="border-line rounded-lg border"
    >
      <template #default="{ item }">
        <div class="border-line flex h-full items-center border-b px-4 text-sm">
          {{ item.label }}
        </div>
      </template>
      <template #empty>
        <Empty title="暂无条目" description="列表中没有可显示的内容。" size="sm" />
      </template>
    </VirtualList>
  </div>
</template>
