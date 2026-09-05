<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import {
    Button,
    Form,
    FormField,
    Input,
    SegmentedControl,
    Stack,
    type FormValidateOn,
  } from '@hina-ui/vue'

  const modes = [
    { label: 'On submit', value: 'submit' },
    { label: 'On blur', value: 'blur' },
    { label: 'On change', value: 'change' },
  ]
  const mode = ref<string | number>('submit')

  const schema = v.object({
    name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
    email: v.pipe(
      v.string('Enter an email'),
      v.nonEmpty('Enter an email'),
      v.email('The email is not valid'),
    ),
  })

  const values = reactive({ name: '', email: '' })
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <SegmentedControl v-model="mode" :options="modes" aria-label="Validation timing" />
    <Form :key="mode" :values="values" :rules="schema" :validate-on="mode as FormValidateOn">
      <FormField name="name" label="Nickname" required>
        <Input v-model="values.name" />
      </FormField>
      <FormField name="email" label="Email" required>
        <Input v-model="values.email" type="email" />
      </FormField>
      <Button type="submit" class="self-start">Submit</Button>
    </Form>
  </Stack>
</template>
