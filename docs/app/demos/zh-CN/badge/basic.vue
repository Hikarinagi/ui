<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton } from '@hina-ui/vue'
</script>

<template>
  <Badge :content="5" label="5 条未读">
    <IconButton label="通知" variant="soft">
      <Bell />
    </IconButton>
  </Badge>
</template>
