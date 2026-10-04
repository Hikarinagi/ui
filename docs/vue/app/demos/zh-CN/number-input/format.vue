<script setup lang="ts">
  import { ref } from 'vue'
  import { NumberInput, Stack } from '@hina-ui/vue'

  const price = ref(1280)
  const discount = ref(0.35)
  const euro = ref(1234.5)
</script>

<template>
  <Stack class="w-48">
    <NumberInput
      v-model="price"
      :format-options="{ style: 'currency', currency: 'CNY' }"
      aria-label="价格"
    />
    <NumberInput
      v-model="discount"
      :step="0.01"
      :min="0"
      :max="1"
      :format-options="{ style: 'percent' }"
      aria-label="折扣"
    />
    <NumberInput
      v-model="euro"
      locale="de-DE"
      :format-options="{ style: 'currency', currency: 'EUR' }"
      aria-label="欧元价格"
    />
  </Stack>
</template>
