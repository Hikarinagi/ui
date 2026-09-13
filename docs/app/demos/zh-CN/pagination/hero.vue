<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination } from '@hina-ui/vue'

  const page = ref(8)
</script>

<template>
  <Pagination v-model="page" :total="246" show-info show-jump />
</template>
