<script setup lang="ts">
  import { ref } from 'vue'
  import { Avatar, Button, Card, Inline, Skeleton, Stack, Text } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Card>
      <Inline gap="sm" align="start">
        <Skeleton :loading="loading" class="rounded-full">
          <Avatar size="lg" src="/avatars/selfie.webp" alt="Shion Hoshimi" />
        </Skeleton>
        <Stack gap="xs" class="min-w-0 flex-1">
          <Skeleton :loading="loading">
            <Text class="font-medium">Shion Hoshimi</Text>
          </Skeleton>
          <Skeleton :loading="loading">
            <Text tone="muted" size="sm">Translated 128 light novels</Text>
          </Skeleton>
        </Stack>
      </Inline>
    </Card>
    <Button size="sm" variant="soft" tone="neutral" @click="loading = !loading">
      {{ loading ? 'Show the content' : 'Show the skeleton' }}
    </Button>
  </Stack>
</template>
