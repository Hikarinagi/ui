<script setup lang="ts">
  import { Card, NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <NumberInput :default-value="1" aria-label="页面上的输入框" class="w-40" />
    <Card>
      <NumberInput
        variant="secondary"
        :default-value="1"
        aria-label="卡片内的输入框"
        class="w-40"
      />
    </Card>
  </Stack>
</template>
