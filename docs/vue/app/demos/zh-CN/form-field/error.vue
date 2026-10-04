<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack, Switch } from '@hina-ui/vue'

  const email = ref('shion@example')
  const failed = ref(true)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="failed">显示错误</Switch>
    <FormField label="邮箱" :error="failed ? '邮箱格式不正确' : undefined">
      <Input v-model="email" type="email" />
    </FormField>
  </Stack>
</template>
