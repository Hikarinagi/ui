<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, TagsInput, Text } from '@hina-ui/vue'

  const schema = v.object({
    aliases: v.pipe(
      v.array(v.pipe(v.string(), v.maxLength(20, '别名不超过 20 个字'))),
      v.minLength(1, '至少填写一个别名'),
      v.maxLength(5, '最多五个别名'),
    ),
  })

  const values = reactive({ aliases: [] as string[] })
  const saved = ref('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = JSON.stringify(data)
  }
</script>

<template>
  <Form v-slot="{ submitting }" :values="values" :rules="schema" class="w-80" @submit="save">
    <FormField name="aliases" label="别名" description="回车添加，最多五个" required>
      <TagsInput v-model="values.aliases" />
    </FormField>
    <Button type="submit" :loading="submitting" class="self-start">保存</Button>
    <Text v-if="saved" tone="muted" size="sm">已保存：{{ saved }}</Text>
  </Form>
</template>
