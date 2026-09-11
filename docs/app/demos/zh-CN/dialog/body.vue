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
  <Dialog title="自定义布局" size="lg">
    <Button variant="outline" tone="neutral">自定义布局</Button>
    <template #body="{ close }">
      <Stack class="h-[28rem] min-h-0 gap-0">
        <Inline justify="between" align="center" class="border-line shrink-0 border-b p-4">
          <Heading :level="2" size="lg">自定义布局</Heading>
          <CloseButton @click="close" />
        </Inline>
        <ScrollArea class="min-h-0 flex-1">
          <Stack class="p-4">
            <Text v-for="index in 12" :key="index">正文段落 {{ index }}</Text>
          </Stack>
        </ScrollArea>
        <Inline justify="end" class="border-line shrink-0 border-t p-4">
          <Button @click="close">关闭</Button>
        </Inline>
      </Stack>
    </template>
  </Dialog>
</template>
