<script setup lang="ts">
  import { Card, ScrollArea, Stack, Text } from '@hina-ui/vue'

  const chapters = Array.from({ length: 24 }, (_, i) => `Chapter ${i + 1}`)
</script>

<template>
  <Card class="w-full max-w-xs" :padded="false">
    <ScrollArea class="h-64">
      <Stack gap="none" class="p-2">
        <Text v-for="chapter in chapters" :key="chapter" size="sm" class="px-3 py-2">
          {{ chapter }}
        </Text>
      </Stack>
    </ScrollArea>
  </Card>
</template>
