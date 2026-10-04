<script setup lang="ts">
  import { Stack, Textarea } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea invalid aria-label="校验未通过" model-value="简介不能少于二十个字。" />
    <Textarea disabled aria-label="已禁用" model-value="审核期间不能修改简介。" />
  </Stack>
</template>
