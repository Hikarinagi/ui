<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'

  const name = ref('')
</script>

<template>
  <FormField label="昵称" class="w-80">
    <Input v-model="name" />
  </FormField>
</template>
