<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, FormLayout, Input, Switch, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
    bio: v.pipe(v.string(), v.maxLength(80, 'Keep the bio within 80 characters')),
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
    <FormLayout legend="Profile" description="Shown on your profile page">
      <FormField name="name" label="Nickname" required>
        <Input v-model="values.name" />
      </FormField>
      <FormField name="bio" label="Bio">
        <Textarea v-model="values.bio" />
      </FormField>
    </FormLayout>
    <FormLayout legend="Notifications" description="Let you know about replies and new followers">
      <FormField name="notifyEmail">
        <Switch v-model="values.notifyEmail">Email</Switch>
      </FormField>
      <FormField name="notifyPush">
        <Switch v-model="values.notifyPush">Push</Switch>
      </FormField>
    </FormLayout>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
