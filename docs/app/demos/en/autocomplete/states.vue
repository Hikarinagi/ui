<script setup lang="ts">
  import { Autocomplete, FormField, Stack } from '@hina-ui/vue'
  const options = [
    { value: 'http', label: 'entry:http' },
    { value: 'rpc', label: 'entry:rpc' },
  ]
</script>

<template>
  <Stack class="w-full max-w-sm" gap="lg">
    <FormField label="Small">
      <Autocomplete :options="options" size="sm" placeholder="Type a query" />
    </FormField>
    <FormField label="Secondary">
      <Autocomplete :options="options" variant="secondary" placeholder="Type a query" />
    </FormField>
    <FormField label="Large">
      <Autocomplete :options="options" size="lg" placeholder="Type a query" />
    </FormField>
    <FormField label="Invalid" error="Enter a status value.">
      <Autocomplete :options="[]" model-value="status:" />
    </FormField>
    <FormField label="Read only">
      <Autocomplete :options="options" model-value="entry:http" readonly />
    </FormField>
    <FormField label="Disabled" disabled>
      <Autocomplete :options="options" model-value="entry:http" />
    </FormField>
  </Stack>
</template>
