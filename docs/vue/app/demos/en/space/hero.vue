<script setup lang="ts">
  import { Bell, Search } from '@lucide/vue'
  import { Card, Heading, IconButton, Inline, Space, Tag } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-lg">
    <Inline>
      <Heading :level="3" size="md">Library</Heading>
      <Tag>128 books</Tag>
      <Space />
      <IconButton label="Search" variant="ghost">
        <Search />
      </IconButton>
      <IconButton label="Notifications" variant="ghost">
        <Bell />
      </IconButton>
    </Inline>
  </Card>
</template>
