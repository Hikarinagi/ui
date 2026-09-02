<script setup lang="ts">
  import { Card, NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <NumberInput :default-value="1" aria-label="On the page" class="w-40" />
    <Card>
      <NumberInput variant="secondary" :default-value="1" aria-label="Inside a card" class="w-40" />
    </Card>
  </Stack>
</template>
