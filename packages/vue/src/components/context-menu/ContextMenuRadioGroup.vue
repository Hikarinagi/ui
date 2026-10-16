<script setup lang="ts">
  import { ContextMenuRadioGroup } from '../../primitives/context-menu'

  defineOptions({ name: 'HnContextMenuRadioGroup' })

  const value = defineModel<string>()
</script>

<template>
  <ContextMenuRadioGroup v-model="value">
    <slot />
  </ContextMenuRadioGroup>
</template>
