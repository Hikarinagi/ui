<script setup lang="ts">
  import { Button, toast } from '@hina-ui/vue'
</script>

<template>
  <Button variant="outline" tone="neutral" @click="toast('Draft saved')">Save draft</Button>
</template>
