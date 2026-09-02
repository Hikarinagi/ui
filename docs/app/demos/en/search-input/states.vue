<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <SearchInput disabled model-value="Hoshimi" aria-label="Disabled" />
    <SearchInput :clearable="false" model-value="Hoshimi" aria-label="Without clear button" />
  </Stack>
</template>
