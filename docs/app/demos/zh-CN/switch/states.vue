<script setup lang="ts">
  import { Switch, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Switch invalid>必须开启才能继续</Switch>
    <Switch disabled>已禁用</Switch>
    <Switch disabled model-value>已禁用且开启</Switch>
  </Stack>
</template>
