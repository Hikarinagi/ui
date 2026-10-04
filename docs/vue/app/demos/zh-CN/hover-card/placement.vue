<script setup lang="ts">
  import { HoverCard, Inline, Link, Text } from '@hina-ui/vue'

  const sides = ['top', 'right', 'bottom', 'left'] as const
  const names = { top: '上方', right: '右侧', bottom: '下方', left: '左侧' }
</script>

<template>
  <Inline gap="lg">
    <HoverCard v-for="side in sides" :key="side" :side="side">
      <Link href="#">{{ names[side] }}</Link>
      <template #content>
        <Text size="sm">从{{ names[side] }}浮出的卡片。</Text>
      </template>
    </HoverCard>
  </Inline>
</template>
