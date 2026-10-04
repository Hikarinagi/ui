<script setup lang="ts">
  import { ref } from 'vue'
  import { PasswordInput } from '@hina-ui/vue'

  const password = ref('')
</script>

<template>
  <PasswordInput
    v-model="password"
    aria-label="Password"
    placeholder="Password"
    autocomplete="current-password"
    class="w-64"
  />
</template>
