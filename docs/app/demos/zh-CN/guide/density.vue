<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@lucide/vue'
  import { Button, IconButton, Inline, Input, Stack, Tag } from '@hina-ui/vue'

  const compact = ref(false)
</script>

<template>
  <Stack align="center">
    <Button variant="outline" tone="neutral" size="sm" @click="compact = !compact">
      {{ compact ? '切换回默认密度' : '切换到紧凑密度' }}
    </Button>

    <Inline :data-density="compact ? 'compact' : undefined" align="center">
      <Input placeholder="搜索" />
      <Button>提交</Button>
      <Button variant="outline" tone="neutral">重置</Button>
      <IconButton label="搜索" variant="outline">
        <Search />
      </IconButton>
      <Tag>草稿</Tag>
    </Inline>
  </Stack>
</template>
