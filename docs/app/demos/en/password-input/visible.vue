<script setup lang="ts">
  import { ref } from 'vue'
  import { PasswordInput, Stack } from '@hina-ui/vue'

  const password = ref('')
  const confirm = ref('')
  const visible = ref(false)
</script>

<template>
  <Stack class="w-64">
    <PasswordInput
      v-model="password"
      v-model:visible="visible"
      aria-label="New password"
      placeholder="New password"
      autocomplete="new-password"
    />
    <PasswordInput
      v-model="confirm"
      v-model:visible="visible"
      aria-label="Confirm password"
      placeholder="Confirm password"
      autocomplete="new-password"
    />
  </Stack>
</template>
