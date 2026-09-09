<script setup lang="ts">
  import { ref } from 'vue'
  import { Input } from '@hina-ui/vue'

  const keyword = ref('Spice and Wolf')
</script>

<template>
  <Input v-model="keyword" clearable aria-label="Keyword" placeholder="Keyword" class="w-72" />
</template>
