<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { FormField, FormLayout, Input, Stack, Switch } from '@hina-ui/vue'

  const values = reactive({ name: 'Hoshimi Shion', email: 'shion@example.com' })
  const locked = ref(true)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="locked">Lock account details</Switch>
    <FormLayout legend="Account" :disabled="locked">
      <FormField label="Username">
        <Input v-model="values.name" />
      </FormField>
      <FormField label="Email">
        <Input v-model="values.email" type="email" />
      </FormField>
    </FormLayout>
  </Stack>
</template>
