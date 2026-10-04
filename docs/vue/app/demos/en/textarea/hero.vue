<script setup lang="ts">
  import { ref } from 'vue'
  import { Textarea } from '@hina-ui/vue'

  const text = ref(
    'On my first day at the new school I met a girl on the roof holding an old camera. She said it could photograph tomorrow.',
  )
</script>

<template>
  <Textarea v-model="text" aria-label="Synopsis" autosize class="w-full max-w-md" />
</template>
