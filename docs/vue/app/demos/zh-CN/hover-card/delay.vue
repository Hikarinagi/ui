<script setup lang="ts">
  import { HoverCard, Inline, Link, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg">
    <HoverCard :open-delay="0" :close-delay="0">
      <Link href="#">立即浮出</Link>
      <template #content>
        <Text size="sm">没有延时，指针一到就出现。</Text>
      </template>
    </HoverCard>
    <HoverCard :open-delay="800" :close-delay="400">
      <Link href="#">停留久一点</Link>
      <template #content>
        <Text size="sm">停留 800 毫秒才出现，移开 400 毫秒后收回。</Text>
      </template>
    </HoverCard>
  </Inline>
</template>
