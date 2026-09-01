<script setup lang="ts">
  import { Avatar, Button, Card, Inline, Stack, Tag, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Inline justify="between">
      <Inline gap="sm">
        <Avatar size="lg" src="/avatars/selfie.webp" alt="星见书音" />
        <Stack gap="none">
          <Text class="font-medium">星见书音</Text>
          <Text tone="muted" size="sm">译者</Text>
        </Stack>
      </Inline>
      <Inline gap="xs">
        <Tag>已认证</Tag>
        <Button size="sm" variant="soft" tone="neutral">关注</Button>
      </Inline>
    </Inline>
  </Card>
</template>
