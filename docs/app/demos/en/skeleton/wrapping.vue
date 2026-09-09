<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Skeleton, Stack, Text } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Inline>
      <Skeleton :loading="loading">
        <Text>ATRI</Text>
      </Skeleton>
      <Skeleton :loading="loading">
        <Text tone="muted" size="sm">Chapter 42</Text>
      </Skeleton>
    </Inline>
    <Button size="sm" variant="soft" tone="neutral" @click="loading = !loading">
      {{ loading ? 'Loaded' : 'Loading' }}
    </Button>
  </Stack>
</template>
