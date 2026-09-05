<script setup lang="ts">
  import { ref } from 'vue'
  import {
    CheckboxGroup,
    DateField,
    FormField,
    RadioGroup,
    Rating,
    Slider,
    Stack,
  } from '@hina-ui/vue'

  const kinds = [
    { label: '游戏', value: 'game' },
    { label: '小说', value: 'novel' },
    { label: '漫画', value: 'manga' },
  ]
  const kind = ref<string | number | null>('game')
  const tags = ref<Array<string | number>>([])
  const score = ref(4)
  const volume = ref(30)
  const released = ref<string | null>(null)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <FormField label="类型">
      <RadioGroup v-model="kind" :options="kinds" orientation="horizontal" />
    </FormField>
    <FormField label="标签">
      <CheckboxGroup v-model="tags" :options="kinds" orientation="horizontal" />
    </FormField>
    <FormField label="评分">
      <Rating v-model="score" />
    </FormField>
    <FormField label="音量">
      <Slider v-model="volume" />
    </FormField>
    <FormField label="发售日期">
      <DateField v-model="released" />
    </FormField>
  </Stack>
</template>
