<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, FormLayout, Input, Switch, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('请输入昵称'), v.nonEmpty('请输入昵称')),
    bio: v.pipe(v.string(), v.maxLength(80, '简介不超过 80 个字')),
    notifyEmail: v.boolean(),
    notifyPush: v.boolean(),
  })

  const values = reactive({ name: '', bio: '', notifyEmail: true, notifyPush: false })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormLayout legend="个人资料" description="公开显示在个人页">
      <FormField name="name" label="昵称" required>
        <Input v-model="values.name" />
      </FormField>
      <FormField name="bio" label="简介">
        <Textarea v-model="values.bio" />
      </FormField>
    </FormLayout>
    <FormLayout legend="通知" description="有新的回复或者关注时提醒你">
      <FormField name="notifyEmail">
        <Switch v-model="values.notifyEmail">邮件</Switch>
      </FormField>
      <FormField name="notifyPush">
        <Switch v-model="values.notifyPush">推送</Switch>
      </FormField>
    </FormLayout>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
