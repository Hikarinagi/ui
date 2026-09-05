<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Select, Text } from '@hina-ui/vue'

  const categories = [
    { label: 'Game', value: 'game' },
    { label: 'Novel', value: 'novel' },
    { label: 'Manga', value: 'manga' },
  ]

  const schema = v.object({
    category: v.pipe(v.string('Pick a category'), v.nonEmpty('Pick a category')),
  })

  const values = reactive({ category: null as string | number | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="category" label="Category" required>
      <Select v-model="values.category" :options="categories" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
