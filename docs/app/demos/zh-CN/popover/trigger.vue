<script setup lang="ts">
  import { Info } from '@lucide/vue'
  import { IconButton, Inline, Link, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Popover>
      <IconButton variant="ghost" tone="neutral" label="查看说明" :tooltip="false">
        <Info />
      </IconButton>
      <template #content>
        <Text size="sm">触发器是一个图标按钮。</Text>
      </template>
    </Popover>
    <Popover align="start">
      <Link href="#">星见书音</Link>
      <template #content>
        <Text size="sm">触发器是一段行内的链接文字。</Text>
      </template>
    </Popover>
  </Inline>
</template>
