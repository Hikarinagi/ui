<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { FormField, FormLayout, Input, Stack, Switch } from '@hina-ui/vue'

  const values = reactive({ name: '星见书音', email: 'shion@example.com' })
  const locked = ref(true)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="locked">锁定账号信息</Switch>
    <FormLayout legend="账号" :disabled="locked">
      <FormField label="用户名">
        <Input v-model="values.name" />
      </FormField>
      <FormField label="邮箱">
        <Input v-model="values.email" type="email" />
      </FormField>
    </FormLayout>
  </Stack>
</template>
