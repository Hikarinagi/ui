<script setup lang="ts">
  import { Button, Divider, Popover, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Popover :padded="false" align="start">
    <Button variant="outline" tone="neutral">最近更新</Button>
    <template #content>
      <Stack gap="none" class="w-64">
        <Stack gap="none" class="bg-inset px-4 py-3">
          <Text size="sm" class="font-medium">第 42 话</Text>
        </Stack>
        <Divider />
        <Stack gap="xs" class="px-4 py-3">
          <Text tone="muted" size="sm">作者：支倉凍砂</Text>
          <Text tone="muted" size="sm">更新于三小时前</Text>
        </Stack>
      </Stack>
    </template>
  </Popover>
</template>
