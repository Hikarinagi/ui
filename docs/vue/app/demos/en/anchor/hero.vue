<script setup lang="ts">
  import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const sections = [
    { id: 'hero-intro', label: 'Overview' },
    { id: 'hero-install', label: 'Installation' },
    { id: 'hero-usage', label: 'Usage' },
  ]
</script>

<template>
  <Inline gap="lg" align="start" class="w-full max-w-2xl">
    <ScrollArea class="border-line h-56 flex-1 rounded-lg border">
      <Section v-for="s in sections" :id="s.id" :key="s.id" class="min-h-40 p-4">
        <Heading :level="3" size="sm">{{ s.label }}</Heading>
        <Text size="sm" tone="muted">
          Scroll this area and the entries on the right follow along.
        </Text>
      </Section>
    </ScrollArea>
    <Anchor :items="sections" class="w-28 shrink-0" />
  </Inline>
</template>
