<script setup lang="ts">
  import { Switch, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Switch invalid>Must be on to continue</Switch>
    <Switch disabled>Disabled</Switch>
    <Switch disabled model-value>Disabled and on</Switch>
  </Stack>
</template>
