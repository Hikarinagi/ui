<script setup lang="ts">
  import { Input, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <Input invalid model-value="shion@" aria-label="校验未通过" />
    <Input disabled model-value="hoshimi" aria-label="已禁用" />
  </Stack>
</template>
