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
  const notes = ref(['Weekly design review', 'Next release checklist'])
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
      <Heading :level="3" size="base">Workspace notes</Heading>
      <Stack gap="sm">
        <Text v-for="(note, index) in notes" :key="index" class="border-line border-b pb-3">
          {{ note }}
        </Text>
      </Stack>
    </Stack>
    <FloatButton position="absolute" label="New note" @click="open = true"><Plus /></FloatButton>
    <Dialog v-model:open="open" title="New note" description="Give your new note a title.">
      <template #content>
        <FormField label="Note title">
          <Input
            v-model="title"
            placeholder="For example: interaction details"
            @keydown.enter.prevent="create"
          />
        </FormField>
      </template>
      <template #footer>
        <Button variant="soft" tone="neutral" @click="open = false">Cancel</Button>
        <Button :disabled="!title.trim()" @click="create">Create</Button>
      </template>
    </Dialog>
  </Card>
</template>
