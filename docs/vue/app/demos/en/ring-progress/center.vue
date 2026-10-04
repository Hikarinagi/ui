<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import { Inline, RingProgress } from '@hina-ui/vue'

  const format = (value: number, max: number) => `${value}/${max}`
</script>

<template>
  <Inline gap="lg" align="center">
    <RingProgress :value="100" tone="success">
      <Check class="text-success size-6" />
    </RingProgress>
    <RingProgress :value="3" :max="8" show-value :format="format" />
  </Inline>
</template>
