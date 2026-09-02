<script setup lang="ts">
  import { ref } from 'vue'
  import { Textarea } from '@hina-ui/vue'

  const text = ref('')
</script>

<template>
  <Textarea
    v-model="text"
    aria-label="Comment"
    placeholder="Write a comment"
    class="w-full max-w-md"
  />
</template>
