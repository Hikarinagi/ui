<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, PinInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    code: v.pipe(v.string('Enter the code'), v.length(6, 'The code is 6 digits')),
  })

  const values = reactive({ code: '' })
  const saved = ref(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = true
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="code" label="Verification code" description="Sent to your email" required>
      <PinInput v-model="values.code" :length="6" type="number" otp />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">Verify</Button>
    <Text v-if="saved" tone="muted" size="sm">Verified.</Text>
  </Form>
</template>
