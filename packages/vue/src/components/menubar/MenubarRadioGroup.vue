<script setup lang="ts">
  import { MenubarRadioGroup } from '../../primitives/menubar'

  defineOptions({ name: 'HnMenubarRadioGroup' })

  const value = defineModel<string>()
</script>

<template>
  <MenubarRadioGroup v-model="value">
    <slot />
  </MenubarRadioGroup>
</template>
