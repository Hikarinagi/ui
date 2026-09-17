<script setup lang="ts">
  import { ref } from 'vue'
  import {
    VirtualList,
    NumberInput,
    Button,
    Inline,
    Stack,
    Text,
    type VirtualListExpose,
    type VirtualListRange,
  } from '@hina-ui/vue'

  const list = ref<VirtualListExpose>()
  const target = ref(5000)
  const range = ref<VirtualListRange>({ startIndex: 0, endIndex: 0 })
  const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `条目 ${id + 1}` }))
</script>

<template>
  <Stack class="w-full">
    <Inline gap="sm">
      <NumberInput
        v-model="target"
        :min="1"
        :max="items.length"
        aria-label="条目序号"
        class="w-36"
      />
      <Button @click="list?.scrollToIndex(target - 1, { align: 'center' })">跳转</Button>
      <Button variant="outline" @click="list?.scrollToOffset(0)">回到顶部</Button>
      <Text as="span" size="sm" tone="muted" class="tabular-nums">
        可见 {{ range.startIndex + 1 }}–{{ range.endIndex + 1 }}
      </Text>
    </Inline>
    <VirtualList
      ref="list"
      :items="items"
      :get-key="item => item.id"
      :dynamic="false"
      :estimate-size="48"
      :height="288"
      label="可跳转列表"
      class="border-line rounded-lg border"
      @range-change="range = $event"
    >
      <template #default="{ item }">
        <Inline gap="none" class="border-line h-full border-b px-4">
          <Text size="sm">{{ item.label }}</Text>
        </Inline>
      </template>
    </VirtualList>
  </Stack>
</template>
