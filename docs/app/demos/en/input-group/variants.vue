<script setup lang="ts">
  import { AtSign } from '@lucide/vue'
  import { Card, Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <InputGroup>
      <InputGroupAddon>
        <AtSign />
      </InputGroupAddon>
      <Input aria-label="On the page" placeholder="Directly on the page" />
    </InputGroup>
    <Card>
      <InputGroup variant="secondary">
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <Input aria-label="Inside a card" placeholder="Inside a card" />
      </InputGroup>
    </Card>
  </Stack>
</template>
