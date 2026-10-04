<script setup lang="ts">
  import { ref } from 'vue'
  import { SearchInput, Stack, Text } from '@hina-ui/vue'

  const query = ref('')
  const submitted = ref('')
</script>

<template>
  <Stack class="w-72">
    <SearchInput
      v-model="query"
      aria-label="Search"
      placeholder="Search works"
      @search="submitted = $event"
    />
    <Text tone="muted">Last submitted: {{ submitted || 'none' }}</Text>
  </Stack>
</template>
