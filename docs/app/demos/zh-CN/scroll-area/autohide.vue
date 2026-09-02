<script setup lang="ts">
  import { ScrollArea, Stack, Text } from '@hina-ui/vue'

  const modes = ['never', 'scroll', 'leave', 'move'] as const
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Stack v-for="mode in modes" :key="mode" gap="xs">
      <Text tone="muted" size="sm">{{ mode }}</Text>
      <ScrollArea :auto-hide="mode" class="bg-inset h-24 rounded-md">
        <Stack class="p-4">
          <Text v-for="i in 8" :key="i">第 {{ i }} 行</Text>
        </Stack>
      </ScrollArea>
    </Stack>
  </Stack>
</template>
