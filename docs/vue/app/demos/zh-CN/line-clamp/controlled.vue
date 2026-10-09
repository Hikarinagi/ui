<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, LineClamp, Stack } from '@hina-ui/vue'

  const expanded = ref(false)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Button
      variant="outline"
      tone="neutral"
      size="sm"
      class="self-start"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起简介' : '展开简介' }}
    </Button>
    <LineClamp v-model:expanded="expanded" :lines="2">
      山顶的气象站只剩下一名观测员。每天早晨六点，他把前一夜的风速与气压抄进日志，再用无线电报给山下的小镇。入冬后的第一场雪封住了山路，无线电的另一端却换成了一个陌生的声音，自称来自三十年前的同一座气象站。
    </LineClamp>
  </Stack>
</template>
