<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {
    Anchor,
    Button,
    Heading,
    Inline,
    ScrollArea,
    Section,
    Stack,
    Tag,
    Text,
  } from '@hina-ui/vue'

  const modified = ref(true)
  const items = computed(() => [
    { id: 'trailing-a', label: '条目 A', modified: modified.value },
    {
      id: 'trailing-b',
      label: '条目 B',
      modified: false,
      children: [{ id: 'trailing-c', label: '子条目', modified: true }],
    },
  ])
  const sections = computed(() => items.value.flatMap(item => [item, ...(item.children ?? [])]))
</script>

<template>
  <Stack gap="md" class="w-full max-w-2xl">
    <Inline>
      <Button variant="soft" tone="neutral" :aria-pressed="modified" @click="modified = !modified">
        切换条目 A 的标记
      </Button>
    </Inline>
    <Inline gap="lg" align="start" :wrap="false">
      <ScrollArea class="border-line h-56 min-w-0 flex-1 rounded-lg border">
        <Section v-for="item in sections" :id="item.id" :key="item.id" class="min-h-40 p-4">
          <Heading :level="3" size="sm">{{ item.label }}</Heading>
          <Text size="sm" tone="muted">这一节的正文。</Text>
        </Section>
      </ScrollArea>
      <Anchor :items="items" label="带尾部标记的目录" class="w-44 shrink-0">
        <template #trailing="{ item, active }">
          <Tag v-if="item.modified" :tone="active ? 'accent' : 'neutral'">已修改</Tag>
        </template>
      </Anchor>
    </Inline>
  </Stack>
</template>
