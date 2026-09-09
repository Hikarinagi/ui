<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const range = ref<[number, number]>([120, 680])
</script>

<template>
  <Stack gap="sm" class="w-[256px]">
    <Text size="sm" weight="medium">{{ t('landing.wall.volumes.label') }}</Text>
    <RangeSlider
      v-model="range"
      :min="0"
      :max="1000"
      :step="10"
      :aria-label="t('landing.wall.volumes.label')"
    />
  </Stack>
</template>
