<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Popover, Stack, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline align="center">
    <Popover v-model:open="open">
      <Button variant="outline" tone="neutral">详情</Button>
      <template #content>
        <Stack gap="sm" class="w-56">
          <Text size="sm">这段内容可以从外部展开或者收起。</Text>
          <Button size="sm" variant="soft" tone="neutral" @click="open = false">知道了</Button>
        </Stack>
      </template>
    </Popover>
    <Button size="sm" variant="soft" tone="neutral" @click="open = !open">
      从外部{{ open ? '收起' : '展开' }}
    </Button>
    <Text tone="muted" size="sm">当前：{{ open ? '展开' : '收起' }}</Text>
  </Inline>
</template>
