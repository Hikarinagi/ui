<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, InputGroup, InputGroupAddon, Text } from '@hina-ui/vue'

  const schema = v.object({
    site: v.pipe(
      v.string('Enter a website'),
      v.trim(),
      v.nonEmpty('Enter a website'),
      v.regex(/^[\w-]+(\.[\w-]+)+(\/.*)?$/, 'Not a valid address; leave out the protocol'),
    ),
  })

  const values = reactive({ site: '' })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = `https://${(data as { site: string }).site}`
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="site" label="Website" required>
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input v-model="values.site" placeholder="example.com" />
      </InputGroup>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Save</Button>
    <Text v-if="saved" tone="muted" size="sm">Saved: {{ saved }}</Text>
  </Form>
</template>
