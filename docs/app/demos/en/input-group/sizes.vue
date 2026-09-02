<script setup lang="ts">
  import { Button, Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <InputGroup size="sm">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="Small" />
      <Button size="sm">OK</Button>
    </InputGroup>
    <InputGroup size="md">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="Medium" />
      <Button size="md">OK</Button>
    </InputGroup>
    <InputGroup size="lg">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="Large" />
      <Button size="lg">OK</Button>
    </InputGroup>
  </Stack>
</template>
