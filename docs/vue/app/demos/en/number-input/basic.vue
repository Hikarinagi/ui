<script setup lang="ts">
  import { ref } from 'vue'
  import { NumberInput } from '@hina-ui/vue'

  const quantity = ref(1)
</script>

<template>
  <NumberInput v-model="quantity" aria-label="Quantity" placeholder="Quantity" class="w-40" />
</template>
