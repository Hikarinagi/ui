<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Heading, ScrollArea, ScrollTop, Stack, Text } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const sections = [
    {
      title: 'Set a clear action hierarchy',
      body: 'A region usually needs one primary action. Keep secondary actions near their content and move less common actions into a menu, keeping the usual path clear.',
    },
    {
      title: 'Provide visible feedback',
      body: 'Saving, uploading, and syncing all need feedback. Keep content visible while waiting and show the result when finished. Preserve input after a failure so users can retry.',
    },
    {
      title: 'Make long content easy to browse',
      body: 'Use headings for structure and spacing to separate paragraphs. Keep long lists at a stable scroll position and offer a way back to the beginning without forcing a scroll when content changes.',
    },
    {
      title: 'Support different input methods',
      body: 'Mouse, touch, and keyboard users should all be able to act. Keep focus visible, name icon buttons, and restore focus to a useful place when an overlay closes.',
    },
    {
      title: 'Reduce unnecessary motion',
      body: 'Motion explains changes in state and position. When reduced motion is enabled, keep the outcome while allowing users to skip scrolling and movement animations.',
    },
    {
      title: 'Check realistic scenarios',
      body: 'Try longer labels, narrow the window, use the keyboard, and check dark mode. A component is ready when these scenarios work as well as the basic example.',
    },
  ]
</script>

<template>
  <Stack class="w-full max-w-lg" gap="sm">
    <Text size="sm" tone="muted">
      Scroll inside the panel. The back-to-top button appears after 120px.
    </Text>
    <Card :padded="false" class="relative overflow-hidden">
      <ScrollArea
        ref="area"
        class="h-72"
        :shadow="false"
        focusable
        label="Interaction design notes"
      >
        <Stack gap="lg" class="p-5 pb-24">
          <Stack v-for="section in sections" :key="section.title" gap="sm">
            <Heading :level="3" size="base">{{ section.title }}</Heading>
            <Text size="sm" tone="muted">{{ section.body }}</Text>
          </Stack>
        </Stack>
      </ScrollArea>
      <ScrollTop :target="() => area?.viewport" :threshold="120" position="absolute" :offset="16" />
    </Card>
  </Stack>
</template>
