<script setup lang="ts">
  import { Settings2 } from '@lucide/vue'
  import { Button, Heading, Input, Popover, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Popover align="start">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <Settings2 />
      </template>
      阅读设置
    </Button>
    <template #content>
      <Stack gap="sm" class="w-60">
        <Stack gap="xs">
          <Heading :level="4" size="sm">阅读设置</Heading>
          <Text tone="muted" size="sm">调整正文的宽度与行距。</Text>
        </Stack>
        <Stack gap="xs">
          <Text size="sm">正文宽度</Text>
          <Input model-value="720" size="sm" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">行距</Text>
          <Input model-value="1.8" size="sm" />
        </Stack>
        <Button size="sm">保存</Button>
      </Stack>
    </template>
  </Popover>
</template>
