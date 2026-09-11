<script setup lang="ts">
  import { AlertDialog, Button } from '@hina-ui/vue'
</script>

<template>
  <AlertDialog
    title="Confirm action?"
    description="The confirm button becomes available when the countdown ends."
    tone="danger"
    confirm-text="Confirm"
    :confirm-delay="3"
  >
    <Button variant="outline" tone="neutral">Confirmation countdown</Button>
  </AlertDialog>
</template>
