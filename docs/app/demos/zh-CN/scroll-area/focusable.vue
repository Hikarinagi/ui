<script setup lang="ts">
  import { ScrollArea, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <ScrollArea focusable label="更新说明" class="bg-inset h-32 w-full max-w-sm rounded-md">
    <Stack class="p-4">
      <Text v-for="i in 10" :key="i">第 {{ i }} 行</Text>
    </Stack>
  </ScrollArea>
</template>
