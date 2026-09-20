<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Editable, FormField, Stack, Tag } from '@hina-ui/vue'

  const version = ref('1.8.0')
</script>

<template>
  <Stack class="w-full max-w-sm">
    <FormField label="Release version">
      <Editable v-model="version" activation-mode="manual" submit-mode="manual">
        <template #preview="{ value }">
          <Tag tone="info">v{{ value }}</Tag>
        </template>
        <template #actions="{ editing, saving, edit, submit, cancel }">
          <template v-if="editing">
            <Button size="sm" :loading="saving" @click="submit">Save version</Button>
            <Button size="sm" variant="ghost" tone="neutral" :disabled="saving" @click="cancel">
              Cancel
            </Button>
          </template>
          <Button v-else size="sm" variant="outline" tone="neutral" @click="edit">
            Edit version
          </Button>
        </template>
      </Editable>
    </FormField>
  </Stack>
</template>
