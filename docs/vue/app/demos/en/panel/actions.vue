<script setup lang="ts">
  import { Button, Panel, Text } from '@hina-ui/vue'
</script>

<template>
  <Panel title="Email notifications" class="w-96">
    <template #actions>
      <Button size="sm" variant="outline" tone="neutral">Send a test</Button>
      <Button size="sm">Save</Button>
    </template>
    <Text>Send an email for new replies, followers and direct messages.</Text>
  </Panel>
</template>
