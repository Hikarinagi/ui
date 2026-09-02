<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox, Inline } from '@hina-ui/vue'

  const rows = ref([true, false, false])
</script>

<template>
  <Inline gap="sm">
    <Checkbox
      v-for="(_, index) in rows"
      :key="index"
      v-model="rows[index]"
      :aria-label="`选择第 ${index + 1} 行`"
    />
  </Inline>
</template>
