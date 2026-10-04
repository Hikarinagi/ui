<script setup lang="ts">
  import { ref } from 'vue'
  import { Combobox } from '@hina-ui/vue'

  const work = ref<string | null>(null)
  const works = [
    { value: 'summer-pockets', label: 'Summer Pockets' },
    { value: 'clannad', label: 'CLANNAD' },
    { value: 'little-busters', label: 'Little Busters!' },
    { value: 'rewrite', label: 'Rewrite' },
    { value: 'air', label: 'AIR' },
    { value: 'kanon', label: 'Kanon' },
  ]
</script>

<template>
  <Combobox
    v-model="work"
    :options="works"
    placeholder="Search works"
    aria-label="Work"
    class="w-64"
  />
</template>
