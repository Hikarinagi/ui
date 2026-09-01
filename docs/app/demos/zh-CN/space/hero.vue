<script setup lang="ts">
  import { Bell, Search } from '@lucide/vue'
  import { Card, Heading, IconButton, Inline, Space, Tag } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-lg">
    <Inline>
      <Heading :level="3" size="md">书库</Heading>
      <Tag>128 本</Tag>
      <Space />
      <IconButton label="搜索" variant="ghost">
        <Search />
      </IconButton>
      <IconButton label="通知" variant="ghost">
        <Bell />
      </IconButton>
    </Inline>
  </Card>
</template>
