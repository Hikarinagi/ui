<script setup lang="ts">
  import { ref } from 'vue'
  import { PinInput } from '@hina-ui/vue'

  const pin = ref('')
</script>

<template>
  <PinInput v-model="pin" :length="4" type="number" mask aria-label="PIN 码" />
</template>
