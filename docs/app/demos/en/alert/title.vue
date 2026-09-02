<script setup lang="ts">
  import { Alert } from '@hina-ui/vue'
</script>

<template>
  <Alert tone="warning" title="Your session is about to expire" class="w-full max-w-xl">
    Save what you are editing within five minutes, or you will need to sign in again.
  </Alert>
</template>
