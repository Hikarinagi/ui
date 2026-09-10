<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack } from '@hina-ui/vue'
  const name = ref('Hina')
  const email = ref('')
</script>
<template>
  <Stack class="w-full">
    <FormField
      label="Display name"
      orientation="responsive"
      description-placement="label"
      description="Shown on your public profile."
    >
      <Input v-model="name" />
    </FormField>
    <FormField
      label="Email address"
      orientation="responsive"
      description-placement="control"
      description="Use an address that can receive notifications."
      error="Enter an email address."
    >
      <Input v-model="email" type="email" />
    </FormField>
  </Stack>
</template>
