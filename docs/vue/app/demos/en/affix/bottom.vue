<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import {
    Affix,
    Button,
    Card,
    FormField,
    Heading,
    Inline,
    Input,
    ScrollArea,
    Stack,
    Text,
    Textarea,
  } from '@hina-ui/vue'

  const draft = reactive({
    title: 'Component design review',
    author: 'Design team',
    summary: '',
    notes: '',
  })
  const saved = ref(false)
  watch(draft, () => {
    saved.value = false
  })
</script>

<template>
  <Card :padded="false" class="w-full max-w-xl">
    <ScrollArea class="h-96" :shadow="false" focusable label="Edit article">
      <Stack class="p-4" gap="lg">
        <Heading :level="3" size="base">Edit article</Heading>
        <FormField label="Title"><Input v-model="draft.title" /></FormField>
        <FormField label="Author"><Input v-model="draft.author" /></FormField>
        <FormField label="Summary" description="A short introduction for article lists.">
          <Textarea v-model="draft.summary" :rows="4" placeholder="What is this article about?" />
        </FormField>
        <FormField label="Editorial notes" description="Leave context for the next editor.">
          <Textarea
            v-model="draft.notes"
            :rows="4"
            placeholder="Explain changes or open questions"
          />
        </FormField>
        <Affix position="bottom" :offset="12">
          <Card class="p-3">
            <Inline align="center" justify="between" gap="sm" wrap>
              <Text role="status" size="sm" tone="muted">
                {{ saved ? 'Draft saved in this demo' : 'Changes stay in this demo' }}
              </Text>
              <Button size="sm" :disabled="!draft.title.trim() || saved" @click="saved = true">
                Save draft
              </Button>
            </Inline>
          </Card>
        </Affix>
      </Stack>
    </ScrollArea>
  </Card>
</template>
