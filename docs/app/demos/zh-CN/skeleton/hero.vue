<script setup lang="ts">
  import { ref } from 'vue'
  import { Avatar, Button, Card, Inline, Skeleton, Stack, Text } from '@hikarinagi/ui'

  const loading = ref(true)
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Card>
      <Inline gap="sm" align="start">
        <Skeleton :loading="loading" class="rounded-full">
          <Avatar size="lg" src="/avatars/selfie.webp" alt="星见书音" />
        </Skeleton>
        <Stack gap="xs" class="min-w-0 flex-1">
          <Skeleton :loading="loading">
            <Text class="font-medium">星见书音</Text>
          </Skeleton>
          <Skeleton :loading="loading">
            <Text tone="muted" size="sm">翻译了 128 本轻小说</Text>
          </Skeleton>
        </Stack>
      </Inline>
    </Card>
    <Button size="sm" variant="soft" tone="neutral" @click="loading = !loading">
      {{ loading ? '显示内容' : '显示骨架' }}
    </Button>
  </Stack>
</template>
