<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Dialog, Form, FormField, Input } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('请输入名称'), v.nonEmpty('请输入名称')),
    email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
  })

  const open = ref(false)
  const values = reactive({ name: '星见书音', email: 'shion@example.com' })

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 1500))
    open.value = false
  }
</script>

<template>
  <Dialog v-model:open="open" title="编辑资料" description="保存期间对话框锁定，完成后关闭。">
    <Button variant="outline" tone="neutral">编辑资料</Button>
    <template #content>
      <Form id="profile-form" :values="values" :rules="schema" @submit="save">
        <FormField name="name" label="名称">
          <Input v-model="values.name" />
        </FormField>
        <FormField name="email" label="邮箱">
          <Input v-model="values.email" type="email" />
        </FormField>
      </Form>
    </template>
    <template #footer="{ close, submitting }">
      <Button variant="soft" tone="neutral" :disabled="submitting" @click="close">取消</Button>
      <Button type="submit" form="profile-form" :loading="submitting">保存</Button>
    </template>
  </Dialog>
</template>
