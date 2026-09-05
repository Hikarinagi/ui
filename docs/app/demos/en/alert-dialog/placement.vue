<script setup lang="ts">
  import { AlertDialog, Button, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm">
    <AlertDialog
      title="Empty the trash?"
      description="The 12 files in the trash are deleted permanently."
      size="md"
    >
      <Button variant="outline" tone="neutral">md size</Button>
    </AlertDialog>
    <AlertDialog
      title="Empty the trash?"
      description="The 12 files in the trash are deleted permanently."
      placement="center"
    >
      <Button variant="outline" tone="neutral">Always centered</Button>
    </AlertDialog>
    <AlertDialog
      title="Empty the trash?"
      description="The 12 files in the trash are deleted permanently."
      placement="bottom"
    >
      <Button variant="outline" tone="neutral">Always at the bottom</Button>
    </AlertDialog>
  </Inline>
</template>
