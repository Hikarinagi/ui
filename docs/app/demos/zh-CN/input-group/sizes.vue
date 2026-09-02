<script setup lang="ts">
  import { Button, Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <InputGroup size="sm">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="小号" />
      <Button size="sm">确定</Button>
    </InputGroup>
    <InputGroup size="md">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="中号" />
      <Button size="md">确定</Button>
    </InputGroup>
    <InputGroup size="lg">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="大号" />
      <Button size="lg">确定</Button>
    </InputGroup>
  </Stack>
</template>
