<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Editable, FormField, Stack, Text } from '@hina-ui/vue'

  const title = ref('Hina UI library')
  const description = ref('Consistent, restrained interactions for content sites and admin tools.')
</script>

<template>
  <Card class="w-full max-w-lg">
    <Stack gap="lg">
      <Text weight="medium">Project details</Text>
      <FormField label="Project name">
        <Editable v-model="title" :maxlength="60" />
      </FormField>
      <FormField label="Description">
        <Editable v-model="description" multiline :rows="3" />
      </FormField>
      <Text size="sm" tone="muted">
        Click text to edit. Enter saves and Esc cancels; use Ctrl / ⌘ + Enter for multiline text.
      </Text>
    </Stack>
  </Card>
</template>
