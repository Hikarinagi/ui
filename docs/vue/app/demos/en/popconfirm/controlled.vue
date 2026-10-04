<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Popconfirm } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <Popconfirm
      v-model:open="open"
      title="Discard the draft?"
      description="Everything in the draft is thrown away."
    >
      <Button variant="outline" tone="neutral">Discard draft</Button>
    </Popconfirm>
  </Inline>
</template>
