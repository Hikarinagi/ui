<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hikarinagi/ui'

  const tags = ref(['科幻', '校园', '恋爱', '群像'])
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
