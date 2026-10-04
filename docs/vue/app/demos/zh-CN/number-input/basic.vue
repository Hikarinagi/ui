<script setup lang="ts">
  import { ref } from 'vue'
  import { NumberInput } from '@hina-ui/vue'

  const quantity = ref(1)
</script>

<template>
  <NumberInput v-model="quantity" aria-label="数量" placeholder="数量" class="w-40" />
</template>
