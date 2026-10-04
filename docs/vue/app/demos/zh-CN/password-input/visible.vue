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
      aria-label="新密码"
      placeholder="新密码"
      autocomplete="new-password"
    />
    <PasswordInput
      v-model="confirm"
      v-model:visible="visible"
      aria-label="确认密码"
      placeholder="确认密码"
      autocomplete="new-password"
    />
  </Stack>
</template>
