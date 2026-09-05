<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, FileUpload, Form, FormField, Text } from '@hina-ui/vue'

  const schema = v.object({
    cover: v.pipe(
      v.instance(File, 'Pick a cover image'),
      v.check(file => file.size <= 2 * 1024 * 1024, 'The image must be 2MB or smaller'),
    ),
  })

  const values = reactive({ cover: null as File | null })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = (data as { cover: File }).cover.name
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="cover" label="Cover" description="An image up to 2MB" required>
      <FileUpload v-model="values.cover" accept="image/*" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Upload</Button>
    <Text v-if="saved" tone="muted" size="sm">Uploaded: {{ saved }}</Text>
  </Form>
</template>
