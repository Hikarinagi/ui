<script setup lang="ts">
  import { Card, PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <PasswordInput model-value="hoshimi" aria-label="页面上的输入框" class="w-64" />
    <Card>
      <PasswordInput
        variant="secondary"
        model-value="hoshimi"
        aria-label="卡片内的输入框"
        class="w-64"
      />
    </Card>
  </Stack>
</template>
