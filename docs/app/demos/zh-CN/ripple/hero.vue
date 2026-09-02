<script setup lang="ts">
  import { Card, Center, Ripple, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="hn-interactive relative isolate w-full max-w-sm cursor-pointer overflow-hidden">
    <Ripple />
    <Center class="h-20">
      <Text size="sm" tone="muted">按住这块面板</Text>
    </Center>
  </Card>
</template>
