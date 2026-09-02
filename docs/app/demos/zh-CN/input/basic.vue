<script setup lang="ts">
  import { ref } from 'vue'
  import { Input } from '@hina-ui/vue'

  const name = ref('')
</script>

<template>
  <Input v-model="name" aria-label="昵称" placeholder="昵称" class="w-72" />
</template>
