<script setup lang="ts">
  import { Card, Code, Grid, Inline, Stack, Tag, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const tones = ['accent', 'success', 'warning', 'danger', 'info'] as const
  const surfaces = ['canvas', 'surface', 'subtle', 'inset'] as const
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const surfaceTokens = {
    canvas: '--hn-bg-canvas',
    surface: '--hn-surface',
    subtle: '--hn-bg-subtle',
    inset: '--hn-bg-inset',
  }
</script>

<template>
  <Stack gap="lg">
    <Grid class="grid-cols-1 gap-3 sm:grid-cols-2">
      <Card v-for="tone in tones" :key="tone" class="shadow-none">
        <Stack gap="sm">
          <Inline justify="between">
            <Text weight="medium">{{ t(`designPreview.${tone}`) }}</Text>
            <Tag :tone="tone">{{ tone }}</Tag>
          </Inline>
          <Inline :wrap="false" gap="sm">
            <Stack
              class="h-14 flex-1 items-center justify-center rounded-sm"
              :style="{ background: `var(--hn-${tone})`, color: `var(--hn-${tone}-on)` }"
            >
              <Text as="span" size="sm" class="text-inherit">Aa</Text>
            </Stack>
            <Stack
              class="h-14 flex-1 items-center justify-center rounded-sm"
              :style="{ background: `var(--hn-${tone}-soft)`, color: `var(--hn-${tone}-text)` }"
            >
              <Text as="span" size="sm" class="text-inherit">Aa</Text>
            </Stack>
          </Inline>
          <Code class="w-fit text-xs">{{ `--hn-${tone}` }}</Code>
        </Stack>
      </Card>
      <Card class="shadow-none">
        <Stack gap="sm">
          <Text weight="medium">{{ t('designPreview.foreground') }}</Text>
          <Text>{{ t('designPreview.defaultText') }}</Text>
          <Text tone="muted">{{ t('designPreview.mutedText') }}</Text>
          <Text tone="faint">{{ t('designPreview.faintText') }}</Text>
        </Stack>
      </Card>
    </Grid>
    <Grid class="grid-cols-2 gap-3 sm:grid-cols-4">
      <Stack v-for="surface in surfaces" :key="surface" gap="sm">
        <Stack
          class="border-line h-20 items-center justify-center rounded-md border"
          :style="{ background: `var(${surfaceTokens[surface]})` }"
        >
          <Text size="sm">{{ surface }}</Text>
        </Stack>
        <Text size="xs" tone="muted" class="break-all font-mono">{{ surfaceTokens[surface] }}</Text>
      </Stack>
    </Grid>
    <Stack gap="sm">
      <Text size="sm" weight="medium">{{ t('designPreview.brandScale') }}</Text>
      <Grid class="grid-cols-6 gap-2 sm:grid-cols-11">
        <Stack v-for="step in steps" :key="step" gap="xs" align="center">
          <Stack
            class="border-line h-12 w-full rounded-sm border"
            :style="{ background: `var(--color-brand-${step})` }"
            aria-hidden="true"
          />
          <Text size="xs" tone="muted" class="tabular-nums">{{ step }}</Text>
        </Stack>
      </Grid>
    </Stack>
  </Stack>
</template>
