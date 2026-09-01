<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Text } from '@hikarinagi/ui'

  const open = ref(false)
  const saving = ref(false)

  function save() {
    saving.value = true
    setTimeout(() => {
      saving.value = false
      open.value = false
    }, 2000)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    title="Edit tags"
    description="Please keep this drawer open while it saves."
    :locked="saving"
  >
    <Button variant="outline" tone="neutral">Edit tags</Button>
    <template #content>
      <Text>
        {{
          saving
            ? 'Saving. It closes on its own in two seconds.'
            : 'Saving locks the drawer for two seconds.'
        }}
      </Text>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="saving" @click="close">Cancel</Button>
      <Button :loading="saving" @click="save">Save</Button>
    </template>
  </Drawer>
</template>
