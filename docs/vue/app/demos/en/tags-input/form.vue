<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, TagsInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    aliases: v.pipe(
      v.array(v.pipe(v.string(), v.maxLength(20, 'An alias is at most 20 characters'))),
      v.minLength(1, 'Add at least one alias'),
      v.maxLength(5, 'At most five aliases'),
    ),
  })

  const values = reactive({ aliases: [] as string[] })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="aliases" label="Aliases" description="Press Enter to add, up to five" required>
      <TagsInput v-model="values.aliases" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
