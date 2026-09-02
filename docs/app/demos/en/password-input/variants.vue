<script setup lang="ts">
  import { Card, PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <PasswordInput model-value="hoshimi" aria-label="On the page" class="w-64" />
    <Card>
      <PasswordInput
        variant="secondary"
        model-value="hoshimi"
        aria-label="Inside a card"
        class="w-64"
      />
    </Card>
  </Stack>
</template>
