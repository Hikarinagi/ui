<script setup lang="ts">
  import { ref } from 'vue'
  import { Textarea } from '@hina-ui/vue'

  const text = ref('')
</script>

<template>
  <Textarea v-model="text" aria-label="评论" placeholder="输入评论" class="w-full max-w-md" />
</template>
