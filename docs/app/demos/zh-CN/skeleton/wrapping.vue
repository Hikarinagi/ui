<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Skeleton, Stack, Text } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Inline>
      <Skeleton :loading="loading">
        <Text>星之彼方</Text>
      </Skeleton>
      <Skeleton :loading="loading">
        <Text tone="muted" size="sm">第 42 章</Text>
      </Skeleton>
    </Inline>
    <Button size="sm" variant="soft" tone="neutral" @click="loading = !loading">
      {{ loading ? '加载完成' : '重新加载' }}
    </Button>
  </Stack>
</template>
