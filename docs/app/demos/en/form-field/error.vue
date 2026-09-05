<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack, Switch } from '@hina-ui/vue'

  const email = ref('shion@example')
  const failed = ref(true)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="failed">Show the error</Switch>
    <FormField label="Email" :error="failed ? 'The email is not valid' : undefined">
      <Input v-model="email" type="email" />
    </FormField>
  </Stack>
</template>
