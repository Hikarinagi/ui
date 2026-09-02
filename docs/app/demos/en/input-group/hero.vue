<script setup lang="ts">
  import { ref } from 'vue'
  import { Input, InputGroup, InputGroupAddon } from '@hina-ui/vue'

  const site = ref('shion')
</script>

<template>
  <InputGroup class="w-80">
    <InputGroupAddon>https://</InputGroupAddon>
    <Input v-model="site" aria-label="Site name" />
    <InputGroupAddon>.hoshimi.moe</InputGroupAddon>
  </InputGroup>
</template>
