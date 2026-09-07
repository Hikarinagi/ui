<script setup lang="ts">
  import { Banner, Button } from '@hina-ui/vue'
</script>

<template>
  <Banner tone="warning">
    登录状态将在 5 分钟后过期。
    <template #actions>
      <Button size="sm" tone="neutral">延长登录</Button>
    </template>
  </Banner>
</template>
