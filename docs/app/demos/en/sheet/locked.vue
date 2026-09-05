<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Sheet, Text } from '@hina-ui/vue'

  const open = ref(false)
  const saving = ref(false)

  async function save() {
    saving.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    saving.value = false
    open.value = false
  }
</script>

<template>
  <Sheet
    v-model:open="open"
    title="Save changes"
    description="The sheet stays put while saving."
    :locked="saving"
  >
    <Button variant="outline" tone="neutral">Open</Button>
    <template #content>
      <Text>
        For a second and a half after pressing Save, dragging, Esc and the scrim do nothing.
      </Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="saving" @click="close">Cancel</Button>
      <Button :loading="saving" @click="save">Save</Button>
    </template>
  </Sheet>
</template>
