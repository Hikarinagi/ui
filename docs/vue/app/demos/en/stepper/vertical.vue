<script setup lang="ts">
  import { Stepper } from '@hina-ui/vue'

  const items = [
    { title: 'Step A', description: 'The first description' },
    { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
    { title: 'Step C', description: 'The final description' },
  ]
</script>

<template>
  <Stepper :items="items" :default-value="2" orientation="vertical" class="max-w-md" />
</template>
