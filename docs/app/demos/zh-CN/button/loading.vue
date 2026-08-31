<script setup lang="ts">
  import { ArrowRight, Save } from '@lucide/vue'
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button loading>保存</Button>
    <Button loading variant="soft">
      <template #icon>
        <Save />
      </template>
      保存
    </Button>
    <Button loading variant="outline" tone="neutral">
      下一步
      <template #trailing>
        <ArrowRight />
      </template>
    </Button>
  </Inline>
</template>
