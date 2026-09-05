<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, HoverCard, Inline, Link, Text } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="lg" align="center">
    <Button variant="outline" tone="neutral" :disabled="open" @click="open = true">打开卡片</Button>
    <HoverCard v-model:open="open">
      <Link href="#">查看预览</Link>
      <template #content>
        <Text size="sm">卡片由外部打开；指针移开、点击外部或者按 Esc 都会收回。</Text>
      </template>
    </HoverCard>
    <Text tone="muted" size="sm">{{ open ? '已打开' : '已收回' }}</Text>
  </Inline>
</template>
