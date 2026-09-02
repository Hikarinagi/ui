<script setup lang="ts">
  import { Input, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <Input invalid model-value="shion@" aria-label="Invalid" />
    <Input disabled model-value="hoshimi" aria-label="Disabled" />
  </Stack>
</template>
