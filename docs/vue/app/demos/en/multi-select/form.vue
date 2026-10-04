<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, MultiSelect, Text } from '@hina-ui/vue'

  const genres = [
    { label: 'Romance', value: 'romance' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Fantasy', value: 'fantasy' },
    { label: 'Slice of life', value: 'slice-of-life' },
    { label: 'Science fiction', value: 'sci-fi' },
  ]

  const schema = v.object({
    genres: v.pipe(
      v.array(v.string('Pick genres')),
      v.minLength(1, 'Pick at least one genre'),
      v.maxLength(3, 'Pick at most three genres'),
    ),
  })

  const values = reactive({ genres: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="genres" label="Genres" description="One to three of them" required>
      <MultiSelect v-model="values.genres" :options="genres" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
