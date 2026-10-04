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
    if (!username) errors.username = 'Enter a username'
    else if (!/^[a-z0-9_]{3,16}$/.test(username)) {
      errors.username = '3 to 16 lowercase letters, digits or underscores'
    }
    if (!data.password) errors.password = 'Enter a password'
    if (data.confirm !== data.password) errors.confirm = 'The passwords do not match'
    return errors
  }

  function save() {
    saved.value = values.username
  }
</script>

<template>
  <Form :values="values" :rules="rules" class="w-80" @submit="save">
    <FormField name="username" label="Username" required>
      <Input v-model="values.username" />
    </FormField>
    <FormField name="password" label="Password" required>
      <PasswordInput v-model="values.password" />
    </FormField>
    <FormField name="confirm" label="Confirm password" required>
      <PasswordInput v-model="values.confirm" />
    </FormField>
    <Button type="submit" class="self-start">Sign up</Button>
    <Text v-if="saved" tone="muted" size="sm">Signed up: {{ saved }}</Text>
  </Form>
</template>
