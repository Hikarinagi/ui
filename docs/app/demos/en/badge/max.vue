<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="99">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
    <Badge :content="1280">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
    <Badge :content="1280" :max="999">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
  </Inline>
</template>
