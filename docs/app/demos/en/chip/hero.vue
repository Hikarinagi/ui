<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hina-ui/vue'

  const genres = ['Sci-fi', 'Fantasy', 'Slice of life', 'Mystery', 'Romance']
  const picked = ref(['Sci-fi', 'Slice of life'])

  function toggle(genre: string, on: boolean) {
    picked.value = on ? [...picked.value, genre] : picked.value.filter(item => item !== genre)
  }
</script>

<template>
  <Inline>
    <Chip
      v-for="genre in genres"
      :key="genre"
      selectable
      :selected="picked.includes(genre)"
      @update:selected="toggle(genre, $event)"
    >
      {{ genre }}
    </Chip>
  </Inline>
</template>
