<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup } from '@hina-ui/vue'

  const scopes = ref(['read'])
  const options = [
    { value: 'read', label: 'Read', description: 'View your library and reading progress' },
    { value: 'write', label: 'Write', description: 'Change your library and ratings' },
    { value: 'admin', label: 'Manage', description: 'Manage tokens and granted scopes' },
  ]
</script>

<template>
  <CheckboxGroup v-model="scopes" :options="options" aria-label="Scopes" />
</template>
