<script setup lang="ts">
  import { reactive } from 'vue'
  import { Bookmark } from '@lucide/vue'
  import { DataList, Image, Link, Stack, Text, Toggle, Tooltip } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN')
  const saved = reactive<Record<number, boolean>>({})
</script>
<template>
  <DataList
    :items="items.slice(3, 6)"
    item-key="id"
    item-description="subtitle"
    layout="grid"
    layout-toggle
    grid-min="10rem"
    label="自定义条目"
    class="max-w-2xl"
  >
    <template #header><Text size="sm" tone="muted">3 条作品</Text></template>
    <template #title="{ item }">
      <Link :href="item.url" target="_blank" rel="noopener noreferrer" tone="neutral">
        {{ item.title }}
      </Link>
    </template>
    <template #media="{ item }">
      <Image :src="item.cover.src" alt="" fit="cover" class="size-full" />
    </template>
    <template #meta="{ item }">
      <Stack gap="xs" class="min-w-0 w-full">
        <Tooltip :content="item.developer">
          <Text size="xs" tone="muted" truncate class="w-fit max-w-full">{{ item.developer }}</Text>
        </Tooltip>
        <Text as="time" :datetime="item.released" size="xs" tone="muted">{{ item.released }}</Text>
      </Stack>
    </template>
    <template #actions="{ item }">
      <Toggle v-model="saved[item.id]" size="sm" :label="`标记 ${item.title}`" :tooltip="false">
        <template #icon="{ pressed }">
          <Bookmark :class="pressed ? 'fill-current' : undefined" />
        </template>
        {{ saved[item.id] ? '已标记' : '标记' }}
      </Toggle>
    </template>
  </DataList>
</template>
