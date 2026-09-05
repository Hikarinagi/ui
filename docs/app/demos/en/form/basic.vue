<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
    email: v.pipe(
      v.string('Enter an email'),
      v.nonEmpty('Enter an email'),
      v.email('The email is not valid'),
    ),
  })

  const values = reactive({ name: '', email: '' })
  const saved = ref('')

  function save(data: unknown) {
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="name" label="Nickname" required>
      <Input v-model="values.name" />
    </FormField>
    <FormField name="email" label="Email" required>
      <Input v-model="values.email" type="email" />
    </FormField>
    <Button type="submit" class="self-start">Submit</Button>
    <Text v-if="saved" tone="muted" size="sm">Submitted: {{ saved }}</Text>
  </Form>
</template>
