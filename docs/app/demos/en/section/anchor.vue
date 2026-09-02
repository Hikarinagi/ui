<script setup lang="ts">
  import { Anchor, Card, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const items = [
    { id: 'sec-intro', label: 'Overview' },
    { id: 'sec-cast', label: 'Characters' },
    { id: 'sec-staff', label: 'Staff' },
  ]
</script>

<template>
  <Inline gap="lg" align="start" class="w-full">
    <Card :padded="false" class="min-w-0 flex-1 overflow-hidden">
      <ScrollArea class="h-56">
        <Section v-for="item in items" :id="item.id" :key="item.id" :title="item.label" class="p-4">
          <Text size="sm" tone="muted">Body text for this section.</Text>
          <Text size="sm" tone="muted">
            Scrolling or clicking an entry on the right updates the current position.
          </Text>
        </Section>
      </ScrollArea>
    </Card>
    <Anchor :items="items" class="w-28 shrink-0" />
  </Inline>
</template>
