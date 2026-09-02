<script setup lang="ts">
  import { ref } from 'vue'
  import { Textarea } from '@hina-ui/vue'

  const text = ref('转学第一天，我在天台遇见了那个抱着旧相机的少女。她说这台相机拍得到明天。')
</script>

<template>
  <Textarea v-model="text" aria-label="作品简介" autosize class="w-full max-w-md" />
</template>
