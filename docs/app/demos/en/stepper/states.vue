<script setup lang="ts">
  import { Stepper, Stack, Switch } from '@hina-ui/vue'
  import { ref } from 'vue'

  const disabled = ref(false)
  const items = [
    { title: 'Completed', completed: true },
    { title: 'Needs attention', description: 'This step has an error', error: true },
    { title: 'Disabled', disabled: true },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Switch v-model="disabled">Disable all steps</Switch>
    <Stepper :items="items" :default-value="2" :linear="false" :disabled="disabled" />
  </Stack>
</template>
