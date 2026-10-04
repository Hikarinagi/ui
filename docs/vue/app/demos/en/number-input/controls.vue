<script setup lang="ts">
  import { NumberInput } from '@hina-ui/vue'
</script>

<template>
  <NumberInput :controls="false" :min="1" placeholder="Page" aria-label="Page" class="w-40" />
</template>
