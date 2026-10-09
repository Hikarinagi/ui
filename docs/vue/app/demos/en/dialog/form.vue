<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Dialog, Form, FormField, Input } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('Enter a name'), v.nonEmpty('Enter a name')),
    email: v.pipe(
      v.string('Enter an email'),
      v.nonEmpty('Enter an email'),
      v.email('That is not a valid email'),
    ),
  })

  const open = ref(false)
  const values = reactive({ name: 'Hoshimi Shion', email: 'shion@example.com' })

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 1500))
    open.value = false
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    title="Edit profile"
    description="The dialog is locked while saving and closes when it is done."
  >
    <Button variant="outline" tone="neutral">Edit profile</Button>
    <template #content>
      <Form id="profile-form" :values="values" :rules="schema" @submit="save">
        <FormField name="name" label="Name">
          <Input v-model="values.name" />
        </FormField>
        <FormField name="email" label="Email">
          <Input v-model="values.email" type="email" />
        </FormField>
      </Form>
    </template>
    <template #footer="{ close, submitting }">
      <Button variant="soft" tone="neutral" :disabled="submitting" @click="close">Cancel</Button>
      <Button type="submit" form="profile-form" :loading="submitting">Save</Button>
    </template>
  </Dialog>
</template>
