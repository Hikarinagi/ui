<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'

  const name = ref('')
</script>

<template>
  <FormField label="Nickname" description="Shown on your profile page" required class="w-80">
    <Input v-model="name" placeholder="Hoshimi Shion" />
  </FormField>
</template>
