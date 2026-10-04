<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="Hidden close button" :closable="false">
    <Button variant="outline" tone="neutral">Hidden close button</Button>
    <template #content>
      <Text>Press Escape, click the scrim or use the footer button to close.</Text>
    </template>
    <template #footer="{ close }">
      <Button @click="close">Close</Button>
    </template>
  </Dialog>
</template>
