<script setup lang="ts">
  import { Switch, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Switch size="sm" model-value>小号</Switch>
    <Switch size="md" model-value>中号</Switch>
    <Switch size="lg" model-value>大号</Switch>
  </Stack>
</template>
