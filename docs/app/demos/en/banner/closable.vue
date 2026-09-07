<script setup lang="ts">
  import { ref } from 'vue'
  import { Banner, Button, Stack } from '@hina-ui/vue'

  const open = ref(true)
</script>

<template>
  <Stack class="min-h-24 w-full">
    <Banner v-model:open="open" tone="success" closable>
      Your email address has been verified.
    </Banner>
    <Button variant="soft" tone="neutral" :disabled="open" class="self-start" @click="open = true">
      Show again
    </Button>
  </Stack>
</template>
