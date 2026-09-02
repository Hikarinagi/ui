<script setup lang="ts">
  import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const items = [
    { id: 'basic-a', label: 'Synopsis' },
    { id: 'basic-b', label: 'Characters' },
    { id: 'basic-c', label: 'Staff' },
  ]
</script>

<template>
  <Inline gap="lg" align="start" class="w-full max-w-2xl">
    <ScrollArea class="border-line h-56 flex-1 rounded-lg border">
      <Section v-for="item in items" :id="item.id" :key="item.id" class="min-h-40 p-4">
        <Heading :level="3" size="sm">{{ item.label }}</Heading>
        <Text size="sm" tone="muted">Body text for this section.</Text>
      </Section>
    </ScrollArea>
    <Anchor :items="items" class="w-28 shrink-0" />
  </Inline>
</template>
