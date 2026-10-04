<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Editable, Form, FormField, Text } from '@hina-ui/vue'

  const values = reactive({ displayName: '' })
  const editing = ref(false)
  const saved = ref('')
  const schema = v.object({
    displayName: v.pipe(v.string(), v.trim(), v.minLength(2, 'Use at least 2 characters')),
  })

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = (data as { displayName: string }).displayName
  }
</script>

<template>
  <Form
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="save"
  >
    <FormField
      name="displayName"
      label="Display name"
      description="Confirm the field edit before saving the profile."
      required
    >
      <Editable
        v-model="values.displayName"
        v-model:editing="editing"
        name="displayName"
        placeholder="Enter a display name"
      />
    </FormField>
    <Button type="submit" :loading="submitting" :disabled="editing" class="self-start">
      Save profile
    </Button>
    <Text v-if="saved" role="status" size="sm" tone="muted">Saved: {{ saved }}</Text>
  </Form>
</template>
