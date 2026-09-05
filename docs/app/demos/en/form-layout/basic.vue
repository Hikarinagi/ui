<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, FormLayout, Input } from '@hina-ui/vue'

  const name = ref('')
  const email = ref('')
</script>

<template>
  <FormLayout legend="Account" description="Used to sign in" class="w-80">
    <FormField label="Username">
      <Input v-model="name" />
    </FormField>
    <FormField label="Email">
      <Input v-model="email" type="email" />
    </FormField>
  </FormLayout>
</template>
