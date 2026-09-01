<script setup lang="ts">
  import { ScrollArea, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <ScrollArea class="bg-inset h-40 w-full max-w-sm rounded-md">
    <Stack class="p-4">
      <Text v-for="i in 12" :key="i">Line {{ i }}</Text>
    </Stack>
  </ScrollArea>
</template>
