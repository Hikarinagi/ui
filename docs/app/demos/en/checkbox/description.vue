<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox } from '@hina-ui/vue'

  const weekly = ref(true)
</script>

<template>
  <Checkbox
    v-model="weekly"
    description="A digest of the week's updates every Monday. Unsubscribe any time."
  >
    Weekly newsletter
  </Checkbox>
</template>
