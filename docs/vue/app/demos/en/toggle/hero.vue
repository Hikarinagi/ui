<script setup lang="ts">
  import { ref } from 'vue'
  import { Bold, Italic, Underline } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'

  const bold = ref(true)
  const italic = ref(false)
  const underline = ref(false)
</script>

<template>
  <Inline gap="xs">
    <Toggle v-model="bold" label="Bold">
      <template #icon><Bold /></template>
    </Toggle>
    <Toggle v-model="italic" label="Italic">
      <template #icon><Italic /></template>
    </Toggle>
    <Toggle v-model="underline" label="Underline">
      <template #icon><Underline /></template>
    </Toggle>
  </Inline>
</template>
