<script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import {
    Carousel,
    FormField,
    IconButton,
    Image,
    Inline,
    Link,
    Slider,
    Stack,
    Switch,
    Text,
  } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const library = dataListDemo('zh-CN')
  const items = [0, 3, 10, 5, 11, 6, 4, 8].map(index => library[index]!)
  const width = ref(100)
  const rtl = ref(false)
</script>
<template>
  <Stack class="w-full max-w-2xl" data-demo-carousel-grouped>
    <Inline gap="lg" align="end">
      <FormField label="容器宽度" class="min-w-40 flex-1">
        <Slider v-model="width" :min="50" :max="100" :format="value => value + '%'" />
      </FormField>
      <Switch v-model="rtl" class="mb-1">从右向左（RTL）</Switch>
    </Inline>
    <Text size="sm" tone="muted">
      竖版、方形、横版封面保留各自比例。拖动滑块改变容器宽度，观察分组变化。
    </Text>
    <Carousel
      :items="items"
      :get-key="item => item.id"
      :dir="rtl ? 'rtl' : 'ltr'"
      slides-to-scroll="auto"
      item-class="basis-auto"
      label="浏览书库"
      class="self-center"
      :style="{ width: width + '%' }"
    >
      <template #default="{ item }">
        <Stack
          gap="sm"
          class="h-full"
          :style="{ width: `min(${(192 * item.cover.width) / item.cover.height}px, 100cqw)` }"
        >
          <Image
            :src="item.cover.src"
            :alt="item.title"
            :ratio="item.cover.width / item.cover.height"
            :draggable="false"
            class="rounded-lg"
          />
          <Link
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            tone="neutral"
            class="line-clamp-2 w-fit max-w-full text-sm"
          >
            {{ item.title }}
          </Link>
          <Text size="xs" tone="muted" truncate>{{ item.developer }}</Text>
        </Stack>
      </template>
      <template #controls="{ prev, next, canPrev, canNext, index, snapCount }">
        <Inline justify="between" class="w-full">
          <Text size="sm" tone="muted" dir="ltr">
            {{ snapCount ? `${index + 1} / ${snapCount}` : '—' }}
          </Text>
          <Inline gap="xs">
            <IconButton label="上一组" :disabled="!canPrev" @click="prev">
              <ChevronLeft class="rtl:rotate-180" />
            </IconButton>
            <IconButton label="下一组" :disabled="!canNext" @click="next">
              <ChevronRight class="rtl:rotate-180" />
            </IconButton>
          </Inline>
        </Inline>
      </template>
    </Carousel>
  </Stack>
</template>
