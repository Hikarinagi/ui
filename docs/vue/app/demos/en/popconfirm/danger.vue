<script setup lang="ts">
  import { Button, Popconfirm } from '@hina-ui/vue'
</script>

<template>
  <Popconfirm
    title="Remove this member?"
    description="They will lose access to this project."
    tone="danger"
    confirm-text="Remove"
  >
    <Button variant="outline" tone="danger">Remove member</Button>
  </Popconfirm>
</template>
