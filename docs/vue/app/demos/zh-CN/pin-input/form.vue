<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, PinInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    code: v.pipe(v.string('请输入验证码'), v.length(6, '验证码是 6 位数字')),
  })

  const values = reactive({ code: '' })
  const saved = ref(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = true
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="code" label="验证码" description="已发送到你的邮箱" required>
      <PinInput v-model="values.code" :length="6" type="number" otp />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">验证</Button>
    <Text v-if="saved" tone="muted" size="sm">验证通过。</Text>
  </Form>
</template>
