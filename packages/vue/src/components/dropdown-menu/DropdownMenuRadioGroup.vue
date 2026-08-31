<script setup lang="ts">
  import { DropdownMenuRadioGroup } from 'reka-ui'

  defineOptions({ name: 'HnDropdownMenuRadioGroup' })

  const value = defineModel<string>()
</script>

<template>
  <DropdownMenuRadioGroup v-model="value">
    <slot />
  </DropdownMenuRadioGroup>
</template>
