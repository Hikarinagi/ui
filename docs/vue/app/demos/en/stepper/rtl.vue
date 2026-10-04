<script setup lang="ts">
  import { Stepper } from '@hina-ui/vue'

  const items = [
    { title: 'الخطوة الأولى', description: 'وصف الخطوة الأولى' },
    { title: 'الخطوة الثانية', description: 'وصف الخطوة الثانية' },
    { title: 'الخطوة الثالثة' },
  ]
</script>

<template>
  <Stepper :items="items" :linear="false" dir="rtl" />
</template>
