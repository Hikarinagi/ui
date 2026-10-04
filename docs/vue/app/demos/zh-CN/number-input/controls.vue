<script setup lang="ts">
  import { NumberInput } from '@hina-ui/vue'
</script>

<template>
  <NumberInput :controls="false" :min="1" placeholder="页码" aria-label="页码" class="w-40" />
</template>
