<script setup lang="ts">
  import { ref } from 'vue'
  import { Bell } from '@lucide/vue'
  import { Badge, Button, IconButton, Inline } from '@hikarinagi/ui'

  const count = ref(2)
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="count" :label="`${count} unread`">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
    <Inline align="center">
      <Button variant="outline" tone="neutral" size="sm" @click="count = Math.max(0, count - 1)">
        Fewer
      </Button>
      <Button variant="outline" tone="neutral" size="sm" @click="count += 1">More</Button>
    </Inline>
  </Inline>
</template>
