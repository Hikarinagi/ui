<script setup lang="ts">
  import { Bell } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge
      v-for="placement in ['top-end', 'top-start', 'bottom-end', 'bottom-start'] as const"
      :key="placement"
      :content="2"
      :placement="placement"
    >
      <IconButton label="通知" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
  </Inline>
</template>
