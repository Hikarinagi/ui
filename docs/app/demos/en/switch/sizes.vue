<script setup lang="ts">
  import { Switch, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Switch size="sm" model-value>Small</Switch>
    <Switch size="md" model-value>Medium</Switch>
    <Switch size="lg" model-value>Large</Switch>
  </Stack>
</template>
