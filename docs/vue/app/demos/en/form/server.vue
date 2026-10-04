<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    email: v.pipe(
      v.string('Enter an email'),
      v.nonEmpty('Enter an email'),
      v.email('The email is not valid'),
    ),
  })

  const values = reactive({ email: 'taken@example.com' })
  const form = ref<InstanceType<typeof Form> | null>(null)
  const saved = ref('')

  async function save(data: Record<string, unknown>) {
    await new Promise(resolve => setTimeout(resolve, 600))
    if (data.email === 'taken@example.com') {
      form.value?.setErrors({ email: 'This email is already registered' })
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
    <FormField name="email" label="Email" description="taken@example.com is rejected by the server">
      <Input v-model="values.email" type="email" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Sign up</Button>
    <Text v-if="saved" tone="muted" size="sm">Signed up: {{ saved }}</Text>
  </Form>
</template>
