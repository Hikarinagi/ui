<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, CheckboxGroup, Form, FormField, Text } from '@hina-ui/vue'

  const options = [
    { label: 'Games', value: 'game' },
    { label: 'Novels', value: 'novel' },
    { label: 'Manga', value: 'manga' },
    { label: 'Anime', value: 'anime' },
  ]

  const schema = v.object({
    interests: v.pipe(
      v.array(v.string('Pick your interests')),
      v.minLength(1, 'Pick at least one'),
      v.maxLength(2, 'Pick at most two'),
    ),
  })

  const values = reactive({ interests: [] as Array<string | number> })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="interests" label="Interests" description="One or two of them" required>
      <CheckboxGroup v-model="values.interests" :options="options" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
