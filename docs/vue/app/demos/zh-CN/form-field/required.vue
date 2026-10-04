<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'

  const email = ref('')
</script>

<template>
  <FormField label="邮箱" required class="w-80">
    <Input v-model="email" type="email" />
  </FormField>
</template>
