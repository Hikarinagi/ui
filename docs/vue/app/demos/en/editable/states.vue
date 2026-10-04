<script setup lang="ts">
  import { Editable, FormField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Editable size="sm" model-value="Small text" aria-label="Small" />
    <Editable size="md" model-value="Default text" aria-label="Default" />
    <Editable size="lg" model-value="Large text" aria-label="Large" />
    <FormField label="Read only" description="Text can still be selected and copied.">
      <Editable model-value="Read-only project name" readonly />
    </FormField>
    <FormField label="Disabled">
      <Editable model-value="Editing unavailable" disabled />
    </FormField>
    <FormField label="Empty value">
      <Editable placeholder="Add a note…" />
    </FormField>
  </Stack>
</template>
