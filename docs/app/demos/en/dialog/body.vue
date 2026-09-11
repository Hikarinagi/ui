<script setup lang="ts">
  import {
    Button,
    CloseButton,
    Dialog,
    Heading,
    Inline,
    ScrollArea,
    Stack,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="Custom layout" size="lg">
    <Button variant="outline" tone="neutral">Custom layout</Button>
    <template #body="{ close }">
      <Stack class="h-[28rem] min-h-0 gap-0">
        <Inline justify="between" align="center" class="border-line shrink-0 border-b p-4">
          <Heading :level="2" size="lg">Custom layout</Heading>
          <CloseButton @click="close" />
        </Inline>
        <ScrollArea class="min-h-0 flex-1">
          <Stack class="p-4">
            <Text v-for="index in 12" :key="index">Paragraph {{ index }}</Text>
          </Stack>
        </ScrollArea>
        <Inline justify="end" class="border-line shrink-0 border-t p-4">
          <Button @click="close">Close</Button>
        </Inline>
      </Stack>
    </template>
  </Dialog>
</template>
