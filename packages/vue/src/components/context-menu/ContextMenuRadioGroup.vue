<script setup lang="ts">
  import { ContextMenuRadioGroup } from 'reka-ui'

  defineOptions({ name: 'HnContextMenuRadioGroup' })

  const value = defineModel<string>()
</script>

<template>
  <ContextMenuRadioGroup v-model="value">
    <slot />
  </ContextMenuRadioGroup>
</template>
