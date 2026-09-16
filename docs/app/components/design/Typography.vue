<script setup lang="ts">
  import { Code, Inline, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const sizes = ['2xl', 'xl', 'lg', 'md', 'base', 'sm', 'xs'] as const
  const weights = ['normal', 'medium', 'semibold'] as const
</script>

<template>
  <Stack gap="none" class="border-line divide-line divide-y rounded-lg border px-5">
    <Inline v-for="size in sizes" :key="size" justify="between" class="min-h-20 py-4">
      <Text :size="size">{{ t('designPreview.typeSample') }}</Text>
      <Code class="text-xs">{{ `--hn-text-${size}` }}</Code>
    </Inline>
    <Inline class="py-5" gap="lg">
      <Text v-for="weight in weights" :key="weight" :weight="weight">{{ weight }} Aa</Text>
    </Inline>
  </Stack>
</template>
