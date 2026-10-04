<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox } from '@hina-ui/vue'

  const weekly = ref(true)
</script>

<template>
  <Checkbox
    v-model="weekly"
    control-placement="end"
    block
    description="每周一发送本周的更新汇总，可以随时退订。"
  >
    订阅周报
  </Checkbox>
</template>
