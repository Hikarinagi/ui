<script setup lang="ts">
  import { Carousel, Card, Image, Link, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('en').slice(0, 6)
</script>
<template>
  <Carousel
    :items="items"
    :get-key="item => item.id"
    orientation="vertical"
    viewport-class="h-72"
    item-class="basis-1/2"
    label="Reading queue"
    class="max-w-lg"
  >
    <template #default="{ item }">
      <Card class="flex h-full items-center gap-4 shadow-none">
        <Image
          :src="item.cover.src"
          alt=""
          :ratio="3 / 4"
          :draggable="false"
          class="w-16 shrink-0 rounded-md"
        />
        <Stack gap="xs" class="min-w-0">
          <Link
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            tone="neutral"
            class="line-clamp-2 w-fit text-sm font-medium"
          >
            {{ item.title }}
          </Link>
          <Text size="xs" tone="muted" truncate>{{ item.developer }}</Text>
          <Text as="time" :datetime="item.released" size="xs" tone="muted">
            {{ item.released }}
          </Text>
        </Stack>
      </Card>
    </template>
  </Carousel>
</template>
