<script setup lang="ts">
  import { reactive } from 'vue'
  import { FormField, FormLayout, Input } from '@hina-ui/vue'

  const values = reactive({ city: '', state: '', zip: '', street: '' })
</script>

<template>
  <FormLayout legend="Shipping address" :columns="3" class="w-full max-w-lg">
    <FormField label="City">
      <Input v-model="values.city" />
    </FormField>
    <FormField label="State">
      <Input v-model="values.state" />
    </FormField>
    <FormField label="ZIP">
      <Input v-model="values.zip" />
    </FormField>
    <FormField label="Street address" class="sm:col-span-3">
      <Input v-model="values.street" />
    </FormField>
  </FormLayout>
</template>
