<script setup lang="ts">
  import { ref } from 'vue'
  import { Carousel, Image, Inline, Progress, SegmentedControl, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('en').slice(0, 4)
  const mode = ref('thumbnails')
  const index = ref(0)
  const options = [
    { value: 'capsule', label: 'Default' },
    { value: 'thumbnails', label: 'Thumbnails' },
    { value: 'progress', label: 'Progress' },
  ]
</script>
<template>
  <Stack class="w-full max-w-lg" data-demo-carousel-indicators>
    <SegmentedControl
      v-model="mode"
      :options="options"
      aria-label="Indicator style"
      size="sm"
      class="self-center"
    />
    <Carousel
      v-model:index="index"
      :items="items"
      :get-key="item => item.id"
      indicators
      label="Custom cover gallery"
    >
      <template #default="{ item }">
        <Image
          :src="item.cover.src"
          :alt="item.title"
          :ratio="16 / 10"
          :draggable="false"
          class="rounded-xl"
        />
      </template>
      <template v-if="mode === 'thumbnails'" #indicator="{ index: position, active }">
        <Image
          :src="items[position]!.cover.src"
          alt=""
          :ratio="3 / 4"
          :lazy="false"
          :draggable="false"
          :class="`w-8 rounded-sm transition-opacity duration-(--hn-duration-base) motion-reduce:transition-none ${active ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-surface' : 'opacity-50'}`"
        />
      </template>
      <template v-if="mode === 'progress'" #indicators="{ index: position, snapCount }">
        <Inline gap="sm" :wrap="false" class="w-36">
          <Progress
            :value="position + 1"
            :max="Math.max(1, snapCount)"
            size="sm"
            aria-label="Gallery progress"
            class="flex-1"
          />
          <Text size="xs" tone="muted" dir="ltr" class="shrink-0 tabular-nums">
            {{ position + 1 }} / {{ snapCount }}
          </Text>
        </Inline>
      </template>
    </Carousel>
  </Stack>
</template>
