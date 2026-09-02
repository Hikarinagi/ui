<script setup lang="ts">
  import { NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <NumberInput invalid :default-value="120" :max="99" aria-label="校验未通过" />
    <NumberInput disabled :default-value="3" aria-label="已禁用" />
    <NumberInput readonly :default-value="3" aria-label="只读" />
  </Stack>
</template>
