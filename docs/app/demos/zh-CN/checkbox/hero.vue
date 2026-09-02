<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox } from '@hina-ui/vue'

  const notify = ref(true)
</script>

<template>
  <Checkbox v-model="notify">有新章节时通知我</Checkbox>
</template>
