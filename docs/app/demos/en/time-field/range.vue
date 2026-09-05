<script setup lang="ts">
  import { ref } from 'vue'
  import { TimeField } from '@hina-ui/vue'

  const time = ref<string | null>('21:30')
</script>

<template>
  <TimeField
    v-model="time"
    min="09:00"
    max="18:00"
    placeholder="09:00"
    aria-label="Opening hours"
    class="w-40"
  />
</template>
