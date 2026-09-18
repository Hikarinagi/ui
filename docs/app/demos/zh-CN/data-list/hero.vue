<script setup lang="ts">
  import { DataList, Image, Stack, Text, Tooltip } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN')
</script>
<template>
  <DataList
    :items="items.slice(0, 3)"
    item-key="id"
    item-title="title"
    item-description="subtitle"
    :media-ratio="3 / 4"
    layout-toggle
    grid-min="10rem"
    label="作品"
    class="max-w-2xl"
  >
    <template #header><Text size="sm" tone="muted">3 条作品</Text></template>
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
  </DataList>
</template>
