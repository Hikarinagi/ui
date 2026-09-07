<script setup lang="ts">
  import { Button, Empty, Image } from '@hina-ui/vue'
</script>

<template>
  <Empty title="收件箱空空如也" description="新的通知会第一时间送到这里。" class="w-96">
    <template #icon>
      <Image src="/avatars/peek.webp" :ratio="1" class="size-24 rounded-full" />
    </template>
    <template #actions>
      <Button size="sm" variant="soft" tone="neutral">通知设置</Button>
    </template>
  </Empty>
</template>
