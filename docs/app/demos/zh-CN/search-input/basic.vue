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
      aria-label="搜索"
      placeholder="搜索作品"
      @search="submitted = $event"
    />
    <Text tone="muted">上次提交：{{ submitted || '无' }}</Text>
  </Stack>
</template>
