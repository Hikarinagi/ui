<script setup lang="ts">
  import { reactive } from 'vue'
  import { FormField, FormLayout, Input } from '@hina-ui/vue'

  const values = reactive({ province: '', city: '', district: '', street: '' })
</script>

<template>
  <FormLayout legend="收货地址" :columns="3" class="w-full max-w-lg">
    <FormField label="省">
      <Input v-model="values.province" />
    </FormField>
    <FormField label="市">
      <Input v-model="values.city" />
    </FormField>
    <FormField label="区">
      <Input v-model="values.district" />
    </FormField>
    <FormField label="详细地址" class="sm:col-span-3">
      <Input v-model="values.street" />
    </FormField>
  </FormLayout>
</template>
