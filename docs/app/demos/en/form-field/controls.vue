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
    { label: 'Game', value: 'game' },
    { label: 'Novel', value: 'novel' },
    { label: 'Manga', value: 'manga' },
  ]
  const kind = ref<string | number | null>('game')
  const tags = ref<Array<string | number>>([])
  const score = ref(4)
  const volume = ref(30)
  const released = ref<string | null>(null)
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <FormField label="Kind">
      <RadioGroup v-model="kind" :options="kinds" orientation="horizontal" />
    </FormField>
    <FormField label="Tags">
      <CheckboxGroup v-model="tags" :options="kinds" orientation="horizontal" />
    </FormField>
    <FormField label="Score">
      <Rating v-model="score" />
    </FormField>
    <FormField label="Volume">
      <Slider v-model="volume" />
    </FormField>
    <FormField label="Release date">
      <DateField v-model="released" />
    </FormField>
  </Stack>
</template>
