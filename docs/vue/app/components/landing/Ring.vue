<script setup lang="ts">
  import { Inline, RingProgress, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Inline gap="md" align="center" class="w-[260px]">
    <RingProgress :value="72" show-value :aria-label="t('landing.wall.ring.label')" />
    <Stack gap="none">
      <Text size="sm" weight="medium">{{ t('landing.wall.ring.label') }}</Text>
      <Text tone="muted" size="sm">{{ t('landing.wall.ring.hint') }}</Text>
    </Stack>
  </Inline>
</template>
