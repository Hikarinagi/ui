<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge
      v-for="tone in ['danger', 'accent', 'neutral', 'success', 'warning', 'info'] as const"
      :key="tone"
      :content="6"
      :tone="tone"
    >
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
  </Inline>
</template>
