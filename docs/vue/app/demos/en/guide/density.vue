<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@lucide/vue'
  import { Button, IconButton, Inline, Input, Stack, Tag } from '@hina-ui/vue'

  const compact = ref(false)
</script>

<template>
  <Stack align="center">
    <Button variant="outline" tone="neutral" size="sm" @click="compact = !compact">
      {{ compact ? 'Back to default density' : 'Switch to compact' }}
    </Button>

    <Inline :data-density="compact ? 'compact' : undefined" align="center">
      <Input placeholder="Search" />
      <Button>Submit</Button>
      <Button variant="outline" tone="neutral">Reset</Button>
      <IconButton label="Search" variant="outline">
        <Search />
      </IconButton>
      <Tag>Draft</Tag>
    </Inline>
  </Stack>
</template>
