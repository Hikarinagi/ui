<script setup lang="ts">
  import { Stack, Textarea } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea
      invalid
      aria-label="Invalid"
      model-value="The synopsis must be at least twenty characters."
    />
    <Textarea
      disabled
      aria-label="Disabled"
      model-value="The synopsis cannot be edited during review."
    />
  </Stack>
</template>
