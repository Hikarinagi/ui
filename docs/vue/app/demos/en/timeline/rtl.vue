<script setup lang="ts">
  import { Timeline } from '@hina-ui/vue'

  const items = [
    { id: 'a', title: 'البند الأول', description: 'وصف موجز للبند الأول.', time: '09:00' },
    { id: 'b', title: 'البند الثاني', description: 'وصف البند الثاني.', time: '09:20' },
    { id: 'c', title: 'البند الثالث', time: '09:40' },
  ]
</script>

<template>
  <Timeline :items="items" dir="rtl" />
</template>
