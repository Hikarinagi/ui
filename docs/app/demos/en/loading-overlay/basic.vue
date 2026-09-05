<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="loading">Show the overlay</Switch>
    <Card class="relative w-96">
      <Text>This content is dimmed and cannot be clicked while loading.</Text>
      <LoadingOverlay :visible="loading" />
    </Card>
  </Stack>
</template>
