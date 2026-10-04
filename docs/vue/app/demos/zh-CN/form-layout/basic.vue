<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, FormLayout, Input } from '@hina-ui/vue'

  const name = ref('')
  const email = ref('')
</script>

<template>
  <FormLayout legend="账号" description="登录时使用" class="w-80">
    <FormField label="用户名">
      <Input v-model="name" />
    </FormField>
    <FormField label="邮箱">
      <Input v-model="email" type="email" />
    </FormField>
  </FormLayout>
</template>
