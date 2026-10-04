<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, Link, PinInput, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const code = ref('4320')
</script>

<template>
  <Stack gap="sm" align="start" class="w-[280px]">
    <Stack gap="none">
      <Text size="sm" weight="medium">{{ t('landing.wall.verify.label') }}</Text>
      <Text tone="muted" size="sm">{{ t('landing.wall.verify.hint') }}</Text>
    </Stack>
    <PinInput v-model="code" type="number" otp :aria-label="t('landing.wall.verify.label')" />
    <Inline gap="xs" align="center">
      <Text tone="muted" size="sm">{{ t('landing.wall.verify.resendPrefix') }}</Text>
      <Link as="button" type="button" class="text-sm">
        {{ t('landing.wall.verify.resend') }}
      </Link>
    </Inline>
  </Stack>
</template>
