<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, PasswordInput, Text } from '@hina-ui/vue'

  const schema = v.pipe(
    v.object({
      password: v.pipe(
        v.string('Enter a password'),
        v.minLength(8, 'At least 8 characters'),
        v.regex(/[0-9]/, 'Include at least one digit'),
      ),
      confirm: v.string('Enter the password again'),
    }),
    v.forward(
      v.check(input => input.password === input.confirm, 'The passwords do not match'),
      ['confirm'],
    ),
  )

  const values = reactive({ password: '', confirm: '' })
  const saved = ref(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = true
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField
      name="password"
      label="New password"
      description="At least 8 characters with a digit"
      required
    >
      <PasswordInput v-model="values.password" />
    </FormField>
    <FormField name="confirm" label="Confirm password" required>
      <PasswordInput v-model="values.confirm" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Change password</Button>
    <Text v-if="saved" tone="muted" size="sm">Password changed.</Text>
  </Form>
</template>
