<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, InputGroup, InputGroupAddon, Text } from '@hina-ui/vue'

  const schema = v.object({
    site: v.pipe(
      v.string('请输入网址'),
      v.trim(),
      v.nonEmpty('请输入网址'),
      v.regex(/^[\w-]+(\.[\w-]+)+(\/.*)?$/, '网址格式不正确，不需要填写协议'),
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
    <FormField name="site" label="个人主页" required>
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input v-model="values.site" placeholder="example.com" />
      </InputGroup>
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
