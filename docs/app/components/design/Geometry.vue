<script setup lang="ts">
  import { Button, Card, Grid, Inline, Input, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const densities = ['comfortable', 'compact'] as const
  const radii = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <Stack gap="lg">
    <Grid class="grid-cols-1 gap-4 sm:grid-cols-2">
      <Card v-for="density in densities" :key="density" :data-density="density" class="shadow-none">
        <Stack>
          <Text weight="medium">{{ t(`designPreview.${density}`) }}</Text>
          <Input
            :aria-label="t(`designPreview.${density}`)"
            :placeholder="t('designPreview.input')"
          />
          <Inline>
            <Button>{{ t('designPreview.primary') }}</Button>
            <Button variant="outline" tone="neutral">{{ t('designPreview.secondary') }}</Button>
          </Inline>
        </Stack>
      </Card>
    </Grid>
    <Grid class="grid-cols-3 gap-4 sm:grid-cols-5">
      <Stack v-for="radius in radii" :key="radius" gap="sm" align="center">
        <Stack
          class="border-accent bg-accent-soft size-16 border"
          :style="{ borderRadius: `var(--hn-radius-${radius})` }"
          aria-hidden="true"
        />
        <Text size="xs" tone="muted" class="font-mono">{{ radius }}</Text>
      </Stack>
    </Grid>
    <Grid class="bg-canvas grid-cols-1 gap-6 rounded-lg p-6 sm:grid-cols-3">
      <Stack
        v-for="shadow in ['sm', 'md', 'lg']"
        :key="shadow"
        class="bg-surface border-line h-24 items-center justify-center rounded-lg border"
        :style="{ boxShadow: `var(--hn-shadow-${shadow})` }"
      >
        <Text size="sm" class="font-mono">{{ `shadow-${shadow}` }}</Text>
      </Stack>
    </Grid>
  </Stack>
</template>
