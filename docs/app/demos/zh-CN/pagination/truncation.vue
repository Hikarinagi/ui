<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination } from '@hina-ui/vue'

  const page = ref(100000)
</script>

<template>
  <Pagination v-model="page" :total="2000000" size="sm" />
</template>
