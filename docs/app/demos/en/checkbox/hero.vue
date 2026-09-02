<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox } from '@hina-ui/vue'

  const notify = ref(true)
</script>

<template>
  <Checkbox v-model="notify">Notify me about new chapters</Checkbox>
</template>
