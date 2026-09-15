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
    { id: 'trailing-a', label: 'Entry A', modified: modified.value },
    {
      id: 'trailing-b',
      label: 'Entry B',
      modified: false,
      children: [{ id: 'trailing-c', label: 'Child entry', modified: true }],
    },
  ])
  const sections = computed(() => items.value.flatMap(item => [item, ...(item.children ?? [])]))
</script>

<template>
  <Stack gap="md" class="w-full max-w-2xl">
    <Inline>
      <Button variant="soft" tone="neutral" :aria-pressed="modified" @click="modified = !modified">
        Toggle the mark on entry A
      </Button>
    </Inline>
    <Inline gap="lg" align="start" :wrap="false">
      <ScrollArea class="border-line h-56 min-w-0 flex-1 rounded-lg border">
        <Section v-for="item in sections" :id="item.id" :key="item.id" class="min-h-40 p-4">
          <Heading :level="3" size="sm">{{ item.label }}</Heading>
          <Text size="sm" tone="muted">The content of this section.</Text>
        </Section>
      </ScrollArea>
      <Anchor :items="items" label="Contents with trailing marks" class="w-44 shrink-0">
        <template #trailing="{ item, active }">
          <Tag v-if="item.modified" :tone="active ? 'accent' : 'neutral'">Modified</Tag>
        </template>
      </Anchor>
    </Inline>
  </Stack>
</template>
