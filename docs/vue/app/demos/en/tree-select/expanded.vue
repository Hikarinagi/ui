<script setup lang="ts">
  import { ref } from 'vue'
  import { TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>(null)
</script>

<template>
  <TreeSelect
    v-model="region"
    :items="regions"
    :default-expanded="['jp', 'kanto']"
    placeholder="Choose a region"
    aria-label="Region"
    class="w-64"
  />
</template>
