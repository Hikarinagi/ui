<script setup lang="ts">
  import { Button, CloseButton, Inline, Drawer, ScrollArea, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer
    title="Custom layout"
    description="The title and description remain available to assistive technology."
  >
    <Button variant="outline" tone="neutral">Custom panel</Button>
    <template #body="{ close }">
      <Stack gap="none" class="min-h-0 flex-1">
        <Inline
          justify="between"
          :wrap="false"
          class="border-line bg-inset shrink-0 gap-3 border-b p-4"
        >
          <Stack gap="xs" class="min-w-0">
            <Text weight="medium">Custom layout</Text>
            <Text size="sm" tone="muted">
              The slot provides the header, scroll area, and footer.
            </Text>
          </Stack>
          <CloseButton @click="close" />
        </Inline>
        <ScrollArea class="min-h-0 flex-1">
          <Stack gap="none" class="divide-line divide-y px-4">
            <Text v-for="index in 30" :key="index" class="py-3">Item {{ index }}</Text>
          </Stack>
        </ScrollArea>
        <Inline
          justify="between"
          :wrap="false"
          class="border-line shrink-0 gap-3 border-t p-4 pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]"
        >
          <Text size="sm" tone="muted">The footer stays visible</Text>
          <Button size="sm" @click="close">Done</Button>
        </Inline>
      </Stack>
    </template>
  </Drawer>
</template>
