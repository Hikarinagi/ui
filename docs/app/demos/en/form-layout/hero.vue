<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, FormLayout, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    firstName: v.pipe(v.string('Enter a first name'), v.nonEmpty('Enter a first name')),
    lastName: v.pipe(v.string('Enter a last name'), v.nonEmpty('Enter a last name')),
    email: v.pipe(
      v.string('Enter an email'),
      v.nonEmpty('Enter an email'),
      v.email('The email is not valid'),
    ),
    phone: v.string(),
  })

  const values = reactive({ firstName: '', lastName: '', email: '', phone: '' })
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
    <FormLayout
      legend="Contact"
      description="A name and at least one way to reach you"
      :columns="2"
    >
      <FormField name="firstName" label="First name" required>
        <Input v-model="values.firstName" />
      </FormField>
      <FormField name="lastName" label="Last name" required>
        <Input v-model="values.lastName" />
      </FormField>
      <FormField name="email" label="Email" required class="sm:col-span-2">
        <Input v-model="values.email" type="email" />
      </FormField>
      <FormField name="phone" label="Phone" class="sm:col-span-2">
        <Input v-model="values.phone" type="tel" />
      </FormField>
    </FormLayout>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
