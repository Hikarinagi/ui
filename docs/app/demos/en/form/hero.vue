<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Select, Switch, Text, Textarea } from '@hina-ui/vue'

  const schema = v.object({
    title: v.pipe(
      v.string('Enter a title'),
      v.nonEmpty('Enter a title'),
      v.maxLength(20, 'Keep the title within 20 characters'),
    ),
    category: v.pipe(v.string('Pick a category'), v.nonEmpty('Pick a category')),
    summary: v.pipe(
      v.string('Enter a summary'),
      v.maxLength(80, 'Keep the summary within 80 characters'),
    ),
    published: v.boolean('Choose whether it is public'),
  })

  const categories = [
    { label: 'Game', value: 'game' },
    { label: 'Novel', value: 'novel' },
    { label: 'Manga', value: 'manga' },
  ]

  const values = reactive({
    title: '',
    category: null as string | number | null,
    summary: '',
    published: true,
  })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="title" label="Title" required>
      <Input v-model="values.title" placeholder="Name of the work" />
    </FormField>
    <FormField name="category" label="Category" required>
      <Select v-model="values.category" :options="categories" />
    </FormField>
    <FormField name="summary" label="Summary" description="Up to 80 characters">
      <Textarea v-model="values.summary" />
    </FormField>
    <FormField name="published">
      <Switch v-model="values.published">Public</Switch>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Submit</Button>
    <Text v-if="saved" tone="muted" size="sm">Submitted: {{ saved }}</Text>
  </Form>
</template>
