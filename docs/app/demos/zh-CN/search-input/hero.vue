<script setup lang="ts">
  import { ref } from 'vue'
  import { SearchInput } from '@hina-ui/vue'

  const query = ref('星见书音')
</script>

<template>
  <SearchInput v-model="query" aria-label="搜索" placeholder="搜索作品" class="w-72" />
</template>
