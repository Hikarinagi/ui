<script setup lang="ts">
  import { Bell, Mail, MessageSquare } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="3">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
    <Badge :content="128" tone="accent">
      <IconButton label="Messages" variant="soft">
        <Mail />
      </IconButton>
    </Badge>
    <Badge content="NEW" tone="success" size="md">
      <IconButton label="Comments" variant="soft">
        <MessageSquare />
      </IconButton>
    </Badge>
  </Inline>
</template>
