<script setup lang="ts">
  import { Button, Divider, Popover, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Popover :padded="false" align="start">
    <Button variant="outline" tone="neutral">Latest update</Button>
    <template #content>
      <Stack gap="none" class="w-64">
        <Stack gap="none" class="bg-inset px-4 py-3">
          <Text size="sm" class="font-medium">Chapter 42 Dawn of the Observer</Text>
        </Stack>
        <Divider />
        <Stack gap="xs" class="px-4 py-3">
          <Text tone="muted" size="sm">Translated by Shion Hoshimi</Text>
          <Text tone="muted" size="sm">Updated three hours ago</Text>
        </Stack>
      </Stack>
    </template>
  </Popover>
</template>
