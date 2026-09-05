<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import {
    Button,
    Form,
    FormField,
    Input,
    PasswordInput,
    Text,
    type FormValidator,
  } from '@hina-ui/vue'

  const values = reactive({ username: '', password: '', confirm: '' })
  const saved = ref('')

  const rules: FormValidator = data => {
    const errors: Record<string, string> = {}
    const username = String(data.username ?? '')
    if (!username) errors.username = '请输入用户名'
    else if (!/^[a-z0-9_]{3,16}$/.test(username)) {
      errors.username = '3 到 16 位小写字母、数字或者下划线'
    }
    if (!data.password) errors.password = '请输入密码'
    if (data.confirm !== data.password) errors.confirm = '两次输入的密码不一致'
    return errors
  }

  function save() {
    saved.value = values.username
  }
</script>

<template>
  <Form :values="values" :rules="rules" class="w-80" @submit="save">
    <FormField name="username" label="用户名" required>
      <Input v-model="values.username" />
    </FormField>
    <FormField name="password" label="密码" required>
      <PasswordInput v-model="values.password" />
    </FormField>
    <FormField name="confirm" label="确认密码" required>
      <PasswordInput v-model="values.confirm" />
    </FormField>
    <Button type="submit" class="self-start">注册</Button>
    <Text v-if="saved" tone="muted" size="sm">已注册：{{ saved }}</Text>
  </Form>
</template>
