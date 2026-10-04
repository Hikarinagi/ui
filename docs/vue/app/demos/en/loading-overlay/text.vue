<script setup lang="ts">
  import { Card, LoadingOverlay, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="relative h-40 w-96">
    <Text>Syncing the draft to the cloud.</Text>
    <LoadingOverlay visible text="Syncing" size="lg" />
  </Card>
</template>
