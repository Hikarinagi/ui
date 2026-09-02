<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hina-ui/vue'

  const genres = ['科幻', '奇幻', '日常', '悬疑', '恋爱']
  const picked = ref(['科幻', '日常'])

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
