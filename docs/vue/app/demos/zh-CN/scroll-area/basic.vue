<script setup lang="ts">
  import { ScrollArea, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <ScrollArea class="bg-inset h-40 w-full max-w-sm rounded-md">
    <Stack class="p-4">
      <Text v-for="i in 12" :key="i">第 {{ i }} 行</Text>
    </Stack>
  </ScrollArea>
</template>
