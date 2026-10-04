<script setup lang="ts">
  import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <InputGroup variant="primary">
      <InputGroupAddon>@</InputGroupAddon>
      <Input aria-label="primary" placeholder="primary" />
    </InputGroup>
    <InputGroup variant="secondary">
      <InputGroupAddon>@</InputGroupAddon>
      <Input aria-label="secondary" placeholder="secondary" />
    </InputGroup>
    <InputGroup variant="bare">
      <InputGroupAddon>@</InputGroupAddon>
      <Input aria-label="bare" placeholder="bare" />
    </InputGroup>
  </Stack>
</template>
