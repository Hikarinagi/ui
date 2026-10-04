<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="9">
      <IconButton label="Notifications" variant="solid" tone="accent" pill size="lg">
        <Bell />
      </IconButton>
    </Badge>
    <Badge :content="9" :outline="false">
      <IconButton label="Notifications" variant="solid" tone="accent" pill size="lg">
        <Bell />
      </IconButton>
    </Badge>
  </Inline>
</template>
