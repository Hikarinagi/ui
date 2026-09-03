<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch, Stack, Text } from '@hina-ui/vue'

  const nsfw = ref(false)
</script>

<template>
  <Stack gap="sm">
    <Switch v-model="nsfw">Show mature content</Switch>
    <Text size="sm" tone="muted">Value: {{ nsfw }}</Text>
  </Stack>
</template>
