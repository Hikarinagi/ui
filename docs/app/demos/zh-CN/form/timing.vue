<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import {
    Button,
    Form,
    FormField,
    Input,
    SegmentedControl,
    Stack,
    type FormValidateOn,
  } from '@hina-ui/vue'

  const modes = [
    { label: '提交时', value: 'submit' },
    { label: '失去焦点', value: 'blur' },
    { label: '值变化', value: 'change' },
  ]
  const mode = ref<string | number>('submit')

  const schema = v.object({
    name: v.pipe(v.string('请输入昵称'), v.nonEmpty('请输入昵称')),
    email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
  })

  const values = reactive({ name: '', email: '' })
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <SegmentedControl v-model="mode" :options="modes" aria-label="校验时机" />
    <Form :key="mode" :values="values" :rules="schema" :validate-on="mode as FormValidateOn">
      <FormField name="name" label="昵称" required>
        <Input v-model="values.name" />
      </FormField>
      <FormField name="email" label="邮箱" required>
        <Input v-model="values.email" type="email" />
      </FormField>
      <Button type="submit" class="self-start">提交</Button>
    </Form>
  </Stack>
</template>
