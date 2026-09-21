<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Anchor, Heading, Inline, ScrollArea, Section, Stack, Switch, Text } from '@hina-ui/vue'

  const topics = [
    'Background',
    'Design process',
    'Implementation',
    'User experience',
    'Conclusions',
  ]
  const items = Array.from({ length: 51 }, (_, index) => ({
    id: `long-toc-${index + 1}`,
    label: `${index + 1}. ${topics[index % topics.length]}`,
  }))
  const autoScroll = ref(true)
  const current = ref<string>()
  const currentLabel = computed(() => items.find(item => item.id === current.value)?.label)
</script>

<template>
  <Stack class="w-full max-w-2xl">
    <Inline justify="between">
      <Switch v-model="autoScroll">Follow current entry</Switch>
      <Text size="sm" tone="muted">51 sections</Text>
    </Inline>
    <Inline align="start" gap="md" :wrap="false">
      <ScrollArea
        class="border-line h-80 min-w-0 flex-1 rounded-lg border"
        focusable
        label="Article content"
      >
        <Section v-for="item in items" :id="item.id" :key="item.id" class="min-h-56 p-4">
          <Heading :level="3" size="sm">{{ item.label }}</Heading>
          <Text size="sm" tone="muted">
            Scroll through the article to keep its current entry visible in the contents. You can
            also browse the contents independently to find another section.
          </Text>
        </Section>
      </ScrollArea>
      <ScrollArea
        class="h-80 w-2/5 max-w-48 shrink-0"
        :shadow="false"
        focusable
        label="Scrollable article contents"
      >
        <Anchor
          :items="items"
          :auto-scroll="autoScroll"
          label="Long article contents"
          @change="current = $event"
        />
      </ScrollArea>
    </Inline>
    <Text size="sm" tone="muted">
      Current: {{ currentLabel ?? 'Article is outside the reading area' }}
    </Text>
  </Stack>
</template>
