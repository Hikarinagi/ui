<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, FormLayout, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    lastName: v.pipe(v.string('请输入姓氏'), v.nonEmpty('请输入姓氏')),
    firstName: v.pipe(v.string('请输入名字'), v.nonEmpty('请输入名字')),
    email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
    phone: v.string(),
  })

  const values = reactive({ lastName: '', firstName: '', email: '', phone: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-lg"
    @submit="save"
  >
    <FormLayout legend="联系人" description="姓名与至少一种联系方式" :columns="2">
      <FormField name="lastName" label="姓" required>
        <Input v-model="values.lastName" />
      </FormField>
      <FormField name="firstName" label="名" required>
        <Input v-model="values.firstName" />
      </FormField>
      <FormField name="email" label="邮箱" required class="sm:col-span-2">
        <Input v-model="values.email" type="email" />
      </FormField>
      <FormField name="phone" label="电话" class="sm:col-span-2">
        <Input v-model="values.phone" type="tel" />
      </FormField>
    </FormLayout>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
