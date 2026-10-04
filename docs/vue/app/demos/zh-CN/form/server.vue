<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
  })

  const values = reactive({ email: 'taken@example.com' })
  const form = ref<InstanceType<typeof Form> | null>(null)
  const saved = ref('')

  async function save(data: Record<string, unknown>) {
    await new Promise(resolve => setTimeout(resolve, 600))
    if (data.email === 'taken@example.com') {
      form.value?.setErrors({ email: '该邮箱已被注册' })
      return
    }
    saved.value = String(data.email)
  }
</script>

<template>
  <Form
    ref="form"
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-80"
    @submit="save"
  >
    <FormField name="email" label="邮箱" description="taken@example.com 会被服务端拒绝">
      <Input v-model="values.email" type="email" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">注册</Button>
    <Text v-if="saved" tone="muted" size="sm">已注册：{{ saved }}</Text>
  </Form>
</template>
