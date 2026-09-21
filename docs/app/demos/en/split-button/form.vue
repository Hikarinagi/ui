<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { DropdownMenuItem, Form, FormField, Input, SplitButton, Text } from '@hina-ui/vue'

  const values = reactive({ title: '' })
  const result = ref('')
  const schema = v.object({
    title: v.pipe(v.string(), v.trim(), v.minLength(2, 'Enter at least 2 characters')),
  })

  async function publish(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    result.value = `Published: ${(data as { title: string }).title}`
  }
  function saveDraft() {
    result.value = `Draft saved: ${values.title.trim() || 'Untitled article'}`
  }
</script>

<template>
  <Form
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="publish"
  >
    <FormField
      name="title"
      label="Article title"
      description="Publishing validates the title. Saving a draft allows unfinished content."
      required
    >
      <Input v-model="values.title" placeholder="Enter a title" />
    </FormField>
    <SplitButton
      type="submit"
      :loading="submitting"
      menu-label="More saving options"
      class="self-start"
    >
      Publish article
      <template #content>
        <DropdownMenuItem @select="saveDraft">Save draft</DropdownMenuItem>
      </template>
    </SplitButton>
    <Text v-if="result" role="status" size="sm" tone="muted">{{ result }}</Text>
  </Form>
</template>
