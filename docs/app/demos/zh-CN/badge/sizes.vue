<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="8" size="sm">
      <IconButton label="通知" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
    <Badge :content="8" size="md">
      <IconButton label="通知" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
  </Inline>
</template>
