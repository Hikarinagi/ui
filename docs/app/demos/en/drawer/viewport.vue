<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Stack, Text } from '@hina-ui/vue'

  const modal = ref<InstanceType<typeof Drawer>>()

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal.value?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }
</script>

<template>
  <Drawer
    ref="modal"
    title="Scroll viewport"
    description="The title and footer stay fixed while the body scrolls."
  >
    <Button variant="outline" tone="neutral">Open</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="index in 30" :key="index">
          Line {{ index }} The title and footer stay fixed while this content scrolls.
        </Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" :disabled="!modal?.viewport" @click="scrollTo('start')">
        Top
      </Button>
      <Button variant="soft" tone="neutral" :disabled="!modal?.viewport" @click="scrollTo('end')">
        Bottom
      </Button>
      <Button @click="close">Close</Button>
    </template>
  </Drawer>
</template>
