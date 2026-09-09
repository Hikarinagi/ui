<script setup lang="ts">
  import { Button, Card, CloseButton, Heading, Inline, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Card class="w-[300px]">
    <Stack gap="md">
      <Inline justify="between" align="start" :wrap="false">
        <Stack gap="xs">
          <Heading :level="3" size="md">{{ t('landing.wall.discard.title') }}</Heading>
          <Text tone="muted" size="sm">{{ t('landing.wall.discard.body') }}</Text>
        </Stack>
        <CloseButton class="-mt-1 -me-1 shrink-0" />
      </Inline>
      <Inline gap="sm" justify="end">
        <Button size="sm" variant="ghost" tone="neutral">
          {{ t('landing.wall.discard.discard') }}
        </Button>
        <Button size="sm">{{ t('landing.wall.discard.save') }}</Button>
      </Inline>
    </Stack>
  </Card>
</template>
