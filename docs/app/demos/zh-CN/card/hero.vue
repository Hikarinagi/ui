<script setup lang="ts">
  import { Button, Card, Divider, Heading, Inline, Stack, Tag, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack>
      <Stack gap="xs">
        <Inline justify="between" align="start" :wrap="false">
          <Heading :level="3" size="md">夏空的彼端</Heading>
          <Tag tone="success">连载中</Tag>
        </Inline>
        <Text tone="muted" size="sm">转学第一天，我在天台遇见了那个抱着旧相机的少女。</Text>
      </Stack>
      <Divider />
      <Inline justify="between">
        <Text tone="faint" size="sm">全 12 卷</Text>
        <Button variant="ghost" tone="neutral" size="sm">查看</Button>
      </Inline>
    </Stack>
  </Card>
</template>
