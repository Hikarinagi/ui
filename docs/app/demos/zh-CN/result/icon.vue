<script setup lang="ts">
  import { Button, Image, Result } from '@hina-ui/vue'
</script>

<template>
  <Result title="今天的目标完成了" description="连续第七天读满三十分钟。" class="w-96">
    <template #icon>
      <Image src="/avatars/hug.webp" :ratio="1" class="size-24 rounded-full" />
    </template>
    <template #actions>
      <Button size="sm">继续阅读</Button>
    </template>
  </Result>
</template>
