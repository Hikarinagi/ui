<script setup lang="ts">
  import { Avatar, Badge, Indicator, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline gap="lg">
    <Badge content="online" bare label="在线" placement="bottom-end" shape="circle">
      <template #content>
        <Indicator tone="success" size="lg" />
      </template>
      <Avatar src="/avatars/paper.webp" alt="星见书音" />
    </Badge>
    <Badge content="away" bare label="离开" placement="bottom-end" shape="circle">
      <template #content>
        <Indicator tone="warning" size="lg" />
      </template>
      <Avatar name="星见书音" />
    </Badge>
  </Inline>
</template>
