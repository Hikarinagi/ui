<script setup lang="ts">
  import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <InputGroup invalid>
      <InputGroupAddon>https://</InputGroupAddon>
      <Input model-value="not a domain" aria-label="Invalid" />
    </InputGroup>
    <InputGroup disabled>
      <InputGroupAddon>https://</InputGroupAddon>
      <Input model-value="shion.hoshimi.moe" aria-label="Disabled" />
    </InputGroup>
  </Stack>
</template>
