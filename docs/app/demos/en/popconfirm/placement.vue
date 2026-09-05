<script setup lang="ts">
  import { Button, Inline, Popconfirm } from '@hina-ui/vue'

  const sides = ['top', 'right', 'bottom', 'left'] as const
  const names = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' }
</script>

<template>
  <Inline gap="sm">
    <Popconfirm v-for="side in sides" :key="side" title="Confirm this placement?" :side="side">
      <Button variant="outline" tone="neutral">{{ names[side] }}</Button>
    </Popconfirm>
  </Inline>
</template>
