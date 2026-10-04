<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack } from '@hina-ui/vue'
  const name = ref('Hina')
</script>
<template>
  <Stack class="w-full max-w-2xl resize-x overflow-auto p-2">
    <FormField
      label="Display name"
      orientation="responsive"
      description="Resize this panel: fields stack below 32rem."
    >
      <Input v-model="name" />
    </FormField>
  </Stack>
</template>
