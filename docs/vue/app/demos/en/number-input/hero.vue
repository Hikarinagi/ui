<script setup lang="ts">
  import { NumberInput } from '@hina-ui/vue'
</script>

<template>
  <NumberInput :default-value="3" :min="0" :max="10" aria-label="Quantity" class="w-40" />
</template>
