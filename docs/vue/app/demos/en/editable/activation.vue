<script setup lang="ts">
  import { reactive } from 'vue'
  import { Editable, FormField, Stack } from '@hina-ui/vue'

  const values = reactive({
    double: 'Double-click to rename this document',
    manual: 'Use the edit button to make changes',
  })
</script>

<template>
  <Stack class="w-full max-w-sm" gap="lg">
    <FormField
      label="Double click"
      description="Press Enter or Space when focused to edit with a keyboard."
    >
      <Editable v-model="values.double" activation-mode="dblclick" />
    </FormField>
    <FormField
      label="Manual activation"
      description="The draft stays open until you save or cancel."
    >
      <Editable v-model="values.manual" activation-mode="manual" submit-mode="manual" />
    </FormField>
  </Stack>
</template>
