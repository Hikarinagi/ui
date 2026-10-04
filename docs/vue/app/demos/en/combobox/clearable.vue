<script setup lang="ts">
  import { ref } from 'vue'
  import { Combobox } from '@hina-ui/vue'

  const work = ref<string | null>('clannad')
  const works = [
    { value: 'summer-pockets', label: 'Summer Pockets' },
    { value: 'clannad', label: 'CLANNAD' },
    { value: 'rewrite', label: 'Rewrite' },
  ]
</script>

<template>
  <Combobox v-model="work" :options="works" clearable aria-label="Work" class="w-72" />
</template>
