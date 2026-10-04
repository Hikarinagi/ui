<script setup lang="ts">
  import { Card, Center, Inline, Ripple, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch" class="w-full">
    <Card class="hn-interactive relative isolate flex-1 cursor-pointer overflow-hidden">
      <Ripple />
      <Center class="h-20">
        <Text size="sm" tone="muted">Pressable</Text>
      </Center>
    </Card>

    <Card class="relative isolate flex-1 overflow-hidden">
      <Ripple disabled />
      <Center class="h-20">
        <Text size="sm" tone="faint">disabled — no ripple</Text>
      </Center>
    </Card>
  </Inline>
</template>
