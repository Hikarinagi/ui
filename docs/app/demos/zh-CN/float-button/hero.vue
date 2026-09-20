<script setup lang="ts">
  import { ref } from 'vue'
  import { Plus } from '@lucide/vue'
  import {
    Button,
    Card,
    Dialog,
    FloatButton,
    FormField,
    Heading,
    Input,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const open = ref(false)
  const title = ref('')
  const notes = ref(['本周设计回顾', '下一版组件清单'])
  function create() {
    if (!title.value.trim()) return
    notes.value.push(title.value.trim())
    title.value = ''
    open.value = false
  }
</script>

<template>
  <Card class="relative min-h-72 w-full max-w-md pb-24">
    <Stack gap="lg">
      <Heading :level="3" size="base">工作笔记</Heading>
      <Stack gap="sm">
        <Text v-for="(note, index) in notes" :key="index" class="border-line border-b pb-3">
          {{ note }}
        </Text>
      </Stack>
    </Stack>
    <FloatButton position="absolute" label="新建笔记" @click="open = true"><Plus /></FloatButton>
    <Dialog v-model:open="open" title="新建笔记" description="为新的笔记填写标题。">
      <template #content>
        <FormField label="笔记标题">
          <Input v-model="title" placeholder="例如：交互细节" @keydown.enter.prevent="create" />
        </FormField>
      </template>
      <template #footer>
        <Button variant="soft" tone="neutral" @click="open = false">取消</Button>
        <Button :disabled="!title.trim()" @click="create">创建</Button>
      </template>
    </Dialog>
  </Card>
</template>
