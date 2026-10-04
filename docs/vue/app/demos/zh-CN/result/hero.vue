<script setup lang="ts">
  import { Button, Result } from '@hina-ui/vue'
</script>

<template>
  <Result status="success" title="书评已发布" description="其他读者现在可以看到它了。" class="w-96">
    <template #actions>
      <Button size="sm">查看书评</Button>
      <Button size="sm" variant="ghost" tone="neutral">回到书架</Button>
    </template>
  </Result>
</template>
