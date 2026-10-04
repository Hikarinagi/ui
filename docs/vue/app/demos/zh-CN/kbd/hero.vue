<script setup lang="ts">
  import { Inline, Kbd, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <Text>打开命令面板</Text>
    <Inline align="center" gap="xs">
      <Kbd>Ctrl</Kbd>
      <Text tone="faint">+</Text>
      <Kbd>K</Kbd>
    </Inline>
  </Inline>
</template>
