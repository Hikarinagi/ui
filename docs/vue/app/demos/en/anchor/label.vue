<script setup lang="ts">
  import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const items = [
    { id: 'label-a', label: 'Version 1.2' },
    { id: 'label-b', label: 'Version 1.1' },
    { id: 'label-c', label: 'Version 1.0' },
  ]
</script>

<template>
  <Inline gap="lg" align="start" class="w-full max-w-2xl">
    <ScrollArea class="border-line h-56 flex-1 rounded-lg border">
      <Section v-for="item in items" :id="item.id" :key="item.id" class="min-h-40 p-4">
        <Heading :level="3" size="sm">{{ item.label }}</Heading>
        <Text size="sm" tone="muted">What changed in this version.</Text>
      </Section>
    </ScrollArea>
    <Anchor :items="items" label="Version contents" class="w-28 shrink-0" />
  </Inline>
</template>
