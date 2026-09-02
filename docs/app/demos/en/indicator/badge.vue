<script setup lang="ts">
  import { Avatar, Badge, Indicator, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline gap="lg">
    <Badge content="online" bare label="Online" placement="bottom-end" shape="circle">
      <template #content>
        <Indicator tone="success" size="lg" />
      </template>
      <Avatar src="/avatars/paper.webp" alt="Hoshimi Shion" />
    </Badge>
    <Badge content="away" bare label="Away" placement="bottom-end" shape="circle">
      <template #content>
        <Indicator tone="warning" size="lg" />
      </template>
      <Avatar name="Hoshimi Shion" />
    </Badge>
  </Inline>
</template>
