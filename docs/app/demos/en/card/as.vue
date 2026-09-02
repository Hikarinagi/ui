<script setup lang="ts">
  import { Card, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Card as="article">
      <Text>Use article for content that stands on its own</Text>
    </Card>
    <Card as="section">
      <Text>Use section for a block within the page</Text>
    </Card>
  </Stack>
</template>
