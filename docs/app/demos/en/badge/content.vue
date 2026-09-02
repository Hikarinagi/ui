<script setup lang="ts">
  import { Bookmark, Check } from '@lucide/vue'
  import { Badge, IconButton } from '@hina-ui/vue'
</script>

<template>
  <Badge content="Done" tone="success" size="md" label="Done">
    <template #content>
      <Check class="size-3" />
    </template>
    <IconButton label="Bookmark" variant="soft">
      <Bookmark />
    </IconButton>
  </Badge>
</template>
