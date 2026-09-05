<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, SearchInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    keyword: v.pipe(
      v.string('Enter a keyword'),
      v.trim(),
      v.nonEmpty('Enter a keyword'),
      v.minLength(2, 'At least 2 characters'),
    ),
  })

  const values = reactive({ keyword: '' })
  const result = ref('')

  async function search(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    result.value = (data as { keyword: string }).keyword
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="search">
    <FormField name="keyword" label="Search works">
      <SearchInput v-model="values.keyword" placeholder="Title or alias" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Search</Button>
    <Text v-if="result" tone="muted" size="sm">Searching for "{{ result }}".</Text>
  </Form>
</template>
