<script setup lang="ts">
  import { ref } from 'vue'
  import { SearchInput } from '@hina-ui/vue'

  const query = ref('Hoshimi Shion')
</script>

<template>
  <SearchInput v-model="query" aria-label="Search" placeholder="Search works" class="w-72" />
</template>
