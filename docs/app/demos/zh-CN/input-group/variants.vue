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
      <Input aria-label="页面上的输入框" placeholder="直接放在页面上" />
    </InputGroup>
    <Card>
      <InputGroup variant="secondary">
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <Input aria-label="卡片内的输入框" placeholder="放在卡片内" />
      </InputGroup>
    </Card>
  </Stack>
</template>
