<script setup lang="ts">
  import { Card, SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <SearchInput placeholder="直接放在页面上" aria-label="页面上的输入框" class="w-72" />
    <Card>
      <SearchInput
        variant="secondary"
        placeholder="放在卡片内"
        aria-label="卡片内的输入框"
        class="w-72"
      />
    </Card>
  </Stack>
</template>
