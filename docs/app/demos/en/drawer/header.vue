<script setup lang="ts">
  import { Button, Drawer, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="Hidden header" :header="false">
    <Button variant="outline" tone="neutral">Hidden header</Button>
    <template #content>
      <Text>The title remains the accessible name; content and footer stay visible.</Text>
    </template>
    <template #footer="{ close }">
      <Button @click="close">Close</Button>
    </template>
  </Drawer>
</template>
