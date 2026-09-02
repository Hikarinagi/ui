<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hina-ui/vue'

  const tags = ref(['Sci-fi', 'School', 'Romance', 'Ensemble'])
</script>

<template>
  <Inline>
    <Chip
      v-for="tag in tags"
      :key="tag"
      removable
      @remove="tags = tags.filter(item => item !== tag)"
    >
      {{ tag }}
    </Chip>
  </Inline>
</template>
