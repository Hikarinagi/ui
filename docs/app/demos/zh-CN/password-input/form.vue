<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, PasswordInput, Text } from '@hina-ui/vue'

  const schema = v.pipe(
    v.object({
      password: v.pipe(
        v.string('请输入密码'),
        v.minLength(8, '密码至少 8 位'),
        v.regex(/[0-9]/, '密码需要包含数字'),
      ),
      confirm: v.string('请再次输入密码'),
    }),
    v.forward(
      v.check(input => input.password === input.confirm, '两次输入的密码不一致'),
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
    <FormField name="password" label="新密码" description="至少 8 位，包含数字" required>
      <PasswordInput v-model="values.password" />
    </FormField>
    <FormField name="confirm" label="确认密码" required>
      <PasswordInput v-model="values.confirm" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">修改密码</Button>
    <Text v-if="saved" tone="muted" size="sm">密码已修改。</Text>
  </Form>
</template>
