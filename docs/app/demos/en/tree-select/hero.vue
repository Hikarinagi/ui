<script setup lang="ts">
  import { ref } from 'vue'
  import { TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>('kyoto')
</script>

<template>
  <TreeSelect v-model="region" :items="regions" aria-label="Region" class="w-64" />
</template>
