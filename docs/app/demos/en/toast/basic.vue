<script setup lang="ts">
  import { Button, toast } from '@hikarinagi/ui'
</script>

<template>
  <Button variant="outline" tone="neutral" @click="toast('Draft saved')">Save draft</Button>
</template>
