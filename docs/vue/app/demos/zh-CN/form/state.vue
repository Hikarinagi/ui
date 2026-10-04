<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Stack, Switch } from '@hina-ui/vue'

  const schema = v.object({
    name: v.pipe(v.string('请输入名称'), v.nonEmpty('请输入名称')),
  })

  const values = reactive({ name: '星见书音' })
  const disabled = ref(false)

  function save() {
    return new Promise(resolve => setTimeout(resolve, 1500))
  }
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <Switch v-model="disabled">禁用表单</Switch>
    <Form
      v-slot="{ submitting }"
      :values="values"
      :rules="schema"
      :disabled="disabled"
      @submit="save"
    >
      <FormField name="name" label="名称">
        <Input v-model="values.name" />
      </FormField>
      <Button type="submit" :loading="submitting" :disabled="disabled" class="self-start">
        保存
      </Button>
    </Form>
  </Stack>
</template>
