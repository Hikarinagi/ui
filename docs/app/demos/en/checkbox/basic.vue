<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox, Stack, Text } from '@hina-ui/vue'

  const remember = ref(false)
</script>

<template>
  <Stack gap="sm">
    <Checkbox v-model="remember">Keep me signed in</Checkbox>
    <Text size="sm" tone="muted">Value: {{ remember }}</Text>
  </Stack>
</template>
