<script setup lang="ts">
  import { ScrollArea, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Stack gap="xs">
      <Text tone="muted" size="sm">带边缘阴影</Text>
      <ScrollArea class="bg-inset h-32 rounded-md">
        <Stack class="p-4">
          <Text v-for="i in 10" :key="i">第 {{ i }} 行</Text>
        </Stack>
      </ScrollArea>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">关闭边缘阴影</Text>
      <ScrollArea :shadow="false" class="bg-inset h-32 rounded-md">
        <Stack class="p-4">
          <Text v-for="i in 10" :key="i">第 {{ i }} 行</Text>
        </Stack>
      </ScrollArea>
    </Stack>
  </Stack>
</template>
