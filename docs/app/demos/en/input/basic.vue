<script setup lang="ts">
  import { ref } from 'vue'
  import { Input } from '@hina-ui/vue'

  const name = ref('')
</script>

<template>
  <Input v-model="name" aria-label="Nickname" placeholder="Nickname" class="w-72" />
</template>
