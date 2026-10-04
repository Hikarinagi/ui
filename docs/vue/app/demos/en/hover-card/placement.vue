<script setup lang="ts">
  import { HoverCard, Inline, Link, Text } from '@hina-ui/vue'

  const sides = ['top', 'right', 'bottom', 'left'] as const
  const names = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' }
</script>

<template>
  <Inline gap="lg">
    <HoverCard v-for="side in sides" :key="side" :side="side">
      <Link href="#">{{ names[side] }}</Link>
      <template #content>
        <Text size="sm">A card floating out on the {{ names[side].toLowerCase() }}.</Text>
      </template>
    </HoverCard>
  </Inline>
</template>
