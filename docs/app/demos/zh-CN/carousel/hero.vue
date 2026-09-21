<script setup lang="ts">
  import { ref } from 'vue'
  import { Carousel, Card, Image, Link, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN').slice(0, 5)
  const index = ref(0)
</script>
<template>
  <Carousel
    v-model:index="index"
    :items="items"
    :get-key="item => item.id"
    label="精选视觉小说"
    indicators
    class="max-w-2xl"
  >
    <template #default="{ item }">
      <Card
        :padded="false"
        class="grid h-full grid-cols-1 overflow-hidden shadow-none @min-[480px]/hn-carousel:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <Image
          :src="item.cover.src"
          :alt="item.title"
          :draggable="false"
          class="aspect-[4/3] @min-[480px]/hn-carousel:aspect-[3/4]"
          image-class="absolute inset-0"
        />
        <Stack gap="sm" justify="center" class="min-w-0 px-4 py-5 @min-[480px]/hn-carousel:px-8">
          <Text as="h3" size="lg" weight="medium" class="line-clamp-2">{{ item.title }}</Text>
          <Text size="sm" tone="muted" class="line-clamp-2">{{ item.developer }}</Text>
          <Text as="time" :datetime="item.released" size="xs" tone="muted">
            {{ item.released }}
          </Text>
          <Link
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 w-fit text-sm"
          >
            查看作品
          </Link>
        </Stack>
      </Card>
    </template>
  </Carousel>
</template>
