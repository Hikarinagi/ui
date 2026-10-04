<script setup lang="ts">
  import { Button, Drawer, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Drawer title="From the start edge" side="start">
      <Button variant="outline" tone="neutral">start</Button>
      <template #content>
        <Text>The left edge in English, the right edge in a right-to-left language.</Text>
      </template>
    </Drawer>
    <Drawer title="From the end edge" side="end">
      <Button variant="outline" tone="neutral">end</Button>
      <template #content>
        <Text>The default, which is the right edge in English.</Text>
      </template>
    </Drawer>
  </Inline>
</template>
