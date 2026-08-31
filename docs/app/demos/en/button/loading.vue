<script setup lang="ts">
  import { ArrowRight, Save } from '@lucide/vue'
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button loading>Save</Button>
    <Button loading variant="soft">
      <template #icon>
        <Save />
      </template>
      Save
    </Button>
    <Button loading variant="outline" tone="neutral">
      Next
      <template #trailing>
        <ArrowRight />
      </template>
    </Button>
  </Inline>
</template>
