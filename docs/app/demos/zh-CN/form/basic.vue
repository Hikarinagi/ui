<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('请输入昵称'), v.nonEmpty('请输入昵称')),
    email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
  })

  const values = reactive({ name: '', email: '' })
  const saved = ref('')

  function save(data: unknown) {
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="name" label="昵称" required>
      <Input v-model="values.name" />
    </FormField>
    <FormField name="email" label="邮箱" required>
      <Input v-model="values.email" type="email" />
    </FormField>
    <Button type="submit" class="self-start">提交</Button>
    <Text v-if="saved" tone="muted" size="sm">已提交：{{ saved }}</Text>
  </Form>
</template>
