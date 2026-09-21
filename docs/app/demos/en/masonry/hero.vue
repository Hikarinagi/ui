<script setup lang="ts">
  import { Card, Image, ImageGroup, Masonry, Skeleton, Stack, Text } from '@hina-ui/vue'
  import { masonryGallery } from '../../masonry'
  const items = masonryGallery('en')
</script>

<template>
  <Stack class="w-full max-w-2xl" gap="sm">
    <Text size="sm" tone="muted">
      Covers in their original proportions. Select an image to preview it.
    </Text>
    <ImageGroup>
      <Masonry
        :items="items"
        :get-key="item => item.id"
        :min-column-width="160"
        gap="lg"
        label="Cover gallery"
      >
        <template #pending>
          <Stack aria-hidden="true" class="block columns-[160px] gap-[var(--hn-masonry-gap)]">
            <Card
              v-for="item in items"
              :key="item.id"
              :padded="false"
              class="mb-[var(--hn-masonry-row-gap)] break-inside-avoid"
            >
              <Skeleton
                class="w-full"
                :style="{ aspectRatio: item.cover.width / item.cover.height }"
              />
              <Stack class="p-3" gap="sm">
                <Skeleton class="h-4 w-2/3 rounded" />
                <Skeleton class="h-3 w-1/2 rounded" />
              </Stack>
            </Card>
          </Stack>
        </template>
        <template #default="{ item }">
          <Card :padded="false">
            <Image
              :src="item.cover.src"
              :alt="item.title"
              :ratio="item.cover.width / item.cover.height"
              :preview-size="item.cover"
              preview
              class="w-full rounded-t-xl"
            />
            <Stack class="p-3" gap="xs">
              <Text size="sm" weight="medium">{{ item.title }}</Text>
              <Text as="time" :datetime="item.released" size="xs" tone="muted">
                {{ item.released }}
              </Text>
            </Stack>
          </Card>
        </template>
      </Masonry>
    </ImageGroup>
  </Stack>
</template>
