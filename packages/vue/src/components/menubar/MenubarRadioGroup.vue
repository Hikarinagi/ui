<script setup lang="ts">
  import { MenubarRadioGroup } from 'reka-ui'

  defineOptions({ name: 'HnMenubarRadioGroup' })

  const value = defineModel<string>()
</script>

<template>
  <MenubarRadioGroup v-model="value">
    <slot />
  </MenubarRadioGroup>
</template>
