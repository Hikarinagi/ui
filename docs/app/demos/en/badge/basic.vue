<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton } from '@hikarinagi/ui'
</script>

<template>
  <Badge :content="5" label="5 unread">
    <IconButton label="Notifications" variant="soft">
      <Bell />
    </IconButton>
  </Badge>
</template>
