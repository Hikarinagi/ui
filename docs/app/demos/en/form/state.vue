<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Stack, Switch } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('Enter a name'), v.nonEmpty('Enter a name')),
  })

  const values = reactive({ name: 'Hoshimi Shion' })
  const disabled = ref(false)

  function save() {
    return new Promise(resolve => setTimeout(resolve, 1500))
  }
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="disabled">Disable the form</Switch>
    <Form
      v-slot="{ submitting }"
      :values="values"
      :rules="schema"
      :disabled="disabled"
      @submit="save"
    >
      <FormField name="name" label="Name">
        <Input v-model="values.name" />
      </FormField>
      <Button type="submit" :loading="submitting" :disabled="disabled" class="self-start">
        Save
      </Button>
    </Form>
  </Stack>
</template>
