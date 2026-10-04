<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, DatePicker, Form, FormField, Text } from '@hina-ui/vue'

  const schema = v.object({
    released: v.string('Pick a release date'),
  })

  const values = reactive({ released: null as string | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="released" label="Release date" required>
      <DatePicker v-model="values.released" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
