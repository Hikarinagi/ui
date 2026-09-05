<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Text, Toggle } from '@hina-ui/vue'

  const schema = v.pipe(
    v.object({
      pinned: v.boolean(),
      title: v.string(),
    }),
    v.forward(
      v.check(
        input => !input.pinned || input.title.trim().length > 0,
        'A pinned announcement needs a title',
      ),
      ['title'],
    ),
  )

  const values = reactive({ pinned: true, title: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="title" label="Title">
      <Input v-model="values.title" />
    </FormField>
    <FormField name="pinned">
      <Toggle v-model="values.pinned" variant="outline">Pin</Toggle>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Publish</Button>
    <Text v-if="saved" tone="muted" size="sm">Published: {{ saved }}</Text>
  </Form>
</template>
