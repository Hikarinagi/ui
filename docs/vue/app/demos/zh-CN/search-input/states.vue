<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <SearchInput disabled model-value="星见" aria-label="已禁用" />
    <SearchInput :clearable="false" model-value="星见" aria-label="不带清除按钮" />
  </Stack>
</template>
