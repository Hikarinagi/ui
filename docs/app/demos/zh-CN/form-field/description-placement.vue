<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack } from '@hina-ui/vue'
  const name = ref('Hina')
  const email = ref('')
</script>
<template>
  <Stack class="w-full">
    <FormField
      label="显示名称"
      orientation="responsive"
      description-placement="label"
      description="显示在你的公开个人资料中。"
    >
      <Input v-model="name" />
    </FormField>
    <FormField
      label="邮箱地址"
      orientation="responsive"
      description-placement="control"
      description="使用可以接收通知的邮箱地址。"
      error="请输入邮箱地址。"
    >
      <Input v-model="email" type="email" />
    </FormField>
  </Stack>
</template>
