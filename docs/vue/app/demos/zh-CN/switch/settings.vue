<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch } from '@hina-ui/vue'

  const sync = ref(true)
</script>

<template>
  <Switch
    v-model="sync"
    control-placement="end"
    block
    description="在其他设备上打开同一部作品时，从上次的位置继续。"
  >
    同步阅读进度
  </Switch>
</template>
