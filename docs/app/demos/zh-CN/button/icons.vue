<script setup lang="ts">
  import { ArrowRight, Plus, Settings } from '@lucide/vue'
  import { Button, IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button>
      <template #icon>
        <Plus />
      </template>
      新建
    </Button>
    <Button variant="outline" tone="neutral">
      下一步
      <template #trailing>
        <ArrowRight />
      </template>
    </Button>
    <IconButton label="设置" variant="outline">
      <Settings />
    </IconButton>
  </Inline>
</template>
