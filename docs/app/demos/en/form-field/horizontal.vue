<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'
  const name = ref('Hina')
</script>
<template>
  <FormField
    label="Display name"
    orientation="horizontal"
    label-width="8rem"
    description="Shown on your public profile."
    class="w-full"
  >
    <Input v-model="name" />
  </FormField>
</template>
