<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Stack } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('请输入名称'), v.nonEmpty('请输入名称')),
  })

  const values = reactive({ name: '星见书音' })
  const form = ref<InstanceType<typeof Form> | null>(null)

  function save() {
    return new Promise(resolve => setTimeout(resolve, 1500))
  }
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Form ref="form" :values="values" :rules="schema" @submit="save">
      <FormField name="name" label="名称">
        <Input v-model="values.name" />
      </FormField>
    </Form>
    <Button :loading="form?.submitting" class="self-start" @click="form?.submit()">保存</Button>
  </Stack>
</template>
