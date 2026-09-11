<script setup lang="ts">
  import { ref } from 'vue'
  import { Select } from '@hina-ui/vue'

  const work = ref<string | null>('clannad')
  const works = [
    { value: 'summer-pockets', label: 'Summer Pockets' },
    { value: 'clannad', label: 'CLANNAD' },
    { value: 'rewrite', label: 'Rewrite' },
  ]
</script>

<template>
  <Select v-model="work" :options="works" clearable aria-label="作品" class="w-72" />
</template>
