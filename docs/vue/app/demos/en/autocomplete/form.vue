<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Autocomplete, Button, Form, FormField, Text } from '@hina-ui/vue'

  const form = ref<InstanceType<typeof Form>>()
  const values = reactive({ framework: '' })
  const saved = ref('')
  const candidates = ['Vue', 'React', 'Svelte', 'Solid', 'Angular']
  const options = computed(() =>
    candidates
      .filter(label => label.toLowerCase().includes(values.framework.toLowerCase()))
      .map(label => ({ value: label, label })),
  )
  const schema = v.object({
    framework: v.pipe(v.string(), v.trim(), v.nonEmpty('Enter a framework name')),
  })

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = (data as { framework: string }).framework
  }
</script>

<template>
  <Form
    ref="form"
    v-slot="{ submitting }"
    :values="values"
    :rules="schema"
    class="w-full max-w-sm"
    @submit="save"
  >
    <FormField
      name="framework"
      label="Primary framework"
      description="Choose a suggestion or enter another framework."
      required
    >
      <Autocomplete
        v-model="values.framework"
        :options="options"
        name="framework"
        placeholder="Choose or enter a framework"
        @submit="form?.submit()"
      />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" role="status" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
