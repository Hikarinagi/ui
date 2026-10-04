<script setup lang="ts">
  import { reactive } from 'vue'
  import { Bold, Italic, Strikethrough, Underline } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'

  const marks = reactive({ bold: false, italic: false, underline: false, strike: false })
</script>

<template>
  <Inline gap="xs">
    <Toggle v-model="marks.bold" label="Bold" size="sm">
      <template #icon><Bold /></template>
    </Toggle>
    <Toggle v-model="marks.italic" label="Italic" size="sm">
      <template #icon><Italic /></template>
    </Toggle>
    <Toggle v-model="marks.underline" label="Underline" size="sm">
      <template #icon><Underline /></template>
    </Toggle>
    <Toggle v-model="marks.strike" label="Strikethrough" size="sm">
      <template #icon><Strikethrough /></template>
    </Toggle>
  </Inline>
</template>
