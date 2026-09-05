<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, MultiCombobox, Text } from '@hina-ui/vue'

  const tags = [
    { label: 'Romance', value: 'romance' },
    { label: 'Romantic comedy', value: 'rom-com' },
    { label: 'School', value: 'school' },
    { label: 'Isekai', value: 'isekai' },
    { label: 'Healing', value: 'healing' },
    { label: 'Mystery', value: 'mystery' },
  ]

  const schema = v.object({
    tags: v.pipe(
      v.array(v.string('Pick tags')),
      v.minLength(1, 'Pick at least one tag'),
      v.maxLength(3, 'Pick at most three tags'),
    ),
  })

  const values = reactive({ tags: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="tags" label="Tags" description="One to three of them" required>
      <MultiCombobox v-model="values.tags" :options="tags" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
