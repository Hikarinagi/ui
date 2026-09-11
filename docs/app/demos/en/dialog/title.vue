<script setup lang="ts">
  import { Settings } from '@lucide/vue'
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="Dialog title">
    <Button variant="outline" tone="neutral">Title slots</Button>
    <template #icon><Settings /></template>
    <template #title>Custom title</template>
    <template #content>
      <Text>The icon and title content are provided through separate slots.</Text>
    </template>
  </Dialog>
</template>
