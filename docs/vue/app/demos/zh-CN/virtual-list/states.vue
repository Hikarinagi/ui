<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VirtualList, Button, Switch, Empty, Inline, Stack, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const empty = ref(false)
  const items = computed(() =>
    empty.value ? [] : Array.from({ length: 100 }, (_, id) => ({ id, label: `条目 ${id + 1}` })),
  )
</script>

<template>
  <Stack class="w-full">
    <Inline>
      <Switch v-model="loading">加载中</Switch>
      <Button variant="outline" @click="empty = !empty">
        {{ empty ? '恢复条目' : '清空条目' }}
      </Button>
    </Inline>
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
        <Inline gap="none" class="border-line h-full border-b px-4">
          <Text size="sm">{{ item.label }}</Text>
        </Inline>
      </template>
      <template #empty>
        <Empty title="暂无条目" description="列表中没有可显示的内容。" size="sm" />
      </template>
    </VirtualList>
  </Stack>
</template>
