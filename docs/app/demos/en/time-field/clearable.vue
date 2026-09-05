<script setup lang="ts">
  import { ref } from 'vue'
  import { TimeField } from '@hina-ui/vue'

  const time = ref<string | null>('20:00')
</script>

<template>
  <TimeField v-model="time" clearable aria-label="Stream start" class="w-40" />
</template>
