<script setup lang="ts">
  import { User } from '@lucide/vue'
  import { Badge, IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Badge :content="4">
      <IconButton label="Account" variant="soft" pill size="lg">
        <User />
      </IconButton>
    </Badge>
    <Badge :content="4" shape="circle">
      <IconButton label="Account" variant="soft" pill size="lg">
        <User />
      </IconButton>
    </Badge>
  </Inline>
</template>
