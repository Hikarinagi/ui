<script setup lang="ts">
  import { ref } from 'vue'
  import { PinInput } from '@hina-ui/vue'

  const code = ref('')
</script>

<template>
  <PinInput v-model="code" type="number" otp aria-label="短信验证码" />
</template>
