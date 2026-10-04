<script setup lang="ts">
  import { MessageSquare } from '@lucide/vue'
  import { Panel, Text } from '@hina-ui/vue'
</script>

<template>
  <Panel title="Comments" :count="128" class="w-96">
    <template #icon><MessageSquare /></template>
    <Text>Newest first.</Text>
  </Panel>
</template>
