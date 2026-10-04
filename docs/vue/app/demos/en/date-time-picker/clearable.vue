<script setup lang="ts">
  import { ref } from 'vue'
  import { DateTimePicker } from '@hina-ui/vue'

  const at = ref<string | null>('2026-09-04T20:00')
</script>

<template>
  <DateTimePicker v-model="at" clearable aria-label="Publish time" class="w-80" />
</template>
