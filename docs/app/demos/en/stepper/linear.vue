<script setup lang="ts">
  import { ref } from 'vue'
  import { Stepper, Stack, Switch } from '@hina-ui/vue'

  const linear = ref(true)
  const items = [
    { title: 'Step A', description: 'The first description' },
    { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
    { title: 'Step C', description: 'The final description' },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Switch v-model="linear">Linear navigation</Switch>
    <Stepper :items="items" :linear="linear" />
  </Stack>
</template>
