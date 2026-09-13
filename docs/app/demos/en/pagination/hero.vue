<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination } from '@hina-ui/vue'

  const page = ref(3)
</script>

<template>
  <Pagination v-model="page" :total="120" />
</template>
