<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack, Textarea } from '@hina-ui/vue'

  const name = ref('')
  const bio = ref('')
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <FormField label="Nickname" description="Shown on your profile page and editable any time">
      <Input v-model="name" />
    </FormField>
    <FormField label="Bio">
      <Textarea v-model="bio" />
      <template #description>Up to 80 characters, line breaks allowed.</template>
    </FormField>
  </Stack>
</template>
