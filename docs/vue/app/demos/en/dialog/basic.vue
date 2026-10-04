<script setup lang="ts">
  import { Button, Dialog, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="Publish this article" description="Everyone can see it once it is published.">
    <Button variant="outline" tone="neutral">Publish</Button>
    <template #content>
      <Text>The article appears on your homepage and in the timelines of your subscribers.</Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Not yet</Button>
      <Button @click="close">Publish</Button>
    </template>
  </Dialog>
</template>
