<script setup lang="ts">
  import { Carousel, Card, Image, Link, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN').slice(0, 4)
</script>
<template>
  <Stack class="w-full max-w-lg">
    <Carousel
      :items="items"
      :get-key="item => item.id"
      loop
      :autoplay="4000"
      indicators
      label="阅读推荐"
    >
      <template #default="{ item }">
        <Card class="flex items-center gap-5 shadow-none">
          <Image
            :src="item.cover.src"
            alt=""
            :ratio="3 / 4"
            :draggable="false"
            class="w-24 shrink-0 rounded-md"
          />
          <Stack gap="sm" class="min-w-0">
            <Link
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              tone="neutral"
              class="line-clamp-2 w-fit font-medium"
            >
              {{ item.title }}
            </Link>
            <Text size="sm" tone="muted" class="line-clamp-2">{{ item.developer }}</Text>
          </Stack>
        </Card>
      </template>
    </Carousel>
    <Text size="sm" tone="muted">悬停时暂停；键盘进入或手动切换后，点击“开始自动播放”恢复。</Text>
  </Stack>
</template>
